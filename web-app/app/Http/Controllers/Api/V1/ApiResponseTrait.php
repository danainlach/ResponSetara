<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;

trait ApiResponseTrait
{
    protected function respondWithCollection(mixed $resourceCollection): JsonResponse
    {
        $data = $resourceCollection instanceof JsonResource ? $resourceCollection->resolve() : $resourceCollection;

        return response()->json([
            'success' => true,
            'data' => $data,
            'meta' => [
                'version' => 'v1',
                'count' => is_array($data) ? count($data) : ($data->count() ?? 0),
            ],
        ], 200);
    }

    protected function respondWithResource(mixed $resource): JsonResponse
    {
        $data = $resource instanceof JsonResource ? $resource->resolve() : $resource;

        return response()->json([
            'success' => true,
            'data' => $data,
            'meta' => [
                'version' => 'v1',
            ],
        ], 200);
    }

    protected function respondNotFound(string $message = 'Data tidak ditemukan.'): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
        ], 404);
    }
}
