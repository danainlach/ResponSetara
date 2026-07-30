<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Enums\CommunicationMode;
use App\Enums\PhrasePriority;
use App\Models\QuickPhrase;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class QuickPhraseRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        return [
            'category_id' => ['nullable', 'integer', 'exists:emergency_categories,id'],
            'mode' => ['required', new Enum(CommunicationMode::class)],
            'phrase_text' => ['required', 'string', 'max:180'],
            'speech_text' => ['required', 'string', 'max:180'],
            'simplified_text' => ['required', 'string', 'max:180'],
            'priority' => ['required', new Enum(PhrasePriority::class)],
            'is_active' => ['boolean'],
            'sort_order' => ['integer'],
        ];
    }
}
