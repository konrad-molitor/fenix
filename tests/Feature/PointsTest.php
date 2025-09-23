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

        $payload = [
            'title' => 'Test Point',
            'description' => 'Desc',
            'address' => 'Somewhere',
            'type' => 'incident',
            'latitude' => 55.75,
            'longitude' => 37.62,
        ];

        $response = $this->postJson(route('points.store'), $payload);

        $response->assertCreated()
            ->assertJsonFragment([
                'title' => 'Test Point',
                'type' => 'incident',
                'latitude' => '55.750000',
                'longitude' => '37.620000',
            ]);

        $this->assertDatabaseHas('points', [
            'title' => 'Test Point',
            'type' => 'incident',
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
        $this->authenticate();

        // Define bounds roughly around a small square
        $swLat = 55.70; $swLng = 37.60; // southwest
        $neLat = 55.80; $neLng = 37.70; // northeast

        // Three inside
        Point::factory()->create(['latitude' => 55.72, 'longitude' => 37.62]);
        Point::factory()->create(['latitude' => 55.75, 'longitude' => 37.65]);
        Point::factory()->create(['latitude' => 55.78, 'longitude' => 37.68]);
        // One outside
        Point::factory()->create(['latitude' => 55.90, 'longitude' => 37.80]);

        $response = $this->getJson(route('points.index', [
            'sw_lat' => $swLat,
            'sw_lng' => $swLng,
            'ne_lat' => $neLat,
            'ne_lng' => $neLng,
        ]));

        $response->assertOk();
        $data = $response->json();

        $this->assertCount(3, $data);
        foreach ($data as $p) {
            $this->assertGreaterThanOrEqual($swLat, (float)$p['latitude']);
            $this->assertLessThanOrEqual($neLat, (float)$p['latitude']);
            $this->assertGreaterThanOrEqual($swLng, (float)$p['longitude']);
            $this->assertLessThanOrEqual($neLng, (float)$p['longitude']);
        }
    }
}


