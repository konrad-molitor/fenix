<?php

use App\Http\Controllers\EventTypeController;
use Illuminate\Support\Facades\Route;

// Event Types - Read access for all authenticated users
Route::middleware(['auth', 'verified'])->prefix('api')->group(function () {
    // List all event types with filters
    Route::get('/event-types', [EventTypeController::class, 'index'])->name('event-types.index');
    
    // Autocomplete search (minimum 3 characters)
    Route::get('/event-types/autocomplete', [EventTypeController::class, 'autocomplete'])->name('event-types.autocomplete');
    
    // Show single event type
    Route::get('/event-types/{eventType}', [EventTypeController::class, 'show'])->name('event-types.show');
    
    // Admin only: Create, Update, Delete, AI Generate
    Route::middleware(['admin'])->group(function () {
        Route::post('/event-types', [EventTypeController::class, 'store'])->name('event-types.store');
        Route::put('/event-types/{eventType}', [EventTypeController::class, 'update'])->name('event-types.update');
        Route::patch('/event-types/{eventType}', [EventTypeController::class, 'update'])->name('event-types.patch');
        Route::delete('/event-types/{eventType}', [EventTypeController::class, 'destroy'])->name('event-types.destroy');
        Route::post('/event-types/generate', [EventTypeController::class, 'generateWithAI'])->name('event-types.generate');
    });
});

