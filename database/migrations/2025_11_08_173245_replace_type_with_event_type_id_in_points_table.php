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
        Schema::table('points', function (Blueprint $table) {
            // Drop the old enum type column
            $table->dropColumn('type');
            
            // Add new event_type_id foreign key (nullable)
            $table->foreignId('event_type_id')->nullable()->after('description')->constrained('event_types')->onDelete('set null');
            $table->index('event_type_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('points', function (Blueprint $table) {
            // Drop the foreign key and column
            $table->dropForeign(['event_type_id']);
            $table->dropColumn('event_type_id');
            
            // Restore the old enum type column
            $table->enum('type', ['incident', 'crime', 'event'])->default('incident')->after('description');
        });
    }
};
