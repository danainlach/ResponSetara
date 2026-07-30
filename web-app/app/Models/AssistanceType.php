<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class AssistanceType extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'code',
        'label',
        'description',
        'template_fragment',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'category_id' => 'integer',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(EmergencyCategory::class, 'category_id');
    }

    public static function rules(?int $id = null): array
    {
        $uniqueCode = $id ? "unique:assistance_types,code,{$id}" : 'unique:assistance_types,code';

        return [
            'category_id' => ['nullable', 'integer', 'exists:emergency_categories,id'],
            'code' => ['required', 'string', 'max:120', $uniqueCode],
            'label' => ['required', 'string', 'max:180'],
            'description' => ['nullable', 'string'],
            'template_fragment' => ['required', 'string'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer'],
        ];
    }
}
