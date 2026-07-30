<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Models\EmergencyCondition;
use Illuminate\Foundation\Http\FormRequest;

class ConditionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $condition = $this->route('condition') ?: $this->route('id');
        $id = is_object($condition) ? $condition->id : (is_numeric($condition) ? (int) $condition : null);

        $rules = EmergencyCondition::rules($id);
        $rules['template_fragment'] = ['required', 'string', 'max:250']; // Ensure concise without harmful tags

        return $rules;
    }
}
