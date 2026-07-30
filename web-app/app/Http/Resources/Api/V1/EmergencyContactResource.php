<?php

declare(strict_types=1);

namespace App\Http\Resources\Api\V1;

use DateTimeInterface;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmergencyContactResource extends JsonResource
{
    /**
     * Transform the resource into an array.

     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'service_name' => $this->service_name,
            'number' => $this->number,
            'scope' => $this->scope,
            'coverage_note' => $this->coverage_note,
            'source_name' => $this->source_name,
            'source_url' => $this->source_url,
            'last_verified_at' => $this->last_verified_at instanceof DateTimeInterface
                ? $this->last_verified_at->format('Y-m-d')
                : $this->last_verified_at,
            'sort_order' => $this->sort_order,
        ];
    }
}
