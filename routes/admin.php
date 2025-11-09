<?php

use App\Http\Controllers\Admin\EventsModerationController;
use App\Http\Controllers\Admin\QueueController;
use App\Http\Controllers\Admin\UsersController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Routes accessible by both admins and moderators
Route::middleware(['auth', 'verified', 'admin.or.moderator'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [UsersController::class, 'adminIndex'])->name('index');

    // Events moderation routes
    Route::prefix('events')->name('events.')->group(function () {
        Route::get('/stats', [EventsModerationController::class, 'stats'])->name('stats');
        Route::get('/', [EventsModerationController::class, 'index'])->name('index');
        Route::get('/event-types', [EventsModerationController::class, 'eventTypes'])->name('eventTypes');
        Route::get('/{point}', [EventsModerationController::class, 'show'])->name('show');
        Route::patch('/{point}/event-type', [EventsModerationController::class, 'updateEventType'])->name('updateEventType');
        Route::post('/{point}/approve', [EventsModerationController::class, 'approve'])->name('approve');
        Route::post('/{point}/decline', [EventsModerationController::class, 'decline'])->name('decline');
        Route::post('/{point}/images/{image}/clear-moderation', [EventsModerationController::class, 'clearImageModeration'])->name('clearImageModeration');
    });
});

// Routes accessible only by admins
Route::middleware(['auth', 'verified', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/users', [UsersController::class, 'index'])->name('users.index');
    Route::patch('/users/{user}/role', [UsersController::class, 'updateRole'])->name('users.updateRole');
    Route::patch('/users/{user}/profile', [UsersController::class, 'updateProfile'])->name('users.updateProfile');
    Route::patch('/users/{user}/password', [UsersController::class, 'setPassword'])->name('users.setPassword');
    Route::delete('/users/{user}', [UsersController::class, 'destroy'])->name('users.destroy');
    
    // Queue monitoring routes
    Route::prefix('queue')->name('queue.')->group(function () {
        Route::get('/stats', [QueueController::class, 'stats'])->name('stats');
        Route::get('/pending', [QueueController::class, 'pending'])->name('pending');
        Route::get('/failed', [QueueController::class, 'failed'])->name('failed');
        Route::post('/retry/{id}', [QueueController::class, 'retry'])->name('retry');
        Route::post('/retry-all', [QueueController::class, 'retryAll'])->name('retryAll');
        Route::delete('/failed/{id}', [QueueController::class, 'deleteFailed'])->name('deleteFailed');
        Route::post('/flush-failed', [QueueController::class, 'flushFailed'])->name('flushFailed');
    });
});

