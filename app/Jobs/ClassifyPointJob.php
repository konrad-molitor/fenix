<?php

namespace App\Jobs;

use App\Models\Point;
use App\Services\AIService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ClassifyPointJob implements ShouldQueue
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
        public Point $point
    ) {}

    /**
     * Execute the job.
     */
    public function handle(AIService $aiService): void
    {
        try {
            Log::info('Starting point classification', [
                'point_id' => $this->point->id,
                'attempt' => $this->attempts(),
            ]);

            // Check if all images are classified
            if (!$this->point->areAllImagesClassified()) {
                Log::warning('Point has unclassified images, skipping classification', [
                    'point_id' => $this->point->id,
                ]);
                return;
            }

            // Classify point using AI
            $result = $aiService->classifyPoint($this->point);

            // Update point with classification result
            $this->point->update([
                'event_type_id' => $result['event_type_id'],
            ]);

            Log::info('Point classification completed', [
                'point_id' => $this->point->id,
                'event_type_id' => $result['event_type_id'],
            ]);

        } catch (\Exception $e) {
            Log::error('Point classification failed', [
                'point_id' => $this->point->id,
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
        Log::error('Point classification job failed permanently', [
            'point_id' => $this->point->id,
            'error' => $exception->getMessage(),
        ]);

        // Could send notification to admins here
    }
}
