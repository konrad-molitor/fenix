<?php

namespace App\Providers;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->bootstrapAdminUser();
    }

    /**
     * Bootstrap admin user from ADMIN_EMAIL environment variable.
     * If user exists and is not admin yet, promote them to admin.
     */
    protected function bootstrapAdminUser(): void
    {
        $adminEmail = config('app.admin_email');

        if (!$adminEmail) {
            return;
        }

        try {
            $user = User::where('email', $adminEmail)->first();

            if (!$user) {
                return;
            }

            if ($user->isAdmin()) {
                return;
            }

            $user->promoteToAdmin();
            Log::info("Bootstrap admin: user {$adminEmail} promoted to admin");
        } catch (\Exception $e) {
            // Fail silently during bootstrap to not break app startup
            Log::error("Bootstrap admin failed: {$e->getMessage()}");
        }
    }
}
