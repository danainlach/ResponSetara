<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\Api\V1\AssistanceTypeResource;
use App\Http\Resources\Api\V1\EmergencyCategoryResource;
use App\Http\Resources\Api\V1\EmergencyConditionResource;
use App\Services\Api\PublicContentService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\AggregateStatisticRecorder;
use Inertia\Inertia;
use Inertia\Response;

class AssistanceController extends Controller
{
    public function __construct(
        private readonly PublicContentService $contentService
    ) {}

    public function index(Request $request): Response
    {
        // Record aggregate statistics for assistance mode open
        AggregateStatisticRecorder::record('assistance_mode_opened');

        try {
            $categories = EmergencyCategoryResource::collection($this->contentService->getCategories())->resolve();
            $conditions = EmergencyConditionResource::collection($this->contentService->getAllConditions())->resolve();
            $assistanceTypes = AssistanceTypeResource::collection($this->contentService->getAllAssistanceTypes())->resolve();
            $hasError = false;
        } catch (Exception $e) {
            Log::error('Gagal memuat data utama untuk Mode Saya Butuh Bantuan dari database.');
            $categories = [];
            $conditions = [];
            $assistanceTypes = [];
            $hasError = true;
        }

        return Inertia::render('public/assistance/index', [
            'initialCategories' => $categories,
            'initialConditions' => $conditions,
            'initialAssistanceTypes' => $assistanceTypes,
            'hasError' => $hasError,
        ]);
    }
}
