<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\Api\V1\EmergencyCategoryResource;
use App\Http\Resources\Api\V1\EmergencyContactResource;
use App\Http\Resources\Api\V1\HelperGuideResource;
use App\Http\Resources\Api\V1\SiteConfigResource;
use App\Services\Api\PublicContentService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function __construct(
        private readonly PublicContentService $contentService
    ) {}

    public function index(Request $request): Response
    {
        try {
            $configs = SiteConfigResource::collection($this->contentService->getConfig())->resolve();
            $categories = EmergencyCategoryResource::collection($this->contentService->getCategories())->resolve();
            $helperGuides = HelperGuideResource::collection($this->contentService->getHelperGuides())->resolve();
            $emergencyContacts = EmergencyContactResource::collection($this->contentService->getEmergencyContacts())->resolve();
            $hasError = false;
        } catch (Exception $e) {
            Log::error('Gagal memuat data utama untuk landing page dari database.');
            $configs = [];
            $categories = [];
            $helperGuides = [];
            $emergencyContacts = [];
            $hasError = true;
        }

        return Inertia::render('public/home', [
            'configs' => $configs,
            'categories' => $categories,
            'helperGuides' => $helperGuides,
            'emergencyContacts' => $emergencyContacts,
            'hasError' => $hasError,
        ]);
    }
}
