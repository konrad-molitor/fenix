<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Point;
use App\Models\PointImage;
use App\Models\EventType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EventsModerationController extends Controller
{
    /**
     * Get statistics for events moderation.
     */
    public function stats(): JsonResponse
    {
        $totalLast24h = Point::where('created_at', '>=', now()->subDay())->count();
        $filteredLast24h = Point::where('created_at', '>=', now()->subDay())
            ->whereIn('moderation_status', ['filtered', 'declined'])
            ->count();

        return response()->json([
            'total_24h' => $totalLast24h,
            'filtered_24h' => $filteredLast24h,
        ]);
    }

    /**
     * Get list of points for moderation with filters.
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'search' => 'nullable|string|max:255',
            'search_in_descriptions' => 'nullable|boolean',
            'moderation_filter' => 'nullable|in:show_filtered,hide_filtered,only_filtered',
            'event_types' => 'nullable|array',
            'event_types.*' => 'exists:event_types,id',
            'order_by' => 'nullable|in:event_type_asc,event_type_desc,created_at_asc,created_at_desc',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $query = Point::with(['user:id,name', 'images', 'eventType']);

        // Full-text search
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search, $request) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
                
                // Search in image descriptions if checkbox is enabled
                if ($request->boolean('search_in_descriptions')) {
                    $q->orWhereHas('images', function ($imageQuery) use ($search) {
                        $imageQuery->where('description', 'like', "%{$search}%");
                    });
                }
            });
        }

        // Moderation filter
        $moderationFilter = $request->input('moderation_filter', 'show_filtered');
        switch ($moderationFilter) {
            case 'hide_filtered':
                $query->where('moderation_status', 'allow');
                break;
            case 'only_filtered':
                $query->whereIn('moderation_status', ['filtered', 'declined']);
                break;
            case 'show_filtered':
            default:
                // Show all
                break;
        }

        // Event type filter
        if ($request->filled('event_types') && is_array($request->event_types)) {
            $query->whereIn('event_type_id', $request->event_types);
        }

        // Ordering
        $orderBy = $request->input('order_by', 'created_at_desc');
        switch ($orderBy) {
            case 'event_type_asc':
                $query->orderBy('event_type_id', 'asc');
                break;
            case 'event_type_desc':
                $query->orderBy('event_type_id', 'desc');
                break;
            case 'created_at_asc':
                $query->orderBy('created_at', 'asc');
                break;
            case 'created_at_desc':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        // Pagination
        $perPage = $request->input('per_page', 20);
        $points = $query->paginate($perPage);

        // Transform data
        $points->getCollection()->transform(function ($point) {
            return [
                'id' => $point->id,
                'title' => $point->title,
                'description' => $point->description,
                'address' => $point->address,
                'latitude' => $point->latitude,
                'longitude' => $point->longitude,
                'event_type_id' => $point->event_type_id,
                'event_type' => $point->eventType ? [
                    'id' => $point->eventType->id,
                    'system_event_title' => $point->eventType->system_event_title,
                    'priority' => $point->eventType->priority,
                ] : null,
                'moderation_status' => $point->moderation_status,
                'user' => [
                    'id' => $point->user->id,
                    'name' => $point->user->name,
                ],
                'images' => $point->images->map(function ($img) {
                    return [
                        'id' => $img->id,
                        'url' => $img->url,
                        'description' => $img->description,
                        'moderation_status' => $img->moderation_status,
                        'moderation_reason' => $img->moderation_reason,
                    ];
                }),
                'created_at' => $point->created_at,
                'updated_at' => $point->updated_at,
            ];
        });

        return response()->json($points);
    }

    /**
     * Get all event types for autocomplete.
     */
    public function eventTypes(): JsonResponse
    {
        $eventTypes = EventType::select(['id', 'system_event_title', 'title_display_translation'])
            ->orderBy('system_event_title')
            ->get()
            ->map(function ($type) {
                return [
                    'id' => $type->id,
                    'system_event_title' => $type->system_event_title,
                    'label' => $type->title_display_translation['en'] ?? $type->system_event_title,
                ];
            });

        return response()->json($eventTypes);
    }

    /**
     * Get detailed point information for moderation modal.
     */
    public function show(Point $point): JsonResponse
    {
        $point->load(['user:id,name', 'eventType:id,system_event_title,title_display_translation', 'images']);

        return response()->json([
            'id' => $point->id,
            'title' => $point->title,
            'description' => $point->description,
            'address' => $point->address,
            'latitude' => $point->latitude,
            'longitude' => $point->longitude,
            'event_type_id' => $point->event_type_id,
            'event_type' => $point->eventType ? [
                'id' => $point->eventType->id,
                'system_event_title' => $point->eventType->system_event_title,
                'title_display_translation' => $point->eventType->title_display_translation,
            ] : null,
            'moderation_status' => $point->moderation_status,
            'user' => [
                'id' => $point->user->id,
                'name' => $point->user->name,
            ],
            'images' => $point->images->map(function ($img) {
                return [
                    'id' => $img->id,
                    'url' => $img->url,
                    'classified_type' => $img->classified_type,
                    'classified_event_type' => $img->classifiedEventType ? [
                        'id' => $img->classifiedEventType->id,
                        'system_event_title' => $img->classifiedEventType->system_event_title,
                        'title_display_translation' => $img->classifiedEventType->title_display_translation,
                    ] : null,
                    'description' => $img->description,
                    'moderation_status' => $img->moderation_status,
                    'moderation_reason' => $img->moderation_reason,
                ];
            }),
            'created_at' => $point->created_at,
            'updated_at' => $point->updated_at,
        ]);
    }

    /**
     * Update point event type.
     */
    public function updateEventType(Request $request, Point $point): JsonResponse
    {
        $request->validate([
            'event_type_id' => 'required|exists:event_types,id',
        ]);

        $point->update([
            'event_type_id' => $request->event_type_id,
        ]);

        return response()->json([
            'message' => 'Event type updated successfully',
        ]);
    }

    /**
     * Approve point - clear all filtered/declined statuses.
     */
    public function approve(Point $point): JsonResponse
    {
        // Update all images to 'allow' and clear moderation_reason
        $point->images()->update([
            'moderation_status' => 'allow',
            'moderation_reason' => null,
        ]);

        // Update point status
        $point->update([
            'moderation_status' => 'allow',
        ]);

        return response()->json([
            'message' => 'Point approved successfully',
        ]);
    }

    /**
     * Decline point - set status to 'declined'.
     */
    public function decline(Point $point): JsonResponse
    {
        // Update all images to 'declined'
        $point->images()->update([
            'moderation_status' => 'declined',
        ]);

        // Update point status
        $point->update([
            'moderation_status' => 'declined',
        ]);

        return response()->json([
            'message' => 'Point declined successfully',
        ]);
    }

    /**
     * Clear moderation for a specific image.
     */
    public function clearImageModeration(Point $point, PointImage $image): JsonResponse
    {
        // Ensure image belongs to this point
        if ($image->point_id !== $point->id) {
            return response()->json([
                'message' => 'Image does not belong to this point',
            ], 403);
        }

        $image->update([
            'moderation_status' => 'allow',
            'moderation_reason' => null,
        ]);

        // Update point status based on remaining images
        $point->updateModerationStatus();

        return response()->json([
            'message' => 'Image moderation cleared successfully',
            'image' => $image->fresh(['classifiedEventType']),
            'point_status' => $point->fresh()->moderation_status,
        ]);
    }
}
