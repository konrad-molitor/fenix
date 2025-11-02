<?php

namespace App\Console\Commands;

use App\Services\AIService;
use Illuminate\Console\Command;

class TestAIServiceCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ai:test-translate {event_title?}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Test AI service event translation';

    /**
     * Execute the console command.
     */
    public function handle(AIService $aiService)
    {
        $eventTitle = $this->argument('event_title');

        if (!$eventTitle) {
            $eventTitle = $this->ask('Enter event title in any language');
        }

        if (empty($eventTitle)) {
            $this->error('Event title is required');
            return Command::FAILURE;
        }

        $this->info("Translating: {$eventTitle}");
        $this->line('<fg=gray>Available models: ' . count(config('services.openrouter.models')) . '</>');
        $this->newLine();

        try {
            $result = $aiService->translateEvents($eventTitle);

            $this->line('<fg=green>✓</> Translation successful!');
            $this->newLine();

            $this->line('<fg=cyan>System Event Title:</>');
            $this->line("  {$result['system_event_title']}");
            $this->newLine();

            $this->line('<fg=cyan>Translations:</>');
            $this->line("  🇬🇧 EN: {$result['title_display_translation']['en']}");
            $this->line("  🇪🇸 ES: {$result['title_display_translation']['es']}");
            $this->line("  🇷🇺 RU: {$result['title_display_translation']['ru']}");
            $this->newLine();

            $this->line('<fg=yellow>JSON Output:</>');
            $this->line(json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));

            return Command::SUCCESS;
        } catch (\Exception $e) {
            $this->error('Error: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
