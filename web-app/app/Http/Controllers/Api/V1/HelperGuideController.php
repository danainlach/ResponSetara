<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\HelperGuideResource;
use App\Services\Api\PublicContentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HelperGuideController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request, PublicContentService $service): JsonResponse
    {
        $validated = $request->validate([
            'audience' => ['nullable', 'string', 'in:general,nonverbal,deaf'],
        ]);

        $audience = $validated['audience'] ?? null;

        return $this->respondWithCollection(HelperGuideResource::collection($service->getHelperGuides($audience)));
    }
}
