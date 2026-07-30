<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Models\EmergencyContact;
use Illuminate\Foundation\Http\FormRequest;

class EmergencyContactRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'service_name' => ['required', 'string', 'max:180'],
            'number' => ['required', 'string', 'max:40'],
            'scope' => ['required', 'string', 'max:180'],
            'coverage_note' => ['nullable', 'string', 'max:500'],
            'source_name' => ['nullable', 'string', 'max:180'],
            'source_url' => ['nullable', 'url', 'max:255'],
            'last_verified_at' => ['nullable', 'date'],
            'is_verified' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer'],
        ];
    }
}
