<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Modify ENUM to include 'moderator' role
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('user', 'moderator', 'admin') NOT NULL DEFAULT 'user'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // First, update any moderator roles to user
        DB::table('users')->where('role', 'moderator')->update(['role' => 'user']);
        
        // Then revert ENUM to original values
        DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('user', 'admin') NOT NULL DEFAULT 'user'");
    }
};
