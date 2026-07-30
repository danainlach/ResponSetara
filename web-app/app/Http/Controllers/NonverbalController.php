<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Resources\Api\V1\EmergencyCategoryResource;
use App\Http\Resources\Api\V1\QuickPhraseResource;
use App\Services\Api\PublicContentService;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class NonverbalController extends Controller
{
    public function __construct(
        private readonly PublicContentService $contentService
    ) {}

    public function index(Request $request): Response
    {
        try {
            $categories = EmergencyCategoryResource::collection($this->contentService->getCategories())->resolve();
            $phrases = QuickPhraseResource::collection($this->contentService->getQuickPhrases('nonverbal'))->resolve();
            $hasError = false;
        } catch (Exception $e) {
            Log::error('Gagal memuat data utama untuk Mode Saya Tidak Dapat Berbicara dari database.');
            $categories = [];
            $phrases = [];
            $hasError = true;
        }

        return Inertia::render('public/nonverbal/index', [
            'initialCategories' => $categories,
            'initialPhrases' => $phrases,
            'hasError' => $hasError,
        ]);
    }
}
