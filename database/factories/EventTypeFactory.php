<?php

namespace Database\Factories;

use App\Enums\NotificationMode;
use App\Enums\Priority;
use App\Models\EventType;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EventType>
 */
class EventTypeFactory extends Factory
{
    protected $model = EventType::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $priorities = [Priority::HIGH, Priority::MEDIUM, Priority::LOW];
        $notificationModes = [NotificationMode::IMMEDIATE, NotificationMode::ON_MODERATION, NotificationMode::NONE];

        $eventTitles = [
            'Broken streetlight',
            'Overflowing garbage bin',
            'Fallen tree on road',
            'Deep pothole in pavement',
            'Broken traffic light',
            'Damaged bench in park',
            'Graffiti on public wall',
            'Blocked storm drain',
            'Broken water pipe',
            'Stray dogs on street',
        ];

        $title = $this->faker->unique()->randomElement($eventTitles) . ' ' . $this->faker->word();

        return [
            'system_event_title' => $title,
            'priority' => $this->faker->randomElement($priorities),
            'title_display_translation' => [
                'en' => $title,
                'es' => $this->faker->sentence(3),
                'ru' => $this->faker->sentence(3),
            ],
            'notify_to' => null,
            'notification_mode' => $this->faker->randomElement($notificationModes),
            'moderated_by' => null,
        ];
    }

    /**
     * Indicate that the event type has high priority.
     */
    public function highPriority(): static
    {
        return $this->state(fn (array $attributes) => [
            'priority' => Priority::HIGH,
        ]);
    }

    /**
     * Indicate that the event type has immediate notifications.
     */
    public function immediateNotification(): static
    {
        return $this->state(fn (array $attributes) => [
            'notification_mode' => NotificationMode::IMMEDIATE,
            'notify_to' => [
                'type' => 'email',
                'data' => $this->faker->email(),
            ],
        ]);
    }
}
