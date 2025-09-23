<?php

namespace App\Http\Controllers;

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

        $points = Point::with('user:id,name')
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
                    'type' => $point->type,
                    'latitude' => $point->latitude,
                    'longitude' => $point->longitude,
                    'user' => [
                        'id' => $point->user->id,
                        'name' => $point->user->name,
                    ],
                    'is_own' => $point->user_id === Auth::id(),
                    'created_at' => $point->created_at,
                ];
            });

        return response()->json($points);
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
            'type' => 'required|in:incident,crime,event',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
        ]);

        $point = Point::create([
            'user_id' => Auth::id(),
            'title' => $request->title,
            'description' => $request->description,
            'address' => $request->address,
            'type' => $request->type,
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        return response()->json([
            'id' => $point->id,
            'title' => $point->title,
            'description' => $point->description,
            'address' => $point->address,
            'type' => $point->type,
            'latitude' => $point->latitude,
            'longitude' => $point->longitude,
            'user' => [
                'id' => Auth::user()->id,
                'name' => Auth::user()->name,
            ],
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