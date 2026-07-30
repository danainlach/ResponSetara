<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Models\EmergencyCategory;
use Illuminate\Foundation\Http\FormRequest;

class CategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $category = $this->route('category') ?: $this->route('id');
        $id = is_object($category) ? $category->id : (is_numeric($category) ? (int) $category : null);

        return EmergencyCategory::rules($id);
    }
}
