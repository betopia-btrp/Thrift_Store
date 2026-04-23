<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Models\Payment;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Stripe;
use Stripe\Webhook;

class PaymentController extends Controller
{
    // GET /api/v1/payments/checkout/{product_id}
    // Seller calls this to get the Stripe Checkout URL
    public function createCheckoutSession(string $productId)
    {
        $seller  = auth('api')->user();
        $product = Product::where('product_id', $productId)
            ->where('seller_id', $seller->user_id)
            ->where('status', 'draft')
            ->first();

        if (! $product) {
            return ApiResponse::error('Draft product not found or does not belong to you', 404);
        }

        Stripe::setApiKey(config('services.stripe.secret'));

        $session = \Stripe\Checkout\Session::create([
            'payment_method_types' => ['card'],
            'line_items'           => [[
                'price_data' => [
                    'currency'     => 'usd',
                    'unit_amount'  => config('services.stripe.listing_fee'),
                    'product_data' => [
                        'name'        => 'Listing Fee',
                        'description' => 'Fee to publish: ' . $product->title,
                    ],
                ],
                'quantity' => 1,
            ]],
            'mode'          => 'payment',
            'success_url'   => env('FRONTEND_URL', 'http://localhost:3000') . '/listings/success?product_id=' . $productId,
            'cancel_url'    => env('FRONTEND_URL', 'http://localhost:3000') . '/listings/create?cancelled=true',
            'metadata'      => [
                'product_id' => $productId,
                'seller_id'  => $seller->user_id,
            ],
        ]);

        // Create a pending payment record
        Payment::create([
            'payment_id'      => Str::uuid(),
            'seller_id'       => $seller->user_id,
            'product_id'      => $productId,
            'amount'          => config('services.stripe.listing_fee') / 100,
            'currency'        => 'USD',
            'method'          => 'card',
            'status'          => 'pending',
            'transaction_ref' => $session->id,
        ]);

        return ApiResponse::success([
            'checkout_url' => $session->url,
            'session_id'   => $session->id,
        ], 'Redirect user to checkout_url to complete payment');
    }

    // POST /api/v1/webhook/stripe
    // Stripe calls this after payment — must be public, no auth
    public function handleWebhook(Request $request)
    {
        $payload   = $request->getContent();
        $sigHeader = $request->header('Stripe-Signature');

        try {
            $event = Webhook::constructEvent(
                $payload,
                $sigHeader,
                config('services.stripe.webhook_secret')
            );
        } catch (SignatureVerificationException $e) {
            return response()->json(['error' => 'Invalid signature'], 400);
        }

        if ($event->type === 'checkout.session.completed') {
            $session   = $event->data->object;
            $productId = $session->metadata->product_id;
            $sellerId  = $session->metadata->seller_id;

            // Activate the product
            $product = Product::where('product_id', $productId)
                ->where('seller_id', $sellerId)
                ->first();

            if ($product) {
                $product->update(['status' => 'active']);
            }

            // Update payment record
            Payment::where('transaction_ref', $session->id)->update([
                'status'           => 'paid',
                'gateway_response' => json_encode($session),
                'paid_at'          => now(),
            ]);

            // Create notification for seller
            \App\Models\Notification::create([
                'notification_id' => Str::uuid(),
                'user_id'         => $sellerId,
                'type'            => 'listing_published',
                'body'            => 'Your listing has been published successfully.',
                'status'          => 'unread',
            ]);
        }

        if ($event->type === 'checkout.session.expired') {
            $session = $event->data->object;
            Payment::where('transaction_ref', $session->id)
                ->update(['status' => 'failed']);
        }

        return response()->json(['received' => true], 200);
    }

    // GET /api/v1/payments  — seller views their payment receipts
    public function index()
    {
        $payments = Payment::with('product:product_id,title')
            ->where('seller_id', auth('api')->user()->user_id)
            ->where('status', 'paid')
            ->orderBy('paid_at', 'desc')
            ->get();

        return ApiResponse::success($payments);
    }
}