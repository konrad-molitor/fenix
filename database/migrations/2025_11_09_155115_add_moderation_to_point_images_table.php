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
            $table->enum('moderation_status', ['allow', 'filtered'])->default('allow')->after('description');
            $table->text('moderation_reason')->nullable()->after('moderation_status');
            $table->index('moderation_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('point_images', function (Blueprint $table) {
            $table->dropIndex(['moderation_status']);
            $table->dropColumn(['moderation_status', 'moderation_reason']);
        });
    }
};
