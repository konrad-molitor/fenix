<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add 'declined' to point_images moderation_status enum
        DB::statement("ALTER TABLE point_images MODIFY COLUMN moderation_status ENUM('allow', 'filtered', 'declined') NOT NULL DEFAULT 'allow'");
        
        // Add 'declined' to points moderation_status enum
        DB::statement("ALTER TABLE points MODIFY COLUMN moderation_status ENUM('allow', 'filtered', 'declined') NOT NULL DEFAULT 'allow'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Set all 'declined' statuses to 'filtered' before removing the enum value
        DB::table('point_images')->where('moderation_status', 'declined')->update(['moderation_status' => 'filtered']);
        DB::table('points')->where('moderation_status', 'declined')->update(['moderation_status' => 'filtered']);
        
        // Remove 'declined' from enums
        DB::statement("ALTER TABLE point_images MODIFY COLUMN moderation_status ENUM('allow', 'filtered') NOT NULL DEFAULT 'allow'");
        DB::statement("ALTER TABLE points MODIFY COLUMN moderation_status ENUM('allow', 'filtered') NOT NULL DEFAULT 'allow'");
    }
};
