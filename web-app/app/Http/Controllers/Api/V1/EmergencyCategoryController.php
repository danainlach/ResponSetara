<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\EmergencyCategoryResource;
use App\Services\Api\PublicContentService;
use Illuminate\Http\JsonResponse;

class EmergencyCategoryController extends Controller
{
    use ApiResponseTrait;

    public function index(PublicContentService $service): JsonResponse
    {
        return $this->respondWithCollection(EmergencyCategoryResource::collection($service->getCategories()));
    }

    public function show(string $slug, PublicContentService $service): JsonResponse
    {
        $category = $service->getCategoryBySlug($slug);
        if (!$category) {
            return $this->respondNotFound();
        }

        return $this->respondWithResource(new EmergencyCategoryResource($category));
    }
}
