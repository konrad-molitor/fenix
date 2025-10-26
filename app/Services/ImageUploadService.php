<?php

namespace App\Services;

use App\Models\Point;
use App\Models\PointImage;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Aws\S3\S3Client;

class ImageUploadService
{
    private ImageManager $imageManager;
    private string $disk;
    private S3Client $s3Client;

    public function __construct()
    {
        $this->imageManager = new ImageManager(new Driver());
        $this->disk = config('uploads.storage_disk');
        
        $diskConfig = config("filesystems.disks.{$this->disk}");
        $this->s3Client = new S3Client([
            'version' => 'latest',
            'region' => $diskConfig['region'],
            'endpoint' => $diskConfig['endpoint'],
            'use_path_style_endpoint' => $diskConfig['use_path_style_endpoint'] ?? false,
            'credentials' => [
                'key' => $diskConfig['key'],
                'secret' => $diskConfig['secret'],
            ],
        ]);
    }

    /**
     * Upload an image for a point.
     *
     * @throws \Exception
     */
    public function upload(UploadedFile $file, Point $point, int $userId): PointImage
    {
        if ($point->images()->count() >= config('uploads.max_images_per_point')) {
            throw new \Exception('Maximum ' . config('uploads.max_images_per_point') . ' images per point');
        }

        $dailyCount = PointImage::where('user_id', $userId)
            ->whereDate('created_at', today())
            ->count();

        if ($dailyCount >= config('uploads.max_images_per_user_daily')) {
            throw new \Exception('Daily upload limit exceeded');
        }

        $image = $this->imageManager->read($file->getRealPath());
        
        $image->orient();
        
        if ($image->width() > config('uploads.max_width')) {
            $image->scaleDown(width: config('uploads.max_width'));
        }

        $encoded = $image->toJpeg(quality: config('uploads.quality'));

        $key = $this->generateKey($point->id);

        $bucket = config("filesystems.disks.{$this->disk}.bucket");
        
        $this->s3Client->putObject([
            'Bucket' => $bucket,
            'Key' => $key,
            'Body' => (string) $encoded,
            'ContentType' => 'image/jpeg',
            'CacheControl' => 'max-age=31536000, immutable',
            'ACL' => 'public-read',
        ]);

        return PointImage::create([
            'point_id' => $point->id,
            'user_id' => $userId,
            'key' => $key,
            'mime' => 'image/jpeg',
            'size' => strlen($encoded),
        ]);
    }

    /**
     * Delete an image.
     */
    public function delete(PointImage $image): bool
    {
        return $image->delete();
    }

    /**
     * Generate unique key for file.
     */
    private function generateKey(int $pointId): string
    {
        return sprintf(
            'points/%d/%d-%s.jpg',
            $pointId,
            time(),
            Str::random(8)
        );
    }
}

