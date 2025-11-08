<?php

namespace App\Http\Controllers;

use App\Jobs\ClassifyPointJob;
use App\Models\Point;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class PointController extends Controller
{
    /**
     * Display a listing of points within bounds.
     */
    public function index(Request $request)
    {
        $request->validate([
            'sw_lat' => 'required|numeric|between:-90,90',
            'sw_lng' => 'required|numeric|between:-180,180',
            'ne_lat' => 'required|numeric|between:-90,90',
            'ne_lng' => 'required|numeric|between:-180,180',
        ]);

        $points = Point::with(['user:id,name', 'images', 'eventType'])
            ->where(function ($query) {
                // Показываем points с event_type_id ИЛИ созданные текущим пользователем
                $query->whereNotNull('event_type_id')
                      ->orWhere('user_id', Auth::id());
            })
            ->withinBounds(
                $request->sw_lat,
                $request->sw_lng,
                $request->ne_lat,
                $request->ne_lng
            )
            ->get()
            ->map(function ($point) {
                return [
                    'id' => $point->id,
                    'title' => $point->title,
                    'description' => $point->description,
                    'address' => $point->address,
                    'event_type_id' => $point->event_type_id,
                    'event_type' => $point->eventType ? [
                        'id' => $point->eventType->id,
                        'system_event_title' => $point->eventType->system_event_title,
                        'priority' => $point->eventType->priority,
                    ] : null,
                    'latitude' => $point->latitude,
                    'longitude' => $point->longitude,
                    'user' => [
                        'id' => $point->user->id,
                        'name' => $point->user->name,
                    ],
                    'images' => $point->images->map(fn($img) => [
                        'id' => $img->id,
                        'url' => $img->url,
                    ]),
                    'is_own' => $point->user_id === Auth::id(),
                    'created_at' => $point->created_at,
                ];
            });

        return response()->json($points);
    }

    /**
     * Get points in list view format within a square area around user location.
     */
    public function listView(Request $request)
    {
        $request->validate([
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'radius' => 'required|numeric|min:500|max:4000', // 500m to 4km
            'exclude_ids' => 'nullable|array',
            'exclude_ids.*' => 'integer',
        ]);

        $query = Point::with(['user:id,name', 'images', 'eventType'])
            ->where(function ($query) {
                // Показываем points с event_type_id ИЛИ созданные текущим пользователем
                $query->whereNotNull('event_type_id')
                      ->orWhere('user_id', Auth::id());
            })
            ->withinSquare(
                $request->latitude,
                $request->longitude,
                $request->radius
            );

        // Exclude already loaded points
        $excludeIds = $request->input('exclude_ids', []);
        if (!empty($excludeIds) && is_array($excludeIds)) {
            \Log::debug('List View - Excluding IDs:', [
                'exclude_ids' => $excludeIds, 
                'radius' => $request->radius,
                'lat' => $request->latitude,
                'lng' => $request->longitude,
            ]);
            $query->whereNotIn('id', $excludeIds);
        } else {
            \Log::debug('List View - No exclusions:', [
                'radius' => $request->radius,
                'lat' => $request->latitude,
                'lng' => $request->longitude,
            ]);
        }

        $points = $query->get();
        
        \Log::debug('List View - Query results:', [
            'total_found' => $points->count(),
            'point_ids' => $points->pluck('id')->toArray(),
        ]);
        
        $points = $points->map(function ($point) {
                return [
                    'id' => $point->id,
                    'title' => $point->title,
                    'description' => $point->description,
                    'address' => $point->address,
                    'event_type_id' => $point->event_type_id,
                    'event_type' => $point->eventType ? [
                        'id' => $point->eventType->id,
                        'system_event_title' => $point->eventType->system_event_title,
                        'priority' => $point->eventType->priority,
                    ] : null,
                    'latitude' => $point->latitude,
                    'longitude' => $point->longitude,
                    'user' => [
                        'id' => $point->user->id,
                        'name' => $point->user->name,
                    ],
                    'images' => $point->images->map(fn($img) => [
                        'id' => $img->id,
                        'url' => $img->url,
                    ]),
                    'is_own' => $point->user_id === Auth::id(),
                    'created_at' => $point->created_at,
                    'distance' => round($point->distance, 2), // Distance in meters
                ];
            });

        return response()->json([
            'points' => $points,
            'radius' => $request->radius,
            'count' => $points->count(),
        ]);
    }

    /**
     * Store a newly created point.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'address' => 'nullable|string|max:255',
            'event_type_id' => 'nullable|exists:event_types,id',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $point = Point::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'address' => $request->address,
            'event_type_id' => $request->event_type_id,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        $point->load(['eventType', 'user']);

        // Queue point classification if no images (images will trigger it later)
        // or if event_type_id is not set by user
        if ($point->images()->count() === 0 && $point->event_type_id === null) {
            ClassifyPointJob::dispatch($point);
        }

        return response()->json([
            'id' => $point->id,
            'title' => $point->title,
            'description' => $point->description,
            'address' => $point->address,
            'event_type_id' => $point->event_type_id,
            'event_type' => $point->eventType ? [
                'id' => $point->eventType->id,
                'system_event_title' => $point->eventType->system_event_title,
                'priority' => $point->eventType->priority,
            ] : null,
            'latitude' => $point->latitude,
            'longitude' => $point->longitude,
            'user' => [
                'id' => $point->user->id,
                'name' => $point->user->name,
            ],
            'images' => [],
            'is_own' => true,
            'created_at' => $point->created_at,
        ], 201);
    }

    /**
     * Remove the specified point.
     */
    public function destroy(Point $point)
    {
        // Check if the point belongs to the authenticated user
        if ($point->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $point->delete();

        return response()->json(['message' => 'Point deleted successfully']);
    }
}