<?php

namespace Tests\Feature;

use App\Models\Point;
use App\Models\User;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class PointsTest extends TestCase
{
    use WithFaker;

    protected function authenticate(): User
    {
        $user = User::factory()->create();
        $this->actingAs($user);
        return $user;
    }

    public function test_can_create_point(): void
    {
        $this->authenticate();

        // First, make sure we have an event type
        $eventType = \App\Models\EventType::factory()->create();

        $payload = [
            'title' => 'Test Point',
            'description' => 'Desc',
            'address' => 'Somewhere',
            'event_type_id' => $eventType->id,
            'latitude' => 55.75,
            'longitude' => 37.62,
        ];

        $response = $this->postJson(route('points.store'), $payload);

        $response->assertCreated()
            ->assertJsonFragment([
                'title' => 'Test Point',
                'event_type_id' => $eventType->id,
                'latitude' => '55.750000',
                'longitude' => '37.620000',
            ]);

        $this->assertDatabaseHas('points', [
            'title' => 'Test Point',
            'event_type_id' => $eventType->id,
        ]);
    }

    public function test_can_delete_own_point(): void
    {
        $user = $this->authenticate();
        $point = Point::factory()->for($user)->create([
            'latitude' => 55.75,
            'longitude' => 37.62,
        ]);

        $response = $this->deleteJson(route('points.destroy', $point));

        $response->assertOk();
        $this->assertDatabaseMissing('points', ['id' => $point->id]);
    }

    public function test_cannot_delete_others_point(): void
    {
        $this->authenticate();
        $other = User::factory()->create();
        $point = Point::factory()->for($other)->create();

        $response = $this->deleteJson(route('points.destroy', $point));
        $response->assertForbidden();
        $this->assertDatabaseHas('points', ['id' => $point->id]);
    }

    public function test_index_filters_points_within_bounds(): void
    {
        $user = $this->authenticate();

        // Create an event type for points
        $eventType = \App\Models\EventType::factory()->create();
        $otherUser = User::factory()->create();

        // Define bounds roughly around a small square
        $swLat = 55.70; $swLng = 37.60; // southwest
        $neLat = 55.80; $neLng = 37.70; // northeast

        // Three inside with event_type_id (will be shown to everyone)
        Point::factory()->create(['latitude' => 55.72, 'longitude' => 37.62, 'event_type_id' => $eventType->id]);
        Point::factory()->create(['latitude' => 55.75, 'longitude' => 37.65, 'event_type_id' => $eventType->id]);
        Point::factory()->create(['latitude' => 55.78, 'longitude' => 37.68, 'event_type_id' => $eventType->id]);
        
        // One outside (won't be shown - outside bounds)
        Point::factory()->create(['latitude' => 55.90, 'longitude' => 37.80, 'event_type_id' => $eventType->id]);
        
        // One inside by current user without event_type_id (WILL be shown - own point)
        Point::factory()->for($user)->create(['latitude' => 55.76, 'longitude' => 37.66, 'event_type_id' => null]);
        
        // One inside by other user without event_type_id (will be filtered out - not own point, no event_type)
        Point::factory()->for($otherUser)->create(['latitude' => 55.74, 'longitude' => 37.64, 'event_type_id' => null]);

        $response = $this->getJson(route('points.index', [
            'sw_lat' => $swLat,
            'sw_lng' => $swLng,
            'ne_lat' => $neLat,
            'ne_lng' => $neLng,
        ]));

        $response->assertOk();
        $data = $response->json();

        // Should return 4 points: 3 with event_type + 1 own without event_type
        $this->assertCount(4, $data);
        
        foreach ($data as $p) {
            $this->assertGreaterThanOrEqual($swLat, (float)$p['latitude']);
            $this->assertLessThanOrEqual($neLat, (float)$p['latitude']);
            $this->assertGreaterThanOrEqual($swLng, (float)$p['longitude']);
            $this->assertLessThanOrEqual($neLng, (float)$p['longitude']);
        }
        
        // Verify that we have one point without event_type_id (our own)
        $pointsWithoutEventType = array_filter($data, fn($p) => $p['event_type_id'] === null);
        $this->assertCount(1, $pointsWithoutEventType);
        
        // Verify it's our own point
        $ownPointWithoutType = array_values($pointsWithoutEventType)[0];
        $this->assertTrue($ownPointWithoutType['is_own']);
    }
}


