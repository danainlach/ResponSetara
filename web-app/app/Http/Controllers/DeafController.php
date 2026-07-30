<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\Api\V1\HelperGuideResource;
use App\Services\Api\PublicContentService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class DeafController extends Controller
{
    public function __construct(
        private readonly PublicContentService $contentService
    ) {}

    public function index(Request $request): Response
    {
        try {
            $helperGuides = HelperGuideResource::collection($this->contentService->getHelperGuides('deaf'))->resolve();
            $hasError = false;
        } catch (Exception $e) {
            Log::error('Gagal memuat data utama panduan penolong untuk Mode Saya Tidak Dapat Mendengar dari database.');
            $helperGuides = [];
            $hasError = true;
        }

        return Inertia::render('public/deaf/index', [
            'initialHelperGuides' => $helperGuides,
            'hasError' => $hasError,
        ]);
    }
}
