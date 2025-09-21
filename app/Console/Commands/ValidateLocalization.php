<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

class ValidateLocalization extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'localization:validate {--json : Output results as JSON}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Validate localization files for completeness and correctness';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🔍 Validating localization files...');
        
        $errors = [];
        $warnings = [];
        $supportedLocales = array_keys(config('app.supported_locales', []));
        $langPath = resource_path('lang');
        
        // 1. Check if translation files exist for all supported locales
        $this->info('📁 Checking translation file existence...');
        foreach ($supportedLocales as $locale) {
            $filePath = "{$langPath}/{$locale}.json";
            if (!File::exists($filePath)) {
                $errors[] = "Missing translation file for locale '{$locale}': {$filePath}";
            }
        }
        
        if (!empty($errors)) {
            $this->outputResults($errors, $warnings);
            return Command::FAILURE;
        }
        
        // Load all translation files
        $translations = [];
        foreach ($supportedLocales as $locale) {
            $filePath = "{$langPath}/{$locale}.json";
            
            // 2. Check JSON validity
            $content = File::get($filePath);
            $decoded = json_decode($content, true);
            
            if (json_last_error() !== JSON_ERROR_NONE) {
                $errors[] = "Invalid JSON in {$locale}.json: " . json_last_error_msg();
                continue;
            }
            
            $translations[$locale] = $decoded;
        }
        
        if (!empty($errors)) {
            $this->outputResults($errors, $warnings);
            return Command::FAILURE;
        }
        
        // 3. Check key consistency across locales
        $this->info('🔑 Checking key consistency...');
        $allKeys = [];
        foreach ($translations as $locale => $keys) {
            $allKeys[$locale] = array_keys($keys);
        }
        
        $masterKeys = reset($allKeys); // Use first locale as reference
        $masterLocale = array_key_first($allKeys);
        
        foreach ($allKeys as $locale => $keys) {
            if ($locale === $masterLocale) continue;
            
            // Keys missing in current locale
            $missingKeys = array_diff($masterKeys, $keys);
            foreach ($missingKeys as $key) {
                $errors[] = "Key '{$key}' exists in {$masterLocale}.json but missing in {$locale}.json";
            }
            
            // Extra keys in current locale
            $extraKeys = array_diff($keys, $masterKeys);
            foreach ($extraKeys as $key) {
                $warnings[] = "Key '{$key}' exists in {$locale}.json but missing in {$masterLocale}.json";
            }
        }
        
        // 4. Check for empty translations
        $this->info('🔤 Checking for empty translations...');
        foreach ($translations as $locale => $keys) {
            foreach ($keys as $key => $value) {
                if (empty(trim($value))) {
                    $errors[] = "Empty translation for key '{$key}' in {$locale}.json";
                }
            }
        }
        
        // 5. Check for duplicate keys (shouldn't happen with JSON, but good to verify)
        $this->info('🔄 Checking for potential duplicates...');
        foreach ($supportedLocales as $locale) {
            $filePath = "{$langPath}/{$locale}.json";
            $content = File::get($filePath);
            
            // Count key occurrences in raw content
            preg_match_all('/"([^"]+)"\s*:/', $content, $matches);
            $keyOccurrences = array_count_values($matches[1]);
            
            foreach ($keyOccurrences as $key => $count) {
                if ($count > 1) {
                    $errors[] = "Duplicate key '{$key}' found {$count} times in {$locale}.json";
                }
            }
        }
        
        // Output results
        return $this->outputResults($errors, $warnings);
    }
    
    private function outputResults(array $errors, array $warnings): int
    {
        $hasErrors = !empty($errors);
        $hasWarnings = !empty($warnings);
        
        if ($this->option('json')) {
            $this->line(json_encode([
                'success' => !$hasErrors,
                'errors' => $errors,
                'warnings' => $warnings,
                'summary' => [
                    'error_count' => count($errors),
                    'warning_count' => count($warnings),
                ]
            ], JSON_PRETTY_PRINT));
            
            return $hasErrors ? Command::FAILURE : Command::SUCCESS;
        }
        
        if ($hasErrors) {
            $this->error('❌ Localization validation failed!');
            $this->newLine();
            
            $this->error('🚨 Errors:');
            foreach ($errors as $error) {
                $this->line("  • {$error}");
            }
            $this->newLine();
        }
        
        if ($hasWarnings) {
            $this->warn('⚠️  Warnings:');
            foreach ($warnings as $warning) {
                $this->line("  • {$warning}");
            }
            $this->newLine();
        }
        
        if (!$hasErrors && !$hasWarnings) {
            $this->info('✅ All localization files are valid!');
            
            $supportedLocales = array_keys(config('app.supported_locales', []));
            $this->info("📊 Summary:");
            $this->line("  • Locales checked: " . implode(', ', $supportedLocales));
            
            if (!empty($supportedLocales)) {
                $langPath = resource_path('lang');
                $sampleFile = "{$langPath}/{$supportedLocales[0]}.json";
                if (File::exists($sampleFile)) {
                    $sampleKeys = json_decode(File::get($sampleFile), true);
                    $this->line("  • Translation keys: " . count($sampleKeys));
                }
            }
        }
        
        return $hasErrors ? Command::FAILURE : Command::SUCCESS;
    }
}
