<?php

declare(strict_types=1);

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;

class ComposeEmergencyMessageRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Public endpoint without login requirement
        return true;
    }

    public function rules(): array
    {
        return [
            'communication_mode' => ['required', 'string', 'in:assistance'],
            'category_id' => ['required', 'integer'],
            'condition_ids' => ['nullable', 'array', 'max:3'],
            'condition_ids.*' => ['integer'],
            'assistance_type_ids' => ['nullable', 'array', 'max:3'],
            'assistance_type_ids.*' => ['integer'],
            'location' => ['nullable', 'array'],
            'location.manual_text' => ['nullable', 'string', 'max:180'],
            'location.latitude' => ['nullable', 'numeric', 'between:-90,90'],
            'location.longitude' => ['nullable', 'numeric', 'between:-180,180'],
            'location.include_coordinates' => ['nullable', 'boolean'],
            'additional_information' => ['nullable', 'string', 'max:300'],
            'use_ai' => ['nullable', 'boolean'],
            'ai_consent' => ['nullable', 'boolean'],
        ];
    }

    public function messages(): array
    {
        return [
            'communication_mode.in' => 'Mode komunikasi harus bernilai assistance.',
            'condition_ids.max' => 'Pilih maksimal 3 kondisi untuk menjaga kejelasan pesan.',
            'assistance_type_ids.max' => 'Pilih maksimal 3 jenis bantuan yang dibutuhkan.',
            'location.manual_text.max' => 'Teks lokasi maksimal 180 karakter.',
            'additional_information.max' => 'Informasi tambahan maksimal 300 karakter.',
        ];
    }
}
