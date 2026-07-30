<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\ComposeEmergencyMessageRequest;
use App\Services\Api\EmergencyMessageTemplateService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class ComposeEmergencyMessageController extends Controller
{
    public function __construct(
        private readonly EmergencyMessageTemplateService $templateService
    ) {}

    public function __invoke(ComposeEmergencyMessageRequest $request): JsonResponse
    {
        // Execute composition deterministically in memory without DB persistence or payload logging
        $result = $this->templateService->compose($request->validated());

        return response()->json([
            'success' => true,
            'data' => $result,
            'meta' => [
                'version' => 'v1',
                'request_id' => (string) Str::uuid(),
            ],
        ], 200);
    }
}
