<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\DB;

class QueueController extends Controller
{
    /**
     * Get queue statistics.
     */
    public function stats(): JsonResponse
    {
        // Get stats by job type
        $pendingJobs = DB::table('jobs')->get();
        $failedJobs = DB::table('failed_jobs')->get();
        
        $statsByType = [
            'ClassifyPointImageJob' => [
                'pending' => 0,
                'failed' => 0,
                'processed' => 0,
            ],
            'ClassifyPointJob' => [
                'pending' => 0,
                'failed' => 0,
                'processed' => 0,
            ],
        ];

        // Count pending jobs by type
        foreach ($pendingJobs as $job) {
            $payload = json_decode($job->payload, true);
            $jobClass = $payload['displayName'] ?? null;
            if ($jobClass && isset($statsByType[$jobClass])) {
                $statsByType[$jobClass]['pending']++;
            }
        }

        // Count failed jobs by type
        foreach ($failedJobs as $job) {
            $payload = json_decode($job->payload, true);
            $jobClass = $payload['displayName'] ?? null;
            if ($jobClass && isset($statsByType[$jobClass])) {
                $statsByType[$jobClass]['failed']++;
            }
        }

        // Count processed jobs (approximate from database records)
        $statsByType['ClassifyPointImageJob']['processed'] = DB::table('point_images')
            ->whereNotNull('description')
            ->where('created_at', '>=', now()->subDay())
            ->count();

        $statsByType['ClassifyPointJob']['processed'] = DB::table('points')
            ->whereNotNull('event_type_id')
            ->where('updated_at', '>=', now()->subDay())
            ->count();

        // Calculate totals
        $totalPending = array_sum(array_column($statsByType, 'pending'));
        $totalFailed = array_sum(array_column($statsByType, 'failed'));
        $totalProcessed = array_sum(array_column($statsByType, 'processed'));
        $totalJobs = $totalProcessed + $totalFailed;
        $successRate = $totalJobs > 0 ? round(($totalProcessed / $totalJobs) * 100, 1) : 100;

        return response()->json([
            'pending' => $totalPending,
            'failed' => $totalFailed,
            'processed' => $totalProcessed,
            'success_rate' => $successRate,
            'by_type' => $statsByType,
        ]);
    }

    /**
     * Get pending jobs.
     */
    public function pending(Request $request): JsonResponse
    {
        $jobType = $request->query('type');
        
        $jobs = DB::table('jobs')
            ->select([
                'id',
                'queue',
                'payload',
                'attempts',
                'reserved_at',
                'available_at',
                'created_at',
            ])
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($job) {
                // Parse payload to get job class name
                $payload = json_decode($job->payload, true);
                $jobName = $payload['displayName'] ?? 'Unknown';
                
                return [
                    'id' => $job->id,
                    'name' => $jobName,
                    'queue' => $job->queue,
                    'attempts' => $job->attempts,
                    'is_reserved' => $job->reserved_at !== null,
                    'available_at' => date('Y-m-d H:i:s', $job->available_at),
                    'created_at' => date('Y-m-d H:i:s', $job->created_at),
                ];
            })
            ->when($jobType, function ($collection) use ($jobType) {
                return $collection->filter(function ($job) use ($jobType) {
                    return $job['name'] === $jobType;
                })->values();
            });

        return response()->json(['data' => $jobs]);
    }

    /**
     * Get failed jobs.
     */
    public function failed(Request $request): JsonResponse
    {
        $jobType = $request->query('type');
        
        $jobs = DB::table('failed_jobs')
            ->select([
                'id',
                'uuid',
                'queue',
                'payload',
                'exception',
                'failed_at',
            ])
            ->orderBy('failed_at', 'desc')
            ->limit(50)
            ->get()
            ->map(function ($job) {
                // Parse payload to get job class name
                $payload = json_decode($job->payload, true);
                $jobName = $payload['displayName'] ?? 'Unknown';
                
                // Extract first line of exception for preview
                $exceptionLines = explode("\n", $job->exception);
                $exceptionPreview = $exceptionLines[0] ?? 'Unknown error';
                
                return [
                    'id' => $job->id,
                    'uuid' => $job->uuid,
                    'name' => $jobName,
                    'queue' => $job->queue,
                    'exception' => $exceptionPreview,
                    'full_exception' => $job->exception,
                    'failed_at' => $job->failed_at,
                ];
            })
            ->when($jobType, function ($collection) use ($jobType) {
                return $collection->filter(function ($job) use ($jobType) {
                    return $job['name'] === $jobType;
                })->values();
            });

        return response()->json(['data' => $jobs]);
    }

    /**
     * Retry a specific failed job.
     */
    public function retry(string $id): JsonResponse
    {
        try {
            Artisan::call('queue:retry', ['id' => [$id]]);
            
            return response()->json([
                'message' => 'Job queued for retry successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retry job: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Retry all failed jobs.
     */
    public function retryAll(): JsonResponse
    {
        try {
            Artisan::call('queue:retry', ['id' => ['all']]);
            
            $count = DB::table('failed_jobs')->count();
            
            return response()->json([
                'message' => "Queued {$count} jobs for retry",
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to retry jobs: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete a specific failed job.
     */
    public function deleteFailed(string $id): JsonResponse
    {
        try {
            $deleted = DB::table('failed_jobs')
                ->where('id', $id)
                ->delete();
            
            if ($deleted) {
                return response()->json([
                    'message' => 'Failed job deleted successfully',
                ]);
            }
            
            return response()->json([
                'error' => 'Failed job not found',
            ], 404);
            
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to delete job: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Flush all failed jobs.
     */
    public function flushFailed(): JsonResponse
    {
        try {
            Artisan::call('queue:flush');
            
            return response()->json([
                'message' => 'All failed jobs have been deleted',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to flush jobs: ' . $e->getMessage(),
            ], 500);
        }
    }
}
