<?php

declare(strict_types=1);

namespace App\Http\Requests\Admin;

use App\Models\SiteContent;
use Illuminate\Foundation\Http\FormRequest;

class SiteContentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() && $this->user()->isAdmin();
    }

    public function rules(): array
    {
        $content = $this->route('site_content') ?: $this->route('id');
        $id = is_object($content) ? $content->id : (is_numeric($content) ? (int) $content : null);

        return SiteContent::rules($id);
    }

    protected function prepareForValidation(): void
    {
        // Prevent random or unauthorized HTML injection unless specifically marked as html content_type
        if ($this->input('content_type') !== 'html' && $this->has('value')) {
            $this->merge([
                'value' => strip_tags((string) $this->input('value')),
            ]);
        }
    }
}
