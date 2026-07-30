<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\QuickPhraseResource;
use App\Services\Api\PublicContentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class QuickPhraseController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request, PublicContentService $service): JsonResponse
    {
        $validated = $request->validate([
            'mode' => ['nullable', 'string', 'in:general,nonverbal,deaf'],
            'category_id' => ['nullable', 'integer'],
            'search' => ['nullable', 'string', 'max:100', 'regex:/^[a-zA-Z0-9\s.,?\-_]*$/'],
        ]);

        $mode = $validated['mode'] ?? null;
        $categoryId = isset($validated['category_id']) ? (int) $validated['category_id'] : null;
        $search = $validated['search'] ?? null;

        return $this->respondWithCollection(QuickPhraseResource::collection($service->getQuickPhrases($mode, $categoryId, $search)));
    }
}
