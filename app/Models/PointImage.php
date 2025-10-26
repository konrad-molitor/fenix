<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class PointImage extends Model
{
    protected $fillable = [
        'point_id',
        'user_id',
        'key',
        'mime',
        'size',
    ];

    protected $appends = ['url'];

    public function point(): BelongsTo
    {
        return $this->belongsTo(Point::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get public URL for the image.
     * For Tigris public bucket, use virtual-hosted-style URLs.
     */
    public function getUrlAttribute(): string
    {
        $disk = config('uploads.storage_disk');
        $endpoint = config("filesystems.disks.{$disk}.endpoint");
        $bucket = config("filesystems.disks.{$disk}.bucket");
        
        // For Tigris public bucket, use virtual-hosted-style URL
        // https://bucket.fly.storage.tigris.dev/key instead of https://fly.storage.tigris.dev/bucket/key
        if ($endpoint && str_contains($endpoint, 'tigris.dev')) {
            $host = parse_url($endpoint, PHP_URL_HOST);
            return 'https://' . $bucket . '.' . $host . '/' . ltrim($this->key, '/');
        }
        
        return Storage::disk($disk)->url($this->key);
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($image) {
            Storage::disk(config('uploads.storage_disk'))->delete($image->key);
        });
    }
}
