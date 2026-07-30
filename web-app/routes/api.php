<?php

use App\Http\Controllers\Api\V1\AssistanceTypeController;
use App\Http\Controllers\Api\V1\EmergencyCategoryController;
use App\Http\Controllers\Api\V1\EmergencyConditionController;
use App\Http\Controllers\Api\V1\EmergencyContactController;
use App\Http\Controllers\Api\V1\HelperGuideController;
use App\Http\Controllers\Api\V1\QuickPhraseController;
use App\Http\Controllers\Api\V1\SiteConfigController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->middleware('throttle:60,1')->group(function () {
    Route::get('/config', [SiteConfigController::class, 'index'])->name('api.v1.config');
    Route::get('/categories', [EmergencyCategoryController::class, 'index'])->name('api.v1.categories');
    Route::get('/categories/{slug}', [EmergencyCategoryController::class, 'show'])->name('api.v1.categories.show');
    Route::get('/conditions', [EmergencyConditionController::class, 'index'])->name('api.v1.conditions');
    Route::get('/assistance-types', [AssistanceTypeController::class, 'index'])->name('api.v1.assistance-types');
    Route::get('/quick-phrases', [QuickPhraseController::class, 'index'])->name('api.v1.quick-phrases');
    Route::get('/helper-guides', [HelperGuideController::class, 'index'])->name('api.v1.helper-guides');
    Route::get('/emergency-contacts', [EmergencyContactController::class, 'index'])->name('api.v1.emergency-contacts');
    Route::post('/compose-message', \App\Http\Controllers\Api\V1\ComposeEmergencyMessageController::class)->name('api.v1.compose-message');
});
