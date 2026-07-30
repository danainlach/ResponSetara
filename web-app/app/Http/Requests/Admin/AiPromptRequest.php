<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Models\AiPrompt;
use Illuminate\Foundation\Http\FormRequest;

class AiPromptRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $prompt = $this->route('ai_prompt') ?: $this->route('id');
        $id = is_object($prompt) ? $prompt->id : (is_numeric($prompt) ? (int) $prompt : null);

        return AiPrompt::rules($id);
    }
}
