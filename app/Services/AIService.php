<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class AIService
{
    private string $apiKey;
    private array $models;
    private string $baseUrl;
    private int $retryDelay;

    public function __construct()
    {
        $this->apiKey = config('services.openrouter.api_key');
        $this->models = config('services.openrouter.models', []);
        $this->baseUrl = config('services.openrouter.base_url');
        $this->retryDelay = config('services.openrouter.retry_delay', 2);

        if (empty($this->apiKey)) {
            throw new \Exception('OpenRouter API key is not configured');
        }

        if (empty($this->models)) {
            throw new \Exception('No OpenRouter models configured');
        }
    }

    /**
     * Translate event title to all supported languages and generate system event title.
     * 
     * @param string $eventTitle Event title in any language
     * @return array{system_event_title: string, title_display_translation: array{en: string, es: string, ru: string}}
     * @throws \Exception
     */
    public function translateEvents(string $eventTitle): array
    {
        // Validate input
        if (empty(trim($eventTitle))) {
            throw new \Exception('Event title cannot be empty');
        }

        $prompt = $this->buildTranslationPrompt($eventTitle);
        $errors = [];

        // Try each model with one retry
        foreach ($this->models as $modelIndex => $model) {
            $maxAttemptsPerModel = 2; // Initial attempt + 1 retry
            
            for ($attempt = 1; $attempt <= $maxAttemptsPerModel; $attempt++) {
                try {
                    $response = Http::withHeaders([
                        'Authorization' => 'Bearer ' . $this->apiKey,
                        'HTTP-Referer' => config('app.url'),
                        'X-Title' => config('app.name'),
                        'Content-Type' => 'application/json',
                    ])
                    ->timeout(120)
                    ->post("{$this->baseUrl}/chat/completions", [
                        'model' => $model,
                        'messages' => [
                            [
                                'role' => 'system',
                                'content' => 'You are a helpful assistant specialized in translation and text normalization. Always respond ONLY with valid JSON, no additional text or markdown formatting.',
                            ],
                            [
                                'role' => 'user',
                                'content' => $prompt,
                            ],
                        ],
                        'temperature' => 0.3,
                        'max_tokens' => 500,
                    ]);

                    if (!$response->successful()) {
                        $responseBody = $response->json();
                        
                        // Check if it's a rate limit error
                        if (isset($responseBody['error']['code']) && $responseBody['error']['code'] === 429) {
                            $errorMsg = "Model {$model} - Rate limit (attempt {$attempt}/{$maxAttemptsPerModel})";
                            $errors[] = $errorMsg;
                            
                            // If this is not the last attempt for this model, wait and retry
                            if ($attempt < $maxAttemptsPerModel) {
                                sleep($this->retryDelay);
                                continue;
                            }
                            
                            // If this is the last attempt for this model, try next model
                            break;
                        }
                        
                        // Other error - try next model immediately
                        $errors[] = "Model {$model} - Error: " . ($responseBody['error']['message'] ?? 'Unknown error');
                        break;
                    }

                    // Success! Parse and return the response
                    $data = $response->json();

                    if (!isset($data['choices'][0]['message']['content'])) {
                        $errors[] = "Model {$model} - Invalid response format";
                        break;
                    }

                    $content = $data['choices'][0]['message']['content'];
                    
                    // Clean up the response - remove markdown code blocks if present
                    $content = preg_replace('/^```json\s*/m', '', $content);
                    $content = preg_replace('/\s*```$/m', '', $content);
                    $content = trim($content);

                    $result = json_decode($content, true);

                    if (json_last_error() !== JSON_ERROR_NONE) {
                        $errors[] = "Model {$model} - Failed to parse JSON: " . json_last_error_msg();
                        break;
                    }

                    if (!isset($result['system_event_title']) || !isset($result['title_display_translation'])) {
                        $errors[] = "Model {$model} - Invalid response structure";
                        break;
                    }

                    // Validate translations
                    $requiredLanguages = ['en', 'es', 'ru'];
                    $missingLanguages = [];
                    foreach ($requiredLanguages as $lang) {
                        if (!isset($result['title_display_translation'][$lang])) {
                            $missingLanguages[] = $lang;
                        }
                    }
                    
                    if (!empty($missingLanguages)) {
                        $errors[] = "Model {$model} - Missing translations: " . implode(', ', $missingLanguages);
                        break;
                    }

                    // Success! Return the result
                    return [
                        'system_event_title' => $result['system_event_title'],
                        'title_display_translation' => $result['title_display_translation'],
                    ];

                } catch (\Exception $e) {
                    $errors[] = "Model {$model} - Exception (attempt {$attempt}/{$maxAttemptsPerModel}): " . $e->getMessage();
                    
                    // If this is not the last attempt for this model, wait and retry
                    if ($attempt < $maxAttemptsPerModel) {
                        sleep($this->retryDelay);
                        continue;
                    }
                    
                    // If this is the last attempt for this model, try next model
                    break;
                }
            }
        }

        // If we got here, all models failed
        throw new \Exception('All models failed. Errors: ' . implode(' | ', $errors));
    }

    /**
     * Classify image and generate description based on available event types.
     * 
     * @param string $imageUrl URL of the image to classify
     * @param int|null $pointId Optional point ID for context
     * @return array{classified_type_id: int|null, description: string}
     * @throws \Exception
     */
    public function classifyImage(string $imageUrl, ?int $pointId = null): array
    {
        // Validate input
        if (empty(trim($imageUrl))) {
            throw new \Exception('Image URL cannot be empty');
        }

        // Get available event types
        $eventTypes = \App\Models\EventType::all(['id', 'system_event_title', 'title_display_translation']);
        
        if ($eventTypes->isEmpty()) {
            throw new \Exception('No event types available for classification');
        }

        $prompt = $this->buildClassificationPrompt($eventTypes);
        $errors = [];

        // Try each model with one retry
        foreach ($this->models as $modelIndex => $model) {
            $maxAttemptsPerModel = 2; // Initial attempt + 1 retry
            
            for ($attempt = 1; $attempt <= $maxAttemptsPerModel; $attempt++) {
                try {
                    $response = Http::withHeaders([
                        'Authorization' => 'Bearer ' . $this->apiKey,
                        'HTTP-Referer' => config('app.url'),
                        'X-Title' => config('app.name'),
                        'Content-Type' => 'application/json',
                    ])
                    ->timeout(120)
                    ->post("{$this->baseUrl}/chat/completions", [
                        'model' => $model,
                        'messages' => [
                            [
                                'role' => 'system',
                                'content' => 'You are a helpful assistant specialized in analyzing images for citizen reports. Always respond ONLY with valid JSON, no additional text or markdown formatting.',
                            ],
                            [
                                'role' => 'user',
                                'content' => [
                                    [
                                        'type' => 'text',
                                        'text' => $prompt,
                                    ],
                                    [
                                        'type' => 'image_url',
                                        'image_url' => [
                                            'url' => $imageUrl,
                                        ],
                                    ],
                                ],
                            ],
                        ],
                        'temperature' => 0.3,
                        'max_tokens' => 300,
                    ]);

                    if (!$response->successful()) {
                        $responseBody = $response->json();
                        
                        // Check if it's a rate limit error
                        if (isset($responseBody['error']['code']) && $responseBody['error']['code'] === 429) {
                            $errorMsg = "Model {$model} - Rate limit (attempt {$attempt}/{$maxAttemptsPerModel})";
                            $errors[] = $errorMsg;
                            
                            if ($attempt < $maxAttemptsPerModel) {
                                sleep($this->retryDelay);
                                continue;
                            }
                            break;
                        }
                        
                        $errors[] = "Model {$model} - Error: " . ($responseBody['error']['message'] ?? 'Unknown error');
                        break;
                    }

                    // Success! Parse and return the response
                    $data = $response->json();

                    if (!isset($data['choices'][0]['message']['content'])) {
                        $errors[] = "Model {$model} - Invalid response format";
                        break;
                    }

                    $content = $data['choices'][0]['message']['content'];
                    
                    // Clean up the response - remove markdown code blocks if present
                    $content = preg_replace('/^```json\s*/m', '', $content);
                    $content = preg_replace('/\s*```$/m', '', $content);
                    $content = trim($content);

                    $result = json_decode($content, true);

                    if (json_last_error() !== JSON_ERROR_NONE) {
                        $errors[] = "Model {$model} - Failed to parse JSON: " . json_last_error_msg();
                        break;
                    }

                    if (!isset($result['description']) || !isset($result['moderation_status'])) {
                        $errors[] = "Model {$model} - Invalid response structure (missing description or moderation_status)";
                        break;
                    }

                    // classified_type_id can be null if no match found
                    $classifiedTypeId = $result['classified_type_id'] ?? null;
                    
                    // Validate classified_type_id if provided
                    if ($classifiedTypeId !== null && !$eventTypes->contains('id', $classifiedTypeId)) {
                        $errors[] = "Model {$model} - Invalid classified_type_id: {$classifiedTypeId}";
                        break;
                    }

                    // Validate moderation_status
                    $moderationStatus = $result['moderation_status'] ?? 'allow';
                    if (!in_array($moderationStatus, ['allow', 'filtered'])) {
                        $errors[] = "Model {$model} - Invalid moderation_status: {$moderationStatus}";
                        break;
                    }

                    // Success! Return the result
                    return [
                        'classified_type_id' => $classifiedTypeId,
                        'description' => trim($result['description']),
                        'moderation_status' => $moderationStatus,
                        'moderation_reason' => $result['moderation_reason'] ?? null,
                    ];

                } catch (\Exception $e) {
                    $errors[] = "Model {$model} - Exception (attempt {$attempt}/{$maxAttemptsPerModel}): " . $e->getMessage();
                    
                    if ($attempt < $maxAttemptsPerModel) {
                        sleep($this->retryDelay);
                        continue;
                    }
                    break;
                }
            }
        }

        // If we got here, all models failed
        throw new \Exception('All models failed. Errors: ' . implode(' | ', $errors));
    }

    /**
     * Classify point based on title, description, and image descriptions.
     * 
     * @param \App\Models\Point $point Point to classify
     * @return array{event_type_id: int|null}
     * @throws \Exception
     */
    public function classifyPoint(\App\Models\Point $point): array
    {
        // Get available event types
        $eventTypes = \App\Models\EventType::all(['id', 'system_event_title', 'title_display_translation']);
        
        if ($eventTypes->isEmpty()) {
            throw new \Exception('No event types available for classification');
        }

        // Collect all text data
        $title = $point->title ?? 'No title';
        $description = $point->description ?? 'No description';
        
        // Get image descriptions
        $imageDescriptions = $point->images()
            ->whereNotNull('description')
            ->pluck('description')
            ->toArray();
        
        $prompt = $this->buildPointClassificationPrompt($eventTypes, $title, $description, $imageDescriptions);
        $errors = [];

        // Try each model with one retry
        foreach ($this->models as $modelIndex => $model) {
            $maxAttemptsPerModel = 2;
            
            for ($attempt = 1; $attempt <= $maxAttemptsPerModel; $attempt++) {
                try {
                    $response = Http::withHeaders([
                        'Authorization' => 'Bearer ' . $this->apiKey,
                        'HTTP-Referer' => config('app.url'),
                        'X-Title' => config('app.name'),
                        'Content-Type' => 'application/json',
                    ])
                    ->timeout(120)
                    ->post("{$this->baseUrl}/chat/completions", [
                        'model' => $model,
                        'messages' => [
                            [
                                'role' => 'system',
                                'content' => 'You are a helpful assistant specialized in classifying citizen reports. Always respond ONLY with valid JSON, no additional text or markdown formatting.',
                            ],
                            [
                                'role' => 'user',
                                'content' => $prompt,
                            ],
                        ],
                        'temperature' => 0.3,
                        'max_tokens' => 200,
                    ]);

                    if (!$response->successful()) {
                        $responseBody = $response->json();
                        
                        if (isset($responseBody['error']['code']) && $responseBody['error']['code'] === 429) {
                            $errorMsg = "Model {$model} - Rate limit (attempt {$attempt}/{$maxAttemptsPerModel})";
                            $errors[] = $errorMsg;
                            
                            if ($attempt < $maxAttemptsPerModel) {
                                sleep($this->retryDelay);
                                continue;
                            }
                            break;
                        }
                        
                        $errors[] = "Model {$model} - Error: " . ($responseBody['error']['message'] ?? 'Unknown error');
                        break;
                    }

                    $data = $response->json();

                    if (!isset($data['choices'][0]['message']['content'])) {
                        $errors[] = "Model {$model} - Invalid response format";
                        break;
                    }

                    $content = $data['choices'][0]['message']['content'];
                    
                    // Clean up the response
                    $content = preg_replace('/^```json\s*/m', '', $content);
                    $content = preg_replace('/\s*```$/m', '', $content);
                    $content = trim($content);

                    $result = json_decode($content, true);

                    if (json_last_error() !== JSON_ERROR_NONE) {
                        $errors[] = "Model {$model} - Failed to parse JSON: " . json_last_error_msg();
                        break;
                    }

                    if (!isset($result['event_type_id'])) {
                        $errors[] = "Model {$model} - Invalid response structure (missing event_type_id)";
                        break;
                    }

                    $eventTypeId = $result['event_type_id'];
                    
                    // Validate event_type_id if provided
                    if ($eventTypeId !== null && !$eventTypes->contains('id', $eventTypeId)) {
                        $errors[] = "Model {$model} - Invalid event_type_id: {$eventTypeId}";
                        break;
                    }

                    // Success!
                    return [
                        'event_type_id' => $eventTypeId,
                    ];

                } catch (\Exception $e) {
                    $errors[] = "Model {$model} - Exception (attempt {$attempt}/{$maxAttemptsPerModel}): " . $e->getMessage();
                    
                    if ($attempt < $maxAttemptsPerModel) {
                        sleep($this->retryDelay);
                        continue;
                    }
                    break;
                }
            }
        }

        // If we got here, all models failed
        throw new \Exception('All models failed. Errors: ' . implode(' | ', $errors));
    }

    /**
     * Build the point classification prompt.
     */
    private function buildPointClassificationPrompt($eventTypes, string $title, string $description, array $imageDescriptions): string
    {
        $typesText = '';
        foreach ($eventTypes as $type) {
            $typesText .= "- ID: {$type->id}, Title: \"{$type->system_event_title}\"\n";
        }

        $imagesText = '';
        if (!empty($imageDescriptions)) {
            $imagesText = "\nImage descriptions:\n";
            foreach ($imageDescriptions as $idx => $desc) {
                $imagesText .= "  " . ($idx + 1) . ". {$desc}\n";
            }
        } else {
            $imagesText = "\n(No images)";
        }

        return <<<PROMPT
You are analyzing a citizen report to classify it into the appropriate event type.

Report information:
Title: {$title}
Description: {$description}{$imagesText}

Available event types:
{$typesText}

Task:
Select the MOST appropriate event type ID based on ALL the information above.
If NO event type fits, return null.

Rules:
- Consider the title, description, and image descriptions together
- Return ONLY valid JSON, no markdown code blocks
- Be precise in your classification

Example responses:

```json
{
  "event_type_id": 7
}
```

Or if nothing matches:
```json
{
  "event_type_id": null
}
```

Now classify this report and respond with JSON:
PROMPT;
    }

    /**
     * Build the classification prompt for the AI model.
     */
    private function buildClassificationPrompt($eventTypes): string
    {
        $typesText = '';
        foreach ($eventTypes as $type) {
            $typesText .= "- ID: {$type->id}, Title: \"{$type->system_event_title}\"\n";
        }

        return <<<PROMPT
You are analyzing a citizen report image. Your tasks are:

1. **Content Moderation**: Check if the image is appropriate for a civic reporting platform
2. **Classification**: Identify what is shown and match to event type (if appropriate)
3. **Description**: Write a SHORT description (max 100 characters) of what you see

Available event types:
{$typesText}

**Moderation Rules** (set moderation_status):
- **filtered**: NSFW/explicit content, spam/ads, anime/cartoon/virtual/AI-generated characters, memes, off-topic content, low quality/unclear images, violent/disturbing content
- **allow**: Real photos of urban infrastructure issues, accidents, civic problems, public safety concerns

**Classification Rules**:
- If image is **filtered**, still provide description but set classified_type_id to null
- If image is **allow**: match to event type ID or null if no match
- Description should be concise and in English
- Respond ONLY with valid JSON, no markdown code blocks

**Response format**:
{
  "classified_type_id": <number or null>,
  "description": "<short description>",
  "moderation_status": "allow" | "filtered",
  "moderation_reason": "<brief reason if filtered, otherwise null>"
}

**Examples**:

Real infrastructure issue (allow):
{
  "classified_type_id": 5,
  "description": "Wooden park bench with broken backrest",
  "moderation_status": "allow",
  "moderation_reason": null
}

Spam/advertisement (filtered):
{
  "classified_type_id": null,
  "description": "Advertisement poster for commercial product",
  "moderation_status": "filtered",
  "moderation_reason": "spam/ads"
}

Anime character (filtered):
{
  "classified_type_id": null,
  "description": "Cartoon anime character illustration",
  "moderation_status": "filtered",
  "moderation_reason": "anime/virtual"
}

NSFW content (filtered):
{
  "classified_type_id": null,
  "description": "Explicit content",
  "moderation_status": "filtered",
  "moderation_reason": "nsfw"
}

Now analyze this image and respond with JSON:
PROMPT;
    }

    /**
     * Build the translation prompt for the AI model with few-shot examples.
     */
    private function buildTranslationPrompt(string $eventTitle): string
    {
        return <<<PROMPT
Given a citizen report event title in any language, perform the following tasks:

1. Create a "system_event_title" - a clear, concise description in English (natural language, not snake_case)
2. Create translations in three languages: English (en), Spanish (es), and Russian (ru)

Important rules:
- The system_event_title should be a natural English phrase (e.g., "Fallen tree on public road", "Broken water pipe with major leakage")
- Translations should be natural and appropriate for each language
- Keep all translations concise but descriptive
- All three translations must convey the same meaning
- Respond ONLY with valid JSON, no markdown code blocks

Here are some examples:

Example 1:
Input: "Сломанная скамейка в парке"
Output:
{
  "system_event_title": "Broken bench in park",
  "title_display_translation": {
    "en": "Broken bench in park",
    "es": "Banco roto en el parque",
    "ru": "Сломанная скамейка в парке"
  }
}

Example 2:
Input: "Basura acumulada en la acera"
Output:
{
  "system_event_title": "Garbage accumulated on sidewalks",
  "title_display_translation": {
    "en": "Garbage accumulated on sidewalks",
    "es": "Basura acumulada en aceras",
    "ru": "Мусор, накопившийся на тротуаре"
  }
}

Example 3:
Input: "Traffic light not working"
Output:
{
  "system_event_title": "Broken or non-functioning traffic light",
  "title_display_translation": {
    "en": "Broken or non-functioning traffic light",
    "es": "Semáforo roto o no funciona",
    "ru": "Сломанный или неработающий светофор"
  }
}

Now translate this event:
Input: "{$eventTitle}"
Output:
PROMPT;
    }

}

