<?php

namespace App\Http\Middleware;

use App\Http\Helpers\ApiResponse;
use Closure;
use Illuminate\Http\Request;

class AdminOnly
{
    public function handle(Request $request, Closure $next)
    {
        $user = auth('api')->user();

        if (! $user || $user->role !== 'admin') {
            return ApiResponse::error('Forbidden. Admin access only.', 403);
        }

        return $next($request);
    }
}