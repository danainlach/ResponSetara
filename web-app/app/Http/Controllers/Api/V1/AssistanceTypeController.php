<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\AssistanceTypeResource;
use App\Services\Api\PublicContentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AssistanceTypeController extends Controller
{
    use ApiResponseTrait;

    public function index(Request $request, PublicContentService $service): JsonResponse
    {
        $validated = $request->validate([
            'category_id' => ['nullable', 'integer'],
        ]);

        $categoryId = isset($validated['category_id']) ? (int) $validated['category_id'] : null;

        return $this->respondWithCollection(AssistanceTypeResource::collection($service->getAssistanceTypes($categoryId)));
    }
}
