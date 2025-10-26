<?php

namespace App\Http\Middleware;

use App\Models\PointImage;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckStorageLimit
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $totalSize = PointImage::sum('size');
        $maxSize = config('uploads.max_total_storage_bytes');

        if ($totalSize >= $maxSize) {
            $maxSizeMB = round($maxSize / 1024 / 1024);
            return response()->json([
                'error' => "Storage limit of {$maxSizeMB}MB reached. Please contact support to increase quota.",
            ], 507);
        }

        return $next($request);
    }
}
