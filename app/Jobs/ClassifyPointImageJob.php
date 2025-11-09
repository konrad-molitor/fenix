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

            // Classify image using AI (includes moderation)
            $result = $aiService->classifyImage(
                $this->pointImage->url,
                $this->pointImage->point_id
            );

            // Update point image with classification and moderation results
            $this->pointImage->update([
                'classified_type' => $result['classified_type_id'],
                'description' => $result['description'],
                'moderation_status' => $result['moderation_status'],
                'moderation_reason' => $result['moderation_reason'],
            ]);

            Log::info('Image classification and moderation completed', [
                'point_image_id' => $this->pointImage->id,
                'classified_type' => $result['classified_type_id'],
                'description' => $result['description'],
                'moderation_status' => $result['moderation_status'],
                'moderation_reason' => $result['moderation_reason'],
            ]);

            // Update point moderation status based on images
            $point = $this->pointImage->point;
            if ($point) {
                $point->updateModerationStatus();
                
                // Check if this was the last image to be classified
                // If so, dispatch point classification ONLY if moderation is 'allow'
                if ($point->areAllImagesClassified() && 
                    $point->event_type_id === null && 
                    $point->moderation_status === 'allow') {
                    Log::info('All images classified and moderation passed, dispatching point classification', [
                        'point_id' => $point->id,
                    ]);
                    ClassifyPointJob::dispatch($point);
                } elseif ($point->moderation_status === 'filtered') {
                    Log::info('Point has filtered images, skipping point classification', [
                        'point_id' => $point->id,
                    ]);
                }
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
