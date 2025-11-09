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
        Schema::table('point_images', function (Blueprint $table) {
            // Add classified_type foreign key (nullable) - связь с event_types
            $table->foreignId('classified_type')->nullable()->after('user_id')->constrained('event_types')->onDelete('set null');
            
            // Add description field (nullable)
            $table->string('description')->nullable()->after('classified_type');
            
            // Add index for classified_type
            $table->index('classified_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('point_images', function (Blueprint $table) {
            // Drop foreign key and columns
            $table->dropForeign(['classified_type']);
            $table->dropColumn(['classified_type', 'description']);
        });
    }
};
