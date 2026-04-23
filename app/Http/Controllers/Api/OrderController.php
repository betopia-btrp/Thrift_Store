<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Http\Requests\Order\UpdateOrderStatusRequest;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    // POST /api/v1/orders — buyer places an order
    public function store(StoreOrderRequest $request)
    {
        $buyer   = auth('api')->user();
        if ($buyer->role === 'admin') {
            return ApiResponse::error('Administrators cannot place orders.', 403);
        }
        $product = Product::where('product_id', $request->product_id)
            ->where('status', 'active')
            ->first();

        if (! $product) {
            return ApiResponse::error('This listing is no longer available', 422);
        }

        // Buyer cannot order their own listing
        if ($product->seller_id === $buyer->user_id) {
            return ApiResponse::error('You cannot place an order on your own listing', 422);
        }

        $order = Order::create([
            'order_id'   => Str::uuid(),
            'buyer_id'   => $buyer->user_id,
            'product_id' => $request->product_id,
            'status'     => 'pending',
            'buyer_note' => $request->buyer_note,
        ]);

        // Log initial status
        OrderStatusHistory::create([
            'order_id'   => $order->order_id,
            'changed_by' => $buyer->user_id,
            'old_status' => 'none',
            'new_status' => 'pending',
            'note'       => 'Order placed by buyer',
            'changed_at' => now(),
        ]);

        // Notify seller
        $this->notify(
            $product->seller_id,
            'new_order',
            "You have a new order for \"{$product->title}\"."
        );

        // Notify buyer
        $this->notify(
            $buyer->user_id,
            'order_confirmed',
            "Your order for \"{$product->title}\" has been placed. The seller will confirm soon."
        );

        $order->load(['product:product_id,title,price,images', 'buyer:user_id,name']);

        return ApiResponse::created($order, 'Order placed successfully');
    }

    // PATCH /api/v1/orders/{id}/status — seller updates order status
    public function updateStatus(UpdateOrderStatusRequest $request, string $id)
    {
        $seller = auth('api')->user();
        $order  = Order::with('product')->where('order_id', $id)->first();

        if (! $order) {
            return ApiResponse::error('Order not found', 404);
        }

        // Only the seller of that product can update status
        if ($order->product->seller_id !== $seller->user_id) {
            return ApiResponse::error('You are not the seller for this order', 403);
        }

        $newStatus = $request->status;

        if (! $order->canTransitionTo($newStatus)) {
            return ApiResponse::error(
                "Cannot transition from '{$order->status}' to '{$newStatus}'",
                422
            );
        }

        $oldStatus = $order->status;
        $order->update(['status' => $newStatus]);

        // Log status change
        OrderStatusHistory::create([
            'order_id'   => $order->order_id,
            'changed_by' => $seller->user_id,
            'old_status' => $oldStatus,
            'new_status' => $newStatus,
            'note'       => $request->note,
            'changed_at' => now(),
        ]);

        // Notify buyer of status change
        $messages = [
            'confirmed'  => "Your order for \"{$order->product->title}\" has been confirmed by the seller.",
            'dispatched' => "Your order for \"{$order->product->title}\" has been dispatched. Arrange pickup/delivery with the seller.",
            'completed'  => "Your order for \"{$order->product->title}\" is complete. Please leave a review!",
        ];

        $this->notify(
            $order->buyer_id,
            'order_status_' . $newStatus,
            $messages[$newStatus] ?? "Your order status has been updated to {$newStatus}."
        );

        $order->load('statusHistory');

        return ApiResponse::success($order, "Order status updated to {$newStatus}");
    }

    // PATCH /api/v1/orders/{id}/cancel — buyer cancels order
    public function cancel(Request $request, string $id)
    {
        $buyer = auth('api')->user();
        $order = Order::with('product')->where('order_id', $id)
            ->where('buyer_id', $buyer->user_id)
            ->first();

        if (! $order) {
            return ApiResponse::error('Order not found', 404);
        }

        // Can only cancel before dispatched
        if (! in_array($order->status, ['pending', 'confirmed'])) {
            return ApiResponse::error(
                'Order cannot be cancelled after it has been dispatched',
                422
            );
        }

        $oldStatus = $order->status;

        $order->update([
            'status'        => 'cancelled',
            'cancelled_at'  => now(),
            'cancel_reason' => $request->input('cancel_reason', 'Cancelled by buyer'),
        ]);

        OrderStatusHistory::create([
            'order_id'   => $order->order_id,
            'changed_by' => $buyer->user_id,
            'old_status' => $oldStatus,
            'new_status' => 'cancelled',
            'note'       => $request->input('cancel_reason', 'Cancelled by buyer'),
            'changed_at' => now(),
        ]);

        // Notify seller
        $this->notify(
            $order->product->seller_id,
            'order_cancelled',
            "The buyer has cancelled the order for \"{$order->product->title}\"."
        );

        return ApiResponse::success(null, 'Order cancelled successfully');
    }

    // GET /api/v1/orders — buyer sees their orders
    public function buyerOrders()
    {
        $orders = Order::with([
            'product:product_id,title,price,images,seller_id',
            'statusHistory',
            'review:review_id,order_id,rating,comment',
        ])
            ->where('buyer_id', auth('api')->user()->user_id)
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return ApiResponse::success($orders);
    }

    // GET /api/v1/seller/orders — seller sees their orders
    public function sellerOrders()
    {
        $seller = auth('api')->user();

        $orders = Order::with([
            'product:product_id,title,price,images',
            'buyer:user_id,name,phone',
            'statusHistory',
        ])
            ->whereHas('product', function ($q) use ($seller) {
                $q->where('seller_id', $seller->user_id);
            })
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return ApiResponse::success($orders);
    }

    // GET /api/v1/orders/{id} — single order detail
    public function show(string $id)
    {
        $user  = auth('api')->user();
        $order = Order::with([
            'product:product_id,title,price,images,seller_id,location',
            'buyer:user_id,name,phone',
            'statusHistory',
            'review',
        ])->where('order_id', $id)->first();

        if (! $order) {
            return ApiResponse::error('Order not found', 404);
        }

        // Only buyer or seller can view this order
        $isBuyer  = $order->buyer_id === $user->user_id;
        $isSeller = $order->product->seller_id === $user->user_id;

        if (! $isBuyer && ! $isSeller) {
            return ApiResponse::error('Forbidden', 403);
        }

        return ApiResponse::success($order);
    }

    private function notify(string $userId, string $type, string $body): void
    {
        Notification::create([
            'notification_id' => Str::uuid(),
            'user_id'         => $userId,
            'type'            => $type,
            'body'            => $body,
            'status'          => 'unread',
        ]);
    }
}