<?php

use App\Http\Controllers\Admin\UsersController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [UsersController::class, 'adminIndex'])->name('index');

    Route::get('/users', [UsersController::class, 'index'])->name('users.index');
    Route::patch('/users/{user}/role', [UsersController::class, 'updateRole'])->name('users.updateRole');
    Route::patch('/users/{user}/profile', [UsersController::class, 'updateProfile'])->name('users.updateProfile');
    Route::patch('/users/{user}/password', [UsersController::class, 'setPassword'])->name('users.setPassword');
    Route::delete('/users/{user}', [UsersController::class, 'destroy'])->name('users.destroy');
});

