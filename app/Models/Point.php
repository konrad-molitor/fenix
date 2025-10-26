<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Point extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'address',
        'type',
        'latitude',
        'longitude',
        'location',
    ];

    protected $casts = [
        'latitude' => 'decimal:6',
        'longitude' => 'decimal:6',
    ];

    /**
     * Get the user that owns the point.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the images for the point.
     */
    public function images(): HasMany
    {
        return $this->hasMany(PointImage::class)->orderBy('created_at');
    }

    /**
     * Create location geometry from latitude and longitude.
     */
    public static function createLocationFromCoordinates(float $latitude, float $longitude): string
    {
        return "POINT({$longitude} {$latitude})";
    }

    /**
     * Scope for points within bounds.
     */
    public function scopeWithinBounds($query, float $swLat, float $swLng, float $neLat, float $neLng)
    {
        return $query->whereBetween('latitude', [$swLat, $neLat])
                    ->whereBetween('longitude', [$swLng, $neLng]);
    }

    /**
     * Scope for points within radius (in meters) from a location, ordered by distance.
     */
    public function scopeWithinRadius($query, float $latitude, float $longitude, float $radiusMeters)
    {
        // Using ST_Distance_Sphere for accurate distance calculation
        // ST_Distance_Sphere returns distance in meters
        return $query->selectRaw('*, ST_Distance_Sphere(
                POINT(longitude, latitude),
                POINT(?, ?)
            ) as distance', [$longitude, $latitude])
            ->whereRaw('ST_Distance_Sphere(
                POINT(longitude, latitude),
                POINT(?, ?)
            ) <= ?', [$longitude, $latitude, $radiusMeters])
            ->orderBy('distance', 'asc');
    }

    /**
     * Scope for points within a square area (in meters) from a location.
     * The radiusMeters parameter defines distance from center to edge.
     * Creates a square with side = radiusMeters (from center outward in all directions).
     */
    public function scopeWithinSquare($query, float $latitude, float $longitude, float $radiusMeters)
    {
        // Approximate degrees per meter (rough approximation)
        // At equator: 1 degree latitude = ~111km, 1 degree longitude = ~111km
        // This gets less accurate near poles, but good enough for our use case
        $latDegrees = $radiusMeters / 111000;
        $lngDegrees = $radiusMeters / (111000 * cos(deg2rad($latitude)));

        return $query->selectRaw('*, ST_Distance_Sphere(
                POINT(longitude, latitude),
                POINT(?, ?)
            ) as distance', [$longitude, $latitude])
            ->whereBetween('latitude', [$latitude - $latDegrees, $latitude + $latDegrees])
            ->whereBetween('longitude', [$longitude - $lngDegrees, $longitude + $lngDegrees])
            ->orderBy('distance', 'asc');
    }

    /**
     * Boot method to automatically create location geometry.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($point) {
            if ($point->latitude && $point->longitude) {
                $point->location = \DB::raw("ST_GeomFromText('POINT({$point->longitude} {$point->latitude})', 4326)");
            }
        });

        static::updating(function ($point) {
            if ($point->latitude && $point->longitude) {
                $point->location = \DB::raw("ST_GeomFromText('POINT({$point->longitude} {$point->latitude})', 4326)");
            }
        });

        static::deleting(function ($point) {
            $point->images()->each(function ($image) {
                $image->delete();
            });
        });
    }
}