<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\Api\V1\EmergencyContactResource;
use App\Services\Api\PublicContentService;
use App\Services\AggregateStatisticRecorder;
use Illuminate\Http\JsonResponse;

class EmergencyContactController extends Controller
{
    use ApiResponseTrait;

    public function index(PublicContentService $service): JsonResponse
    {
        // Record aggregate statistics for emergency contacts viewed
        AggregateStatisticRecorder::record('emergency_contacts_viewed');

        return $this->respondWithCollection(EmergencyContactResource::collection($service->getEmergencyContacts()));
    }
}
