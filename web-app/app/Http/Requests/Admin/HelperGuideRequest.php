<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\GuideAudience;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class HelperGuideRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:180'],
            'body' => ['required', 'string', 'max:5000'],
            'audience' => ['required', new Enum(GuideAudience::class)],
            'is_active' => ['boolean'],
            'sort_order' => ['integer'],
        ];
    }
}
