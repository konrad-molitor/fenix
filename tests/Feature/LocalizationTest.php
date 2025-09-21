<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\File;
use Tests\TestCase;

class LocalizationTest extends TestCase
{
    /**
     * Test that all supported locales have translation files.
     */
    public function test_all_locales_have_translation_files(): void
    {
        $supportedLocales = array_keys(config('app.supported_locales', []));
        $langPath = resource_path('lang');
        
        foreach ($supportedLocales as $locale) {
            $filePath = "{$langPath}/{$locale}.json";
            $this->assertFileExists($filePath, "Translation file missing for locale: {$locale}");
        }
    }
    
    /**
     * Test that all translation files contain valid JSON.
     */
    public function test_translation_files_contain_valid_json(): void
    {
        $supportedLocales = array_keys(config('app.supported_locales', []));
        $langPath = resource_path('lang');
        
        foreach ($supportedLocales as $locale) {
            $filePath = "{$langPath}/{$locale}.json";
            
            if (File::exists($filePath)) {
                $content = File::get($filePath);
                $decoded = json_decode($content, true);
                
                $this->assertNotNull($decoded, "Invalid JSON in {$locale}.json: " . json_last_error_msg());
                $this->assertIsArray($decoded, "Translation file {$locale}.json should contain a JSON object");
            }
        }
    }
    
    /**
     * Test that all translation files have the same keys.
     */
    public function test_translation_files_have_consistent_keys(): void
    {
        $supportedLocales = array_keys(config('app.supported_locales', []));
        $langPath = resource_path('lang');
        $translations = [];
        
        // Load all translations
        foreach ($supportedLocales as $locale) {
            $filePath = "{$langPath}/{$locale}.json";
            
            if (File::exists($filePath)) {
                $content = File::get($filePath);
                $decoded = json_decode($content, true);
                
                if ($decoded !== null) {
                    $translations[$locale] = array_keys($decoded);
                }
            }
        }
        
        if (count($translations) < 2) {
            $this->markTestSkipped('Need at least 2 translation files to compare keys');
        }
        
        $masterKeys = reset($translations);
        $masterLocale = array_key_first($translations);
        
        foreach ($translations as $locale => $keys) {
            if ($locale === $masterLocale) continue;
            
            $missingKeys = array_diff($masterKeys, $keys);
            $extraKeys = array_diff($keys, $masterKeys);
            
            $this->assertEmpty($missingKeys, 
                "Keys missing in {$locale}.json: " . implode(', ', $missingKeys)
            );
            
            $this->assertEmpty($extraKeys, 
                "Extra keys in {$locale}.json: " . implode(', ', $extraKeys)
            );
        }
    }
    
    /**
     * Test that no translation values are empty.
     */
    public function test_no_empty_translations(): void
    {
        $supportedLocales = array_keys(config('app.supported_locales', []));
        $langPath = resource_path('lang');
        
        foreach ($supportedLocales as $locale) {
            $filePath = "{$langPath}/{$locale}.json";
            
            if (File::exists($filePath)) {
                $content = File::get($filePath);
                $decoded = json_decode($content, true);
                
                if ($decoded !== null) {
                    foreach ($decoded as $key => $value) {
                        $this->assertNotEmpty(trim($value), 
                            "Empty translation for key '{$key}' in {$locale}.json"
                        );
                    }
                }
            }
        }
    }
    
    /**
     * Test that translation files don't have duplicate keys.
     * This is more of a JSON structure test since PHP's json_decode would handle duplicates.
     */
    public function test_no_duplicate_keys_in_translation_files(): void
    {
        $supportedLocales = array_keys(config('app.supported_locales', []));
        $langPath = resource_path('lang');
        
        foreach ($supportedLocales as $locale) {
            $filePath = "{$langPath}/{$locale}.json";
            
            if (File::exists($filePath)) {
                $content = File::get($filePath);
                
                // Count key occurrences in raw content
                preg_match_all('/"([^"]+)"\s*:/', $content, $matches);
                $keyOccurrences = array_count_values($matches[1]);
                
                foreach ($keyOccurrences as $key => $count) {
                    $this->assertEquals(1, $count, 
                        "Duplicate key '{$key}' found {$count} times in {$locale}.json"
                    );
                }
            }
        }
    }
    
    /**
     * Test the localization validation command.
     */
    public function test_localization_validation_command(): void
    {
        $this->artisan('localization:validate')
             ->assertExitCode(0);
    }
    
    /**
     * Test the localization validation command with JSON output.
     */
    public function test_localization_validation_command_json_output(): void
    {
        $this->artisan('localization:validate --json')
             ->expectsOutputToContain('success')
             ->assertExitCode(0);
    }
}
