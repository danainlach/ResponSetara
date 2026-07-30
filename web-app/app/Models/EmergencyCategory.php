<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmergencyCategory extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'slug',
        'description',
        'color',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    public function conditions(): HasMany
    {
        return $this->hasMany(EmergencyCondition::class, 'category_id')->orderBy('sort_order');
    }

    public function assistanceTypes(): HasMany
    {
        return $this->hasMany(AssistanceType::class, 'category_id')->orderBy('sort_order');
    }

    public function quickPhrases(): HasMany
    {
        return $this->hasMany(QuickPhrase::class, 'category_id')->orderBy('sort_order');
    }

    public static function rules(?int $id = null): array
    {
        $uniqueSlug = $id ? "unique:emergency_categories,slug,{$id}" : 'unique:emergency_categories,slug';
        $uniqueCode = $id ? "unique:emergency_categories,code,{$id}" : 'unique:emergency_categories,code';

        return [
            'code' => ['required', 'string', 'max:80', $uniqueCode],
            'name' => ['required', 'string', 'max:120'],
            'slug' => ['required', 'string', 'max:140', $uniqueSlug],
            'description' => ['nullable', 'string'],
            'color' => ['nullable', 'string', 'max:20'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer'],
        ];
    }
}
