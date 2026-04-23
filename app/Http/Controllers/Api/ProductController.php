<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    // GET /api/v1/products  — public search & browse
    public function index(Request $request)
    {
        $query = Product::with(['seller:user_id,name', 'category:category_id,category_name'])
            ->where('status', 'active');

        // Keyword search
        if ($request->filled('q')) {
            $search = $request->q;
            $query->whereRaw(
                "to_tsvector('english', title || ' ' || description) @@ plainto_tsquery(?)",
                [$search]
            );
        }

        // Filters
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->filled('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }

        if ($request->filled('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        if ($request->filled('condition')) {
            $query->where('condition', $request->condition);
        }

        if ($request->filled('location')) {
            $query->where('location', 'ilike', '%' . $request->location . '%');
        }

        // Sorting
        switch ($request->get('sort', 'newest')) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $products = $query->paginate(20);

        // Append seller avg rating to each product
        $products->getCollection()->transform(function ($product) {
            $product->seller_avg_rating = $this->getSellerAvgRating($product->seller_id);
            return $product;
        });

        return ApiResponse::success($products);
    }

    // GET /api/v1/products/{id}  — public single listing
    public function show(string $id)
    {
        $product = Product::with([
            'seller:user_id,name,profile_photo_url',
            'category:category_id,category_name',
        ])->where('product_id', $id)->first();

        if (! $product) {
            return ApiResponse::error('Product not found', 404);
        }

        $product->seller_avg_rating = $this->getSellerAvgRating($product->seller_id);

        return ApiResponse::success($product);
    }

    // POST /api/v1/products  — seller creates listing
    public function store(StoreProductRequest $request)
    {
        $seller = auth('api')->user();

        if ($seller->role === 'admin') {
            return ApiResponse::error('Administrators cannot create product listings.', 403);
        }

        // Upload images
        $imagePaths = [];
        foreach ($request->file('images') as $image) {
            $path = $image->store('products', 'public');
            $imagePaths[] = '/storage/' . $path;
        }

        $product = Product::create([
            'product_id'  => Str::uuid(),
            'seller_id'   => $seller->user_id,
            'category_id' => $request->category_id,
            'title'       => $request->title,
            'description' => $request->description,
            'price'       => $request->price,
            'condition'   => $request->condition,
            'images'      => $imagePaths,
            'status'      => 'draft',
            'location'    => $request->location,
            'expires_at'  => now()->addDays(60),
        ]);

        return ApiResponse::created([
            'product'     => $product,
            'next_step'   => 'Pay listing fee to publish',
            'payment_url' => url("/api/v1/payments/checkout/{$product->product_id}"),
        ], 'Listing created as draft. Complete payment to publish.');
    }

    // PUT /api/v1/products/{id}  — seller updates own listing
    public function update(UpdateProductRequest $request, string $id)
    {
        $product = Product::where('product_id', $id)
            ->where('seller_id', auth('api')->user()->user_id)
            ->first();

        if (! $product) {
            return ApiResponse::error('Product not found or you do not own this listing', 404);
        }

        if (! in_array($product->status, ['draft', 'active'])) {
            return ApiResponse::error('Only draft or active listings can be edited', 422);
        }

        $product->update($request->validated());

        return ApiResponse::success($product, 'Listing updated');
    }

    // DELETE /api/v1/products/{id}  — seller archives own listing
    public function destroy(string $id)
    {
        $product = Product::where('product_id', $id)
            ->where('seller_id', auth('api')->user()->user_id)
            ->first();

        if (! $product) {
            return ApiResponse::error('Product not found or you do not own this listing', 404);
        }

        $product->update(['status' => 'archived']);

        return ApiResponse::success(null, 'Listing archived successfully');
    }

    // PATCH /api/v1/products/{id}/sold  — seller marks listing as sold
    public function markSold(string $id)
    {
        $product = Product::where('product_id', $id)
            ->where('seller_id', auth('api')->user()->user_id)
            ->first();

        if (! $product) {
            return ApiResponse::error('Product not found or you do not own this listing', 404);
        }

        $product->update(['status' => 'sold']);

        return ApiResponse::success(null, 'Listing marked as sold');
    }

    // GET /api/v1/categories  — public list of active categories
    public function categories()
    {
        $categories = \App\Models\Category::where('is_active', true)->get();
        return ApiResponse::success($categories);
    }

    private function getSellerAvgRating(string $sellerId): float|null
    {
        $avg = \App\Models\Review::where('seller_id', $sellerId)
            ->where('is_removed', false)
            ->avg('rating');

        return $avg ? round($avg, 1) : null;
    }
}