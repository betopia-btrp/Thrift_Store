<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Models\Notification;
use App\Models\Payment;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Stripe\Exception\ApiErrorException;
use Stripe\Exception\SignatureVerificationException;
use Stripe\StripeClient;
use Stripe\Webhook;

class PaymentController extends Controller
{
    private function stripe(): StripeClient
    {
        $secret = config('services.stripe.secret');
        if (! $secret) {
            throw new \RuntimeException('Stripe secret key is not configured in .env');
        }
        return new StripeClient($secret);
    }

    // POST /api/v1/payments/checkout
    // Seller sends an array of product_ids to pay for at once
    public function createCheckoutSession(Request $request)
    {
        $request->validate([
            'product_ids'   => ['required', 'array', 'min:1'],
            'product_ids.*' => ['required', 'uuid', 'exists:products,product_id'],
        ]);

        $seller     = auth('api')->user();
        $listingFee = (int) config('services.stripe.listing_fee', 500);
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');

        // Fetch only draft products that belong to this seller
        $products = Product::whereIn('product_id', $request->product_ids)
            ->where('seller_id', $seller->user_id)
            ->where('status', 'draft')
            ->get();

        if ($products->isEmpty()) {
            return ApiResponse::error(
                'No draft products found. Products may already be active.',
                404
            );
        }

        $productCount = $products->count();
        $totalAmount  = $listingFee * $productCount; // e.g. 500 * 3 = 1500 cents

        // Build line items — one per product
        $lineItems = $products->map(function ($product) use ($listingFee) {
            return [
                'price_data' => [
                    'currency'     => 'usd',
                    'unit_amount'  => $listingFee,
                    'product_data' => [
                        'name'        => 'Listing Fee: ' . $product->title,
                        'description' => 'Fee to publish listing',
                    ],
                ],
                'quantity' => 1,
            ];
        })->toArray();

        // Store product IDs as comma-separated string in metadata
        $productIdsString = $products->pluck('product_id')->implode(',');

        try {
            $stripe  = $this->stripe();
            $session = $stripe->checkout->sessions->create([
                'payment_method_types' => ['card'],
                'line_items'           => $lineItems,
                'mode'                 => 'payment',
                'success_url'          => $frontendUrl . '/listings/success?session_id={CHECKOUT_SESSION_ID}',
                'cancel_url'           => $frontendUrl . '/dashboard/seller?cancelled=true',
                'metadata'             => [
                    'product_ids' => $productIdsString,
                    'seller_id'   => $seller->user_id,
                    'item_count'  => $productCount,
                ],
            ]);
        } catch (ApiErrorException $e) {
            return ApiResponse::error('Stripe error: ' . $e->getMessage(), 502);
        } catch (\RuntimeException $e) {
            return ApiResponse::error($e->getMessage(), 500);
        }

        // Create one pending payment record per product
        foreach ($products as $product) {
            Payment::create([
                'payment_id'      => Str::uuid(),
                'seller_id'       => $seller->user_id,
                'product_id'      => $product->product_id,
                'amount'          => $listingFee / 100,
                'currency'        => 'USD',
                'method'          => 'card',
                'status'          => 'pending',
                'transaction_ref' => $session->id,
            ]);
        }

        return ApiResponse::success([
            'checkout_url'  => $session->url,
            'session_id'    => $session->id,
            'products_count'=> $productCount,
            'total_amount'  => $totalAmount / 100,
        ], "Redirecting to pay for {$productCount} listing(s)");
    }

