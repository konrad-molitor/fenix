<?php

use App\Http\Controllers\LocaleController;
use App\Http\Controllers\PointController;
use App\Http\Controllers\PointImageController;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

RateLimiter::for('upload', function (Request $request) {
    return [
        Limit::perMinute(3)->by($request->user()?->id ?: $request->ip()),
        Limit::perHour(20)->by($request->ip()),
    ];
});

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::post('/locale/switch', [LocaleController::class, 'switch'])->name('locale.switch');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
    
    Route::get('/api/points', [PointController::class, 'index'])->name('points.index');
    Route::get('/api/points/list-view', [PointController::class, 'listView'])->name('points.list-view');
    Route::post('/api/points', [PointController::class, 'store'])->name('points.store');
    Route::delete('/api/points/{point}', [PointController::class, 'destroy'])->name('points.destroy');
    
    Route::get('/api/points/{point}/images', [PointImageController::class, 'index'])->name('points.images.index');
    Route::post('/api/points/{point}/images', [PointImageController::class, 'store'])
        ->middleware(['throttle:upload', 'storage.limit'])
        ->name('points.images.store');
    Route::delete('/api/points/{point}/images/{image}', [PointImageController::class, 'destroy'])->name('points.images.destroy');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
