<?php

namespace Tests\Feature\Admin;

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function authenticateAsAdmin(): User
    {
        $admin = User::factory()->create(['role' => UserRole::ADMIN]);
        $this->actingAs($admin);
        return $admin;
    }

    public function test_admin_can_change_user_role(): void
    {
        $this->authenticateAsAdmin();
        $user = User::factory()->create(['role' => UserRole::USER]);

        $response = $this->patchJson("/admin/users/{$user->id}/role", [
            'role' => UserRole::ADMIN->value,
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'role' => UserRole::ADMIN->value,
        ]);
    }

    public function test_admin_can_update_user_profile(): void
    {
        $this->authenticateAsAdmin();
        $user = User::factory()->create();

        $response = $this->patchJson("/admin/users/{$user->id}/profile", [
            'name' => 'Updated Name',
            'email' => 'newemail@example.com',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $user->id,
            'name' => 'Updated Name',
            'email' => 'newemail@example.com',
        ]);
    }

    public function test_admin_can_set_user_password(): void
    {
        $this->authenticateAsAdmin();
        $user = User::factory()->create();

        $response = $this->patchJson("/admin/users/{$user->id}/password", [
            'password' => 'newpassword123',
        ]);

        $response->assertRedirect();
        
        // Verify password was changed
        $user->refresh();
        $this->assertTrue(
            \Hash::check('newpassword123', $user->password)
        );
    }

    public function test_admin_can_delete_user(): void
    {
        $this->authenticateAsAdmin();
        $user = User::factory()->create();

        $response = $this->deleteJson("/admin/users/{$user->id}");

        $response->assertRedirect();
        $this->assertDatabaseMissing('users', [
            'id' => $user->id,
        ]);
    }

    public function test_admin_cannot_delete_themselves(): void
    {
        $admin = $this->authenticateAsAdmin();

        $response = $this->deleteJson("/admin/users/{$admin->id}");

        $response->assertRedirect();
        $this->assertDatabaseHas('users', [
            'id' => $admin->id,
        ]);
    }

    public function test_regular_user_cannot_change_roles(): void
    {
        $user = User::factory()->create(['role' => UserRole::USER]);
        $this->actingAs($user);
        $targetUser = User::factory()->create();

        $response = $this->patchJson("/admin/users/{$targetUser->id}/role", [
            'role' => UserRole::ADMIN->value,
        ]);

        $response->assertForbidden();
    }

    public function test_regular_user_cannot_update_other_users(): void
    {
        $user = User::factory()->create(['role' => UserRole::USER]);
        $this->actingAs($user);
        $targetUser = User::factory()->create();

        $response = $this->patchJson("/admin/users/{$targetUser->id}/profile", [
            'name' => 'Hacked Name',
            'email' => 'hacked@example.com',
        ]);

        $response->assertForbidden();
    }

    public function test_regular_user_cannot_delete_users(): void
    {
        $user = User::factory()->create(['role' => UserRole::USER]);
        $this->actingAs($user);
        $targetUser = User::factory()->create();

        $response = $this->deleteJson("/admin/users/{$targetUser->id}");

        $response->assertForbidden();
        $this->assertDatabaseHas('users', [
            'id' => $targetUser->id,
        ]);
    }

    public function test_admin_cannot_update_user_with_duplicate_email(): void
    {
        $this->authenticateAsAdmin();
        $user1 = User::factory()->create(['email' => 'existing@example.com']);
        $user2 = User::factory()->create(['email' => 'user2@example.com']);

        $response = $this->patchJson("/admin/users/{$user2->id}/profile", [
            'name' => 'Test User',
            'email' => 'existing@example.com',
        ]);

        $response->assertStatus(422); // Validation error (JSON)
        $response->assertJsonValidationErrors('email');
    }

    public function test_admin_must_provide_valid_role(): void
    {
        $this->authenticateAsAdmin();
        $user = User::factory()->create();

        $response = $this->patchJson("/admin/users/{$user->id}/role", [
            'role' => 'invalid_role',
        ]);

        $response->assertStatus(422); // Validation error (JSON)
        $response->assertJsonValidationErrors('role');
    }
}

