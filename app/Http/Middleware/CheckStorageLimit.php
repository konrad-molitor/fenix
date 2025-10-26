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
            return response()->json([
                'error' => 'Project storage limit reached',
            ], 507);
        }

        return $next($request);
    }
}
