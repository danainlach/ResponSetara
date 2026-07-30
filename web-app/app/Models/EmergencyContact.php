<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EmergencyContact extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'service_name',
        'number',
        'scope',
        'coverage_note',
        'source_name',
        'source_url',
        'last_verified_at',
        'is_verified',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'last_verified_at' => 'date',
            'is_verified' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    public function scopeVerified(Builder $query): Builder
    {
        return $query->where('is_verified', true);
    }

    public static function rules(): array
    {
        return [
            'service_name' => ['required', 'string', 'max:180'],
            'number' => ['required', 'string', 'max:40'],
            'scope' => ['required', 'string', 'max:180'],
            'coverage_note' => ['nullable', 'string'],
            'source_name' => ['nullable', 'string', 'max:180'],
            'source_url' => ['nullable', 'url'],
            'last_verified_at' => ['nullable', 'date'],
            'is_verified' => ['boolean'],
            'is_active' => ['boolean'],
            'sort_order' => ['integer'],
        ];
    }
}
