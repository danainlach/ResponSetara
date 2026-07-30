<?php

use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\AiPromptController;
use App\Http\Controllers\Admin\AssistanceTypeController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\ConditionController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\EmergencyContactController;
use App\Http\Controllers\Admin\HelperGuideController;
use App\Http\Controllers\Admin\QuickPhraseController;
use App\Http\Controllers\Admin\SiteContentController;
use App\Http\Controllers\Admin\StatisticController;
use App\Http\Controllers\AssistanceController;
use App\Http\Controllers\DeafController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\NonverbalController;
use Illuminate\Support\Facades\Route;

// Public UI Routes
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/bantuan-darurat', [AssistanceController::class, 'index'])->name('assistance.index');
Route::get('/assistance', [AssistanceController::class, 'index'])->name('assistance.en');
Route::get('/tidak-dapat-berbicara', [NonverbalController::class, 'index'])->name('nonverbal.index');
Route::get('/nonverbal', fn () => redirect()->route('nonverbal.index'))->name('nonverbal.alias');
Route::get('/tidak-dapat-mendengar', [DeafController::class, 'index'])->name('deaf.index');
Route::get('/deaf', fn () => redirect()->route('deaf.index'))->name('deaf.alias');

// Redirect default dashboard after login to Admin Dashboard
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Admin CMS & Audit Portal Routes
Route::prefix('admin')
    ->name('admin.')
    ->middleware(['auth', 'verified', 'admin'])
    ->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
        Route::get('/', fn () => redirect()->route('admin.dashboard'));

        // CMS CRUD & Restore endpoint for Categories
        Route::post('categories/{id}/restore', [CategoryController::class, 'restore'])->name('categories.restore');
        Route::resource('categories', CategoryController::class)->except(['create', 'show', 'edit']);

        // CMS CRUD & Restore for Emergency Conditions
        Route::post('conditions/{id}/restore', [ConditionController::class, 'restore'])->name('conditions.restore');
        Route::resource('conditions', ConditionController::class)->except(['create', 'show', 'edit']);

        // CMS CRUD & Restore for Assistance Types
        Route::post('assistance-types/{id}/restore', [AssistanceTypeController::class, 'restore'])->name('assistance-types.restore');
        Route::resource('assistance-types', AssistanceTypeController::class)->except(['create', 'show', 'edit']);

        // CMS CRUD & Restore for Quick Phrases
        Route::post('quick-phrases/{id}/restore', [QuickPhraseController::class, 'restore'])->name('quick-phrases.restore');
        Route::resource('quick-phrases', QuickPhraseController::class)->except(['create', 'show', 'edit']);

        // CMS CRUD & Restore for Helper Guides
        Route::post('helper-guides/{id}/restore', [HelperGuideController::class, 'restore'])->name('helper-guides.restore');
        Route::resource('helper-guides', HelperGuideController::class)->except(['create', 'show', 'edit']);

        // CMS CRUD & Restore for Emergency Contacts
        Route::post('emergency-contacts/{id}/restore', [EmergencyContactController::class, 'restore'])->name('emergency-contacts.restore');
        Route::resource('emergency-contacts', EmergencyContactController::class)->except(['create', 'show', 'edit']);

        // CMS CRUD for Site Contents (no soft delete)
        Route::resource('site-contents', SiteContentController::class)->except(['create', 'show', 'edit']);

        // CMS CRUD & Restore for AI Prompts
        Route::post('ai-prompts/{id}/restore', [AiPromptController::class, 'restore'])->name('ai-prompts.restore');
        Route::resource('ai-prompts', AiPromptController::class)->except(['create', 'show', 'edit']);

        // Read-Only Audit & Statistical Modules
        Route::get('statistics', [StatisticController::class, 'index'])->name('statistics.index');
        Route::get('activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs.index');
    });

require __DIR__.'/settings.php';
