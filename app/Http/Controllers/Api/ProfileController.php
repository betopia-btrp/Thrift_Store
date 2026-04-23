<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Helpers\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show()
    {
        $user = auth('api')->user();

        return ApiResponse::success([
            'user_id'           => $user->user_id,
            'name'              => $user->name,
            'email'             => $user->email,
            'phone'             => $user->phone,
            'role'              => $user->role,
            'profile_photo_url' => $user->profile_photo_url,
            'is_blocked'        => $user->is_blocked,
            'created_at'        => $user->created_at,
        ]);
    }

    public function update(Request $request)
    {
        $user = auth('api')->user();

        $validated = $request->validate([
            'name'  => ['sometimes', 'string', 'max:255'],
            'phone' => ['sometimes', 'string', 'unique:users,phone,' . $user->user_id . ',user_id'],
        ]);

        if ($request->hasFile('profile_photo')) {
            $request->validate([
                'profile_photo' => ['image', 'mimes:jpeg,png,webp', 'max:5120'],
            ]);

            // Delete old photo if exists
            if ($user->profile_photo_url) {
                $oldPath = str_replace('/storage/', 'public/', $user->profile_photo_url);
                Storage::delete($oldPath);
            }

            $path = $request->file('profile_photo')->store('profile_photos', 'public');
            $validated['profile_photo_url'] = '/storage/' . $path;
        }

        $user->update($validated);

        return ApiResponse::success([
            'user_id'           => $user->user_id,
            'name'              => $user->name,
            'email'             => $user->email,
            'phone'             => $user->phone,
            'role'              => $user->role,
            'profile_photo_url' => $user->profile_photo_url,
        ], 'Profile updated');
    }
}