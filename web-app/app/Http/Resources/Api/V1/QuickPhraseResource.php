<?php

declare(strict_types=1);

namespace App\Http\Resources\Api\V1;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use UnitEnum;

class QuickPhraseResource extends JsonResource
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
            'mode' => $this->mode instanceof UnitEnum ? $this->mode->value : $this->mode,
            'phrase_text' => $this->phrase_text,
            'speech_text' => $this->speech_text,
            'simplified_text' => $this->simplified_text,
            'priority' => $this->priority instanceof UnitEnum ? $this->priority->value : $this->priority,
            'sort_order' => $this->sort_order,
        ];
    }
}
