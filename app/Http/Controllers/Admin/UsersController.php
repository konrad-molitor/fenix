<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateUserPasswordRequest;
use App\Http\Requests\Admin\UpdateUserProfileRequest;
use App\Http\Requests\Admin\UpdateUserRoleRequest;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Inertia\Response;

class UsersController extends Controller
{
    /**
     * Display admin panel with tabs (main page).
     */
    public function adminIndex(): Response
    {
        $users = User::query()
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'created_at' => $user->created_at->format('Y-m-d H:i'),
                'email_verified_at' => $user->email_verified_at?->format('Y-m-d H:i'),
            ]);

        return Inertia::render('admin/index', [
            'users' => $users,
            'availableRoles' => array_map(fn ($role) => $role->value, UserRole::cases()),
        ]);
    }

    /**
     * Display a listing of users.
     */
    public function index(): Response
    {
        $users = User::query()
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->through(fn ($user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role->value,
                'created_at' => $user->created_at->format('Y-m-d H:i'),
                'email_verified_at' => $user->email_verified_at?->format('Y-m-d H:i'),
            ]);

        return Inertia::render('admin/users', [
            'users' => $users,
            'availableRoles' => array_map(fn ($role) => $role->value, UserRole::cases()),
        ]);
    }

    /**
     * Update user role.
     */
    public function updateRole(UpdateUserRoleRequest $request, User $user): RedirectResponse
    {
        $user->update(['role' => $request->validated()['role']]);

        return back()->with('success', __('admin.users.role_updated'));
    }

    /**
     * Update user profile (name and email).
     */
    public function updateProfile(UpdateUserProfileRequest $request, User $user): RedirectResponse
    {
        $user->update($request->validated());

        return back()->with('success', __('admin.users.profile_updated'));
    }

    /**
     * Set user password.
     */
    public function setPassword(UpdateUserPasswordRequest $request, User $user): RedirectResponse
    {
        $user->update([
            'password' => Hash::make($request->validated()['password']),
        ]);

        return back()->with('success', __('admin.users.password_updated'));
    }

    /**
     * Delete user.
     */
    public function destroy(User $user): RedirectResponse
    {
        // Prevent deleting yourself
        if ($user->id === auth()->id()) {
            return back()->withErrors(['error' => __('admin.users.cannot_delete_self')]);
        }

        $user->delete();

        return back()->with('success', __('admin.users.user_deleted'));
    }
}

