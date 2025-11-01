<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminAuthorizationTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_access_admin_panel(): void
    {
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);
        $this->actingAs($admin);

        $response = $this->get('/admin');

        $response->assertOk();
    }

    public function test_regular_user_cannot_access_admin_panel(): void
    {
        $user = User::factory()->create(['role' => UserRole::USER]);
        $this->actingAs($user);

        $response = $this->get('/admin');

        $response->assertForbidden();
    }

    public function test_guest_cannot_access_admin_panel(): void
    {
        $response = $this->get('/admin');

        $response->assertRedirect(route('login'));
    }

    public function test_admin_can_access_users_list(): void
    {
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);
        $this->actingAs($admin);

        $response = $this->get('/admin/users');

        $response->assertOk();
    }

    public function test_regular_user_cannot_access_users_list(): void
    {
        $user = User::factory()->create(['role' => UserRole::USER]);
        $this->actingAs($user);

        $response = $this->get('/admin/users');

        $response->assertForbidden();
    }
}

