<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Models\AssistanceType;
use Illuminate\Foundation\Http\FormRequest;

class AssistanceTypeRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $assistanceType = $this->route('assistance_type') ?: $this->route('id');
        $id = is_object($assistanceType) ? $assistanceType->id : (is_numeric($assistanceType) ? (int) $assistanceType : null);

        return AssistanceType::rules($id);
    }
}
