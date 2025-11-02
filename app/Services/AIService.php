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

