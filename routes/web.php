<?php

use App\Http\Controllers\LocaleController;
use App\Http\Controllers\PointController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::post('/locale/switch', [LocaleController::class, 'switch'])->name('locale.switch');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    // Points CRUD routes
    Route::get('/api/points', [PointController::class, 'index'])->name('points.index');
    Route::post('/api/points', [PointController::class, 'store'])->name('points.store');
    Route::delete('/api/points/{point}', [PointController::class, 'destroy'])->name('points.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
