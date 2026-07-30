<?php

declare(strict_types=1);

namespace App\Models;

use App\Enums\CommunicationMode;
use App\Enums\PhrasePriority;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Validation\Rules\Enum;

class QuickPhrase extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id',
        'mode',
        'phrase_text',
        'speech_text',
        'simplified_text',
        'priority',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'category_id' => 'integer',
            'mode' => CommunicationMode::class,
            'priority' => PhrasePriority::class,
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true)->orderBy('sort_order');
    }

    public function scopeForMode(Builder $query, CommunicationMode $mode): Builder
    {
        return $query->where('mode', $mode->value);
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(EmergencyCategory::class, 'category_id');
    }

    public static function rules(): array
    {
        return [
            'category_id' => ['nullable', 'integer', 'exists:emergency_categories,id'],
            'mode' => ['required', new Enum(CommunicationMode::class)],
            'phrase_text' => ['required', 'string'],
            'speech_text' => ['nullable', 'string'],
            'simplified_text' => ['nullable', 'string'],
            'priority' => ['required', new Enum(PhrasePriority::class)],
            'is_active' => ['boolean'],
            'sort_order' => ['integer'],
        ];
    }
}
