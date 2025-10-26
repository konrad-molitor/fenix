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