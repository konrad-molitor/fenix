<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsModerator
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || (!$request->user()->isModerator() && !$request->user()->isAdmin())) {
            abort(403, 'Access denied. Moderator or admin privileges required.');
        }

        return $next($request);
    }
}

