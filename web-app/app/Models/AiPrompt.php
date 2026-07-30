<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AiPrompt extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'version_name',
        'system_prompt',
        'is_active',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    public static function rules(?int $id = null): array
    {
        $uniqueVersion = $id ? "unique:ai_prompts,version_name,{$id}" : 'unique:ai_prompts,version_name';

        return [
            'version_name' => ['required', 'string', 'max:100', $uniqueVersion],
            'system_prompt' => ['required', 'string'],
            'is_active' => ['boolean'],
            'notes' => ['nullable', 'string'],
        ];
    }
}
