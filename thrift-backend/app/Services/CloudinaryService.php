<?php

namespace App\Services;

use Cloudinary\Cloudinary;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CloudinaryService
{
    protected ?Cloudinary $cloudinary = null;
    protected string $folder;
    protected bool $useLocalFallback = false;

    public function __construct(string $folder = 'thrift-store')
    {
        $this->folder = $folder;

        $cloudName = config('services.cloudinary.cloud_name') ?? env('CLOUDINARY_CLOUD_NAME');
        $apiKey    = config('services.cloudinary.api_key') ?? env('CLOUDINARY_API_KEY');
        $apiSecret = config('services.cloudinary.api_secret') ?? env('CLOUDINARY_API_SECRET');

        if ($cloudName && $apiKey && $apiSecret) {
            $this->cloudinary = new Cloudinary([
                'cloud' => [
                    'cloud_name' => $cloudName,
                    'api_key'    => $apiKey,
                    'api_secret' => $apiSecret,
                ],
            ]);
        } else {
            $this->useLocalFallback = true;
        }
    }

    public function uploadImage($file, ?string $publicId = null): string
    {
        if ($this->useLocalFallback) {
            return $this->uploadLocal($file);
        }

        try {
            $options = [
                'folder' => $this->folder,
                'resource_type' => 'image',
                'quality' => 'auto',
                'fetch_format' => 'auto',
            ];

            if ($publicId) {
                $options['public_id'] = $publicId;
            }

            $result = $this->cloudinary->uploadApi()->upload($file->getPathname(), $options);

            return $result['secure_url'];
        } catch (\Exception $e) {
            Log::error('Cloudinary upload failed: ' . $e->getMessage());
            throw $e;
        }
    }

    public function deleteImage(string $url): bool
    {
        if (!str_contains($url, 'cloudinary.com')) {
            return $this->deleteLocal($url);
        }

        try {
            $publicId = $this->extractPublicId($url);
            if (! $publicId) {
                return false;
            }

            $result = $this->cloudinary->uploadApi()->destroy($publicId);
            return ($result['result'] ?? '') === 'ok';
        } catch (\Exception $e) {
            Log::error('Cloudinary delete failed: ' . $e->getMessage());
            return false;
        }
    }

    public function deleteImages(array $urls): void
    {
        foreach ($urls as $url) {
            $this->deleteImage($url);
        }
    }

    public function isCloudinaryUrl(string $url): bool
    {
        return str_contains($url, 'cloudinary.com');
    }

    protected function extractPublicId(string $url): ?string
    {
        preg_match('/\/upload\/(?:v\d+\/)?(.+?)\.\w+$/', $url, $matches);
        return $matches[1] ?? null;
    }

    protected function uploadLocal(UploadedFile $file): string
    {
        $filename = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $file->storeAs($this->folder, $filename, 'public');
        return url('storage') . '/' . $this->folder . '/' . $filename;
    }

    protected function deleteLocal(string $url): bool
    {
        $relativePath = str_replace(url('storage') . '/', '', $url);
        if (Storage::disk('public')->exists($relativePath)) {
            Storage::disk('public')->delete($relativePath);
            return true;
        }
        return false;
    }
}
