<?php

namespace Tests\Feature;

use App\Enums\NotificationMode;
use App\Enums\Priority;
use App\Enums\UserRole;
use App\Models\EventType;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class EventTypeCrudTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => UserRole::ADMIN]);
        $this->user = User::factory()->create(['role' => UserRole::USER]);
    }

    public function test_authenticated_users_can_list_event_types(): void
    {
        EventType::factory()->count(5)->create();

        $response = $this->actingAs($this->user)->getJson('/api/event-types');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'system_event_title', 'priority', 'title_display_translation', 'notification_mode'],
                ],
                'current_page',
                'per_page',
                'total',
            ]);
    }

    public function test_search_filter_requires_minimum_3_characters(): void
    {
        EventType::factory()->create(['system_event_title' => 'Broken bench in park']);
        EventType::factory()->create(['system_event_title' => 'Another event']);

        // With less than 3 characters, filter is not applied, so all records are returned
        $response = $this->actingAs($this->user)->getJson('/api/event-types?search=br');
        $this->assertEquals(2, $response->json('total')); // No filter applied, all returned

        // With 3 or more characters, filter is applied
        $response = $this->actingAs($this->user)->getJson('/api/event-types?search=bro');
        $this->assertEquals(1, $response->json('total')); // Filter applied, only matching returned
        $this->assertStringContainsString('Broken', $response->json('data.0.system_event_title'));
    }

    public function test_can_filter_by_priority(): void
    {
        EventType::factory()->create(['priority' => Priority::HIGH]);
        EventType::factory()->create(['priority' => Priority::LOW]);

        $response = $this->actingAs($this->user)->getJson('/api/event-types?priority=high');

        $response->assertOk();
        $this->assertEquals(1, $response->json('total'));
        $this->assertEquals('high', $response->json('data.0.priority'));
    }

    public function test_can_filter_by_notification_mode(): void
    {
        EventType::factory()->create(['notification_mode' => NotificationMode::IMMEDIATE]);
        EventType::factory()->create(['notification_mode' => NotificationMode::NONE]);

        $response = $this->actingAs($this->user)->getJson('/api/event-types?notification_mode=immediate');

        $response->assertOk();
        $this->assertEquals(1, $response->json('total'));
        $this->assertEquals('immediate', $response->json('data.0.notification_mode'));
    }

    public function test_autocomplete_requires_minimum_3_characters(): void
    {
        $response = $this->actingAs($this->user)->getJson('/api/event-types/autocomplete?search=br');

        $response->assertOk()
            ->assertJson(['message' => 'Minimum 3 characters required']);
    }

    public function test_autocomplete_returns_matching_results(): void
    {
        EventType::factory()->create(['system_event_title' => 'Broken bench in park']);
        EventType::factory()->create(['system_event_title' => 'Fallen tree on road']);

        $response = $this->actingAs($this->user)->getJson('/api/event-types/autocomplete?search=bro');

        $response->assertOk()
            ->assertJsonStructure([
                'data' => [
                    '*' => ['id', 'system_event_title', 'title_display_translation', 'priority'],
                ],
            ]);

        $this->assertCount(1, $response->json('data'));
    }

    public function test_authenticated_users_can_view_single_event_type(): void
    {
        $eventType = EventType::factory()->create();

        $response = $this->actingAs($this->user)->getJson("/api/event-types/{$eventType->id}");

        $response->assertOk()
            ->assertJson([
                'data' => [
                    'id' => $eventType->id,
                    'system_event_title' => $eventType->system_event_title,
                ],
            ]);
    }

    public function test_admin_can_create_event_type(): void
    {
        $data = [
            'system_event_title' => 'Test event type',
            'priority' => 'high',
            'title_display_translation' => [
                'en' => 'Test event',
                'es' => 'Evento de prueba',
                'ru' => 'Тестовое событие',
            ],
            'notification_mode' => 'none',
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/event-types', $data);

        $response->assertCreated()
            ->assertJson([
                'message' => 'Event type created successfully',
                'data' => [
                    'system_event_title' => 'Test event type',
                    'priority' => 'high',
                ],
            ]);

        $this->assertDatabaseHas('event_types', ['system_event_title' => 'Test event type']);
    }

    public function test_regular_user_cannot_create_event_type(): void
    {
        $data = [
            'system_event_title' => 'Test event type',
            'priority' => 'high',
            'title_display_translation' => [
                'en' => 'Test event',
                'es' => 'Evento de prueba',
                'ru' => 'Тестовое событие',
            ],
            'notification_mode' => 'none',
        ];

        $response = $this->actingAs($this->user)->postJson('/api/event-types', $data);

        $response->assertForbidden();
    }

    public function test_admin_can_update_event_type(): void
    {
        $eventType = EventType::factory()->create();

        $data = [
            'system_event_title' => 'Updated event type',
            'priority' => 'low',
        ];

        $response = $this->actingAs($this->admin)->putJson("/api/event-types/{$eventType->id}", $data);

        $response->assertOk()
            ->assertJson([
                'message' => 'Event type updated successfully',
                'data' => [
                    'system_event_title' => 'Updated event type',
                    'priority' => 'low',
                ],
            ]);

        $this->assertDatabaseHas('event_types', ['system_event_title' => 'Updated event type']);
    }

    public function test_regular_user_cannot_update_event_type(): void
    {
        $eventType = EventType::factory()->create();

        $response = $this->actingAs($this->user)->putJson("/api/event-types/{$eventType->id}", [
            'system_event_title' => 'Updated title',
        ]);

        $response->assertForbidden();
    }

    public function test_admin_can_delete_event_type(): void
    {
        $eventType = EventType::factory()->create();

        $response = $this->actingAs($this->admin)->deleteJson("/api/event-types/{$eventType->id}");

        $response->assertOk()
            ->assertJson(['message' => 'Event type deleted successfully']);

        $this->assertDatabaseMissing('event_types', ['id' => $eventType->id]);
    }

    public function test_regular_user_cannot_delete_event_type(): void
    {
        $eventType = EventType::factory()->create();

        $response = $this->actingAs($this->user)->deleteJson("/api/event-types/{$eventType->id}");

        $response->assertForbidden();
    }

    public function test_cannot_create_duplicate_event_type(): void
    {
        EventType::factory()->create(['system_event_title' => 'Unique event']);

        $data = [
            'system_event_title' => 'Unique event',
            'priority' => 'high',
            'title_display_translation' => [
                'en' => 'Test',
                'es' => 'Prueba',
                'ru' => 'Тест',
            ],
            'notification_mode' => 'none',
        ];

        $response = $this->actingAs($this->admin)->postJson('/api/event-types', $data);

        $response->assertUnprocessable()
            ->assertJsonValidationErrors(['system_event_title']);
    }

    public function test_unauthenticated_users_cannot_access_event_types(): void
    {
        $response = $this->getJson('/api/event-types');
        $response->assertUnauthorized();

        $response = $this->postJson('/api/event-types', []);
        $response->assertUnauthorized();
    }
}
