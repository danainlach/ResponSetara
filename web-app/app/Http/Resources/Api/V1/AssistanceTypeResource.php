<?php

declare(strict_types=1);

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AssistanceTypeResource extends JsonResource
{
    /**
     * Transform the resource into an array.

     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'category_id' => $this->category_id,
            'code' => $this->code,
            'label' => $this->label,
            'description' => $this->description,
            'template_fragment' => $this->template_fragment,
            'sort_order' => $this->sort_order,
        ];
    }
}
