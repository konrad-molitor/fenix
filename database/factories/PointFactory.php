<?php

namespace Database\Factories;

use App\Models\Point;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Point>
 */
class PointFactory extends Factory
{
    protected $model = Point::class;

    public function definition(): array
    {
        $lat = fake()->latitude(55.5, 56.0); // around Moscow area for consistency
        $lng = fake()->longitude(37.3, 37.9);

        return [
            'user_id' => User::factory(),
            'title' => fake()->optional()->sentence(3),
            'description' => fake()->optional()->text(100),
            'address' => fake()->optional()->address(),
            'type' => fake()->randomElement(['incident', 'crime', 'event']),
            'latitude' => $lat,
            'longitude' => $lng,
        ];
    }
}


