<?php

namespace Tests\Feature;

use App\Services\AIService;
use Tests\TestCase;

class AIServiceTest extends TestCase
{
    private AIService $aiService;

    protected function setUp(): void
    {
        parent::setUp();
        
        if (empty(config('services.openrouter.api_key'))) {
            $this->markTestSkipped('OpenRouter API key is not configured');
        }

        $this->aiService = new AIService();
    }

    public function test_translate_events_from_russian(): void
    {
        $result = $this->aiService->translateEvents('Сломанная скамейка в парке');

        $this->assertIsArray($result);
        $this->assertArrayHasKey('system_event_title', $result);
        $this->assertArrayHasKey('title_display_translation', $result);

        // Validate system_event_title is not empty and is a string
        $this->assertIsString($result['system_event_title']);
        $this->assertNotEmpty($result['system_event_title']);

        // Validate translations exist for all languages
        $this->assertArrayHasKey('en', $result['title_display_translation']);
        $this->assertArrayHasKey('es', $result['title_display_translation']);
        $this->assertArrayHasKey('ru', $result['title_display_translation']);

        // Validate translations are not empty
        $this->assertNotEmpty($result['title_display_translation']['en']);
        $this->assertNotEmpty($result['title_display_translation']['es']);
        $this->assertNotEmpty($result['title_display_translation']['ru']);
    }

    public function test_translate_events_from_spanish(): void
    {
        $result = $this->aiService->translateEvents('Basura acumulada en la acera');

        $this->assertIsArray($result);
        $this->assertArrayHasKey('system_event_title', $result);
        $this->assertIsString($result['system_event_title']);
        $this->assertNotEmpty($result['system_event_title']);

        // All translations should be present
        $this->assertCount(3, $result['title_display_translation']);
    }

    public function test_translate_events_from_english(): void
    {
        $result = $this->aiService->translateEvents('Broken traffic light');

        $this->assertIsArray($result);
        $this->assertArrayHasKey('system_event_title', $result);
        $this->assertIsString($result['system_event_title']);
        $this->assertNotEmpty($result['system_event_title']);

        // All translations should be present
        $this->assertCount(3, $result['title_display_translation']);
    }

    public function test_translate_events_empty_title_throws_exception(): void
    {
        $this->expectException(\Exception::class);
        
        // Empty string should cause an error
        $this->aiService->translateEvents('');
    }
}
