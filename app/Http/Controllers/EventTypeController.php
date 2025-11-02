<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventTypeRequest;
use App\Http\Requests\UpdateEventTypeRequest;
use App\Models\EventType;
use App\Services\AIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class EventTypeController extends Controller
{
    /**
     * Display a listing of the resource.
     * Available for all authenticated users with filters.
     */
    public function index(Request $request)
    {
        $query = EventType::query()->with('moderator');

        // Search filter (minimum 3 characters)
        if ($request->has('search') && strlen($request->search) >= 3) {
            $search = $request->search;
            
            $query->where(function ($q) use ($search) {
                // Search in system_event_title
                $q->where('system_event_title', 'like', "%{$search}%")
                  // Search in translations (JSON - works with both PostgreSQL and MySQL/MariaDB)
                  ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(title_display_translation, '$.en')) LIKE ?", ["%{$search}%"])
                  ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(title_display_translation, '$.es')) LIKE ?", ["%{$search}%"])
                  ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(title_display_translation, '$.ru')) LIKE ?", ["%{$search}%"]);
            });
        }

        // Priority filter
        if ($request->has('priority') && !empty($request->priority)) {
            $query->where('priority', $request->priority);
        }

        // Notification mode filter
        if ($request->has('notification_mode') && !empty($request->notification_mode)) {
            $query->where('notification_mode', $request->notification_mode);
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        $allowedSortFields = ['id', 'system_event_title', 'priority', 'notification_mode', 'created_at', 'updated_at'];
        if (in_array($sortBy, $allowedSortFields)) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $perPage = min(max($perPage, 5), 100); // Between 5 and 100

        return response()->json($query->paginate($perPage));
    }

    /**
     * Store a newly created resource in storage.
     * Admin only.
     */
    public function store(StoreEventTypeRequest $request)
    {
        $eventType = EventType::create($request->validated());

        return response()->json([
            'message' => 'Event type created successfully',
            'data' => $eventType->load('moderator'),
        ], 201);
    }

    /**
     * Display the specified resource.
     * Available for all authenticated users.
     */
    public function show(EventType $eventType)
    {
        return response()->json([
            'data' => $eventType->load('moderator'),
        ]);
    }

    /**
     * Update the specified resource in storage.
     * Admin only.
     */
    public function update(UpdateEventTypeRequest $request, EventType $eventType)
    {
        $eventType->update($request->validated());

        return response()->json([
            'message' => 'Event type updated successfully',
            'data' => $eventType->fresh()->load('moderator'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     * Admin only.
     */
    public function destroy(EventType $eventType)
    {
        $eventType->delete();

        return response()->json([
            'message' => 'Event type deleted successfully',
        ]);
    }

    /**
     * Get autocomplete suggestions for event types.
     * Requires minimum 3 characters.
     * Available for all authenticated users.
     */
    public function autocomplete(Request $request)
    {
        $search = $request->get('search', '');

        if (strlen($search) < 3) {
            return response()->json([
                'data' => [],
                'message' => 'Minimum 3 characters required',
            ]);
        }

        $results = EventType::where(function ($q) use ($search) {
            $q->where('system_event_title', 'like', "%{$search}%")
              ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(title_display_translation, '$.en')) LIKE ?", ["%{$search}%"])
              ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(title_display_translation, '$.es')) LIKE ?", ["%{$search}%"])
              ->orWhereRaw("JSON_UNQUOTE(JSON_EXTRACT(title_display_translation, '$.ru')) LIKE ?", ["%{$search}%"]);
        })
        ->select('id', 'system_event_title', 'title_display_translation', 'priority')
        ->limit(10)
        ->get();

        return response()->json([
            'data' => $results,
        ]);
    }

    /**
     * Generate event type data using AI.
     * Admin only.
     */
    public function generateWithAI(Request $request, AIService $aiService)
    {
        $request->validate([
            'description' => 'required|string|min:3|max:500',
        ]);

        try {
            $result = $aiService->translateEvents($request->description);
            
            return response()->json([
                'success' => true,
                'data' => $result,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage(),
            ], 500);
        }
    }
}
