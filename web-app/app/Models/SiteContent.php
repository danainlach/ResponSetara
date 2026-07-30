<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SiteContent extends Model
{
    use HasFactory;

    protected $fillable = [
        'key',
        'value',
        'content_type',
        'is_active',
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
        $uniqueKey = $id ? "unique:site_contents,key,{$id}" : 'unique:site_contents,key';

        return [
            'key' => ['required', 'string', 'max:180', $uniqueKey],
            'value' => ['required', 'string'],
            'content_type' => ['required', 'string', 'max:30'],
            'is_active' => ['boolean'],
        ];
    }
}
