<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('event_types', function (Blueprint $table) {
            $table->id();
            $table->string('system_event_title')->unique();
            $table->enum('priority', ['high', 'medium', 'low']);
            $table->jsonb('title_display_translation');
            $table->jsonb('notify_to')->nullable();
            $table->enum('notification_mode', ['immediate', 'on-moderation', 'none'])->default('none');
            $table->foreignId('moderated_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
            
            // Indexes for performance
            $table->index('priority');
            $table->index('notification_mode');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_types');
    }
};
