<?php

namespace App\Jobs;

use App\Models\PointImage;
use App\Services\AIService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ClassifyPointImageJob implements ShouldQueue
{
    use Queueable;

    /**
     * The number of times the job may be attempted.
     */
    public int $tries = 3;

    /**
     * The number of seconds the job can run before timing out.
     */
    public int $timeout = 120;

    /**
     * The number of seconds to wait before retrying the job.
     */
    public int $backoff = 30;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public PointImage $pointImage
    ) {}

    /**
     * Execute the job.
     */
    public function handle(AIService $aiService): void
    {
        try {
            Log::info('Starting image classification', [
                'point_image_id' => $this->pointImage->id,
                'attempt' => $this->attempts(),
            ]);

            // Classify image using AI
            $result = $aiService->classifyImage(
                $this->pointImage->url,
                $this->pointImage->point_id
            );

            // Update point image with classification results
            $this->pointImage->update([
                'classified_type' => $result['classified_type_id'],
                'description' => $result['description'],
            ]);

            Log::info('Image classification completed', [
                'point_image_id' => $this->pointImage->id,
                'classified_type' => $result['classified_type_id'],
                'description' => $result['description'],
            ]);

            // Check if this was the last image to be classified
            // If so, dispatch point classification
            $point = $this->pointImage->point;
            if ($point && $point->areAllImagesClassified() && $point->event_type_id === null) {
                Log::info('All images classified, dispatching point classification', [
                    'point_id' => $point->id,
                ]);
                ClassifyPointJob::dispatch($point);
            }

        } catch (\Exception $e) {
            Log::error('Image classification failed', [
                'point_image_id' => $this->pointImage->id,
                'attempt' => $this->attempts(),
                'error' => $e->getMessage(),
            ]);

            // Re-throw to trigger retry mechanism
            throw $e;
        }
    }

    /**
     * Handle a job failure.
     */
    public function failed(\Throwable $exception): void
    {
        Log::error('Image classification job failed permanently', [
            'point_image_id' => $this->pointImage->id,
            'error' => $exception->getMessage(),
        ]);

        // Could send notification to admins here
    }
}
