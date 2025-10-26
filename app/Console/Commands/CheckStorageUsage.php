<?php

namespace App\Console\Commands;

use App\Models\PointImage;
use Illuminate\Console\Command;

class CheckStorageUsage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:storage-usage';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check storage usage';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $totalImages = PointImage::count();
        $totalSize = PointImage::sum('size');
        $maxSize = config('uploads.max_total_storage_bytes');
        
        $usagePercent = $maxSize > 0 ? ($totalSize / $maxSize) * 100 : 0;
        
        $this->info('Storage Usage:');
        $this->line('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        $this->line(sprintf('Total images: %d', $totalImages));
        $this->line(sprintf('Used: %.2f MB / %.2f MB', 
            $totalSize / 1024 / 1024,
            $maxSize / 1024 / 1024
        ));
        $this->line(sprintf('Usage percentage: %.1f%%', $usagePercent));
        
        if ($usagePercent > 80) {
            $this->warn('WARNING: More than 80% of storage used!');
        } else {
            $this->newLine();
            $this->info('Storage usage is within limits');
        }
        
        return 0;
    }
}