    // POST /api/v1/webhook/stripe
    public function handleWebhook(Request $request)
    {
        $payload   = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');
        $secret    = config('services.stripe.webhook_secret');

        if (! $secret) {
            \Log::error('Stripe webhook secret not configured');
            return response()->json(['error' => 'Webhook not configured'], 500);
        }

        try {
            $event = Webhook::constructEvent($payload, $sigHeader, $secret);
        } catch (SignatureVerificationException $e) {
            \Log::error('Stripe webhook signature failed: ' . $e->getMessage());
            return response()->json(['error' => 'Invalid signature'], 400);
        } catch (\Exception $e) {
            \Log::error('Stripe webhook error: ' . $e->getMessage());
            return response()->json(['error' => 'Webhook error'], 400);
        }

        \Log::info('Stripe webhook received: ' . $event->type);

        if ($event->type === 'checkout.session.completed') {
            $session   = $event->data->object;
            $sessionId = $session->id;
            $sellerId  = $session->metadata->seller_id ?? null;

            \Log::info("Processing completed session: {$sessionId} for seller: {$sellerId}");

            // Find all pending payments for this session
            // This is reliable — no metadata character limits
            $pendingPayments = Payment::where('transaction_ref', $sessionId)
                ->where('status', 'pending')
                ->get();

            \Log::info("Found {$pendingPayments->count()} pending payments for session {$sessionId}");

            if ($pendingPayments->isEmpty()) {
                \Log::warning("No pending payments found for session: {$sessionId}");
                return response()->json(['received' => true], 200);
            }

            $activatedCount = 0;

            foreach ($pendingPayments as $payment) {
                // Activate the product
                $product = Product::where('product_id', $payment->product_id)->first();

                if ($product) {
                    $product->update(['status' => 'active']);
                    $activatedCount++;
                    \Log::info("Activated product: {$product->product_id} - {$product->title}");
                } else {
                    \Log::warning("Product not found: {$payment->product_id}");
                }

                // Mark payment as paid
                $payment->update([
                    'status'           => 'paid',
                    'gateway_response' => json_encode((array) $session),
                    'paid_at'          => now(),
                ]);
            }

            // Send notification
            if ($sellerId && $activatedCount > 0) {
                Notification::create([
                    'notification_id' => Str::uuid(),
                    'user_id'         => $sellerId,
                    'type'            => 'listing_published',
                    'body'            => "{$activatedCount} listing(s) published successfully after payment.",
                    'status'          => 'unread',
                ]);
            }

            \Log::info("Webhook processed: activated {$activatedCount} products");
        }

        if ($event->type === 'checkout.session.expired') {
            $session = $event->data->object;
            Payment::where('transaction_ref', $session->id)
                ->update(['status' => 'failed']);
            \Log::info("Session expired: {$session->id}");
        }

        return response()->json(['received' => true], 200);
    }

    // GET /api/v1/payments — seller's payment receipts
    public function index()
    {
        $seller   = auth('api')->user();

        $payments = Payment::with('product:product_id,title')
            ->where('seller_id', $seller->user_id)
            ->orderBy('created_at', 'desc')
            ->get();

        // Group by transaction_ref
        $grouped = $payments->groupBy('transaction_ref')->map(function ($group) {
            $first  = $group->first()  ;
            $status = $group->every(fn($p) => $p->status === 'paid')
                ? 'paid'
                : ($group->every(fn($p) => $p->status === 'failed')
                    ? 'failed'
                    : 'partial');

            return [
                'transaction_ref' => $first->transaction_ref,
                'paid_at'         => $first->paid_at,
                'created_at'      => $first->created_at,
                'currency'        => $first->currency,
                'total_amount'    => $group->sum('amount'),
                'item_count'      => $group->count(),
                'status'          => $status,
                'method'          => $first->method,
                'products'        => $group->map(fn($p) => [
                    'payment_id'  => $p->payment_id,
                    'product_id'  => $p->product_id,
                    'title'       => $p->product?->title ?? 'Deleted listing',
                    'amount'      => $p->amount,
                    'status'      => $p->status,
                ]),
            ];
        })->values();

        return ApiResponse::success($grouped);
    }

    // GET /api/v1/payments/due — how much the seller owes for draft listings
    public function due()
    {
        $seller     = auth('api')->user();
        $listingFee = config('services.stripe.listing_fee', 500) / 100;

        $draftCount  = Product::where('seller_id', $seller->user_id)
            ->where('status', 'draft')
            ->count();

        $draftProducts = Product::where('seller_id', $seller->user_id)
            ->where('status', 'draft')
            ->get(['product_id', 'title', 'created_at']);

        return ApiResponse::success([
            'draft_count'    => $draftCount,
            'fee_per_listing'=> $listingFee,
            'total_due'      => $draftCount * $listingFee,
            'draft_products' => $draftProducts,
        ]);
    }
}