<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\GuideAudience;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Validation\Rules\Enum;

class HelperGuide extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'title',
        'body',
        'audience',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'audience' => GuideAudience::class,
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    public static function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:180'],
            'body' => ['required', 'string'],
            'audience' => ['required', new Enum(GuideAudience::class)],
            'is_active' => ['boolean'],
            'sort_order' => ['integer'],
        ];
    }
}
