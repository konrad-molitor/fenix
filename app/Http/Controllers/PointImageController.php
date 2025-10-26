<?php

namespace App\Http\Controllers;

use App\Http\Requests\UploadPointImageRequest;
use App\Models\Point;
use App\Models\PointImage;
use App\Services\ImageUploadService;
use Illuminate\Http\JsonResponse;

class PointImageController extends Controller
{
    public function __construct(
        private ImageUploadService $imageService
    ) {}

    /**
     * Get list of images for a point.
     */
    public function index(Point $point): JsonResponse
    {
        $images = $point->images;

        return response()->json([
            'data' => $images->map(fn($img) => [
                'id' => $img->id,
                'url' => $img->url,
                'size' => $img->size,
                'created_at' => $img->created_at->toISOString(),
            ]),
        ]);
    }

    /**
     * Upload an image.
     */
    public function store(UploadPointImageRequest $request, Point $point): JsonResponse
    {
        try {
            $image = $this->imageService->upload(
                $request->file('image'),
                $point,
                $request->user()->id
            );

            return response()->json([
                'data' => [
                    'id' => $image->id,
                    'url' => $image->url,
                    'size' => $image->size,
                    'created_at' => $image->created_at->toISOString(),
                ],
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage(),
            ], 422);
        }
    }

    /**
     * Delete an image.
     */
    public function destroy(Point $point, PointImage $image): JsonResponse
    {
        if ($image->user_id !== auth()->id()) {
            abort(403, 'Unauthorized to delete this image');
        }

        if ($image->point_id !== $point->id) {
            abort(404, 'Image does not belong to this point');
        }

        $this->imageService->delete($image);

        return response()->json(['message' => 'Image deleted']);
    }
}
