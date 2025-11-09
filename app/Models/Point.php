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
        'event_type_id',
        'moderation_status',
        'address',
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
     * Get the event type for the point.
     */
    public function eventType(): BelongsTo
    {
        return $this->belongsTo(EventType::class, 'event_type_id');
    }

    /**
     * Get the images for the point.
     */
    public function images(): HasMany
    {
        return $this->hasMany(PointImage::class)->orderBy('created_at');
    }

    /**
     * Check if all images for this point have been classified.
     * An image is considered classified if it has a description.
     */
    public function areAllImagesClassified(): bool
    {
        $totalImages = $this->images()->count();
        
        // If no images, consider it as "all classified"
        if ($totalImages === 0) {
            return true;
        }
        
        $classifiedImages = $this->images()->whereNotNull('description')->count();
        
        return $totalImages === $classifiedImages;
    }

    /**
     * Update point moderation status based on images.
     * If any image is 'filtered', the point is 'filtered'.
     * Otherwise, the point is 'allow'.
     */
    public function updateModerationStatus(): void
    {
        // Don't update if point is declined - it should stay declined until moderator approves/declines again
        if ($this->moderation_status === 'declined') {
            return;
        }
        
        $hasFiltered = $this->images()->where('moderation_status', 'filtered')->exists();
        
        $this->update([
            'moderation_status' => $hasFiltered ? 'filtered' : 'allow',
        ]);
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