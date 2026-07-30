<?php

declare(strict_types=1);

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AggregateStatistic extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_date',
        'event_type',
        'category_slug',
        'count',
    ];

    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'count' => 'integer',
        ];
    }

    public static function rules(): array
    {
        return [
            'event_date' => ['required', 'date'],
            'event_type' => ['required', 'string', 'max:60'],
            'category_slug' => ['nullable', 'string', 'max:140'],
            'count' => ['required', 'integer', 'min:0'],
        ];
    }
}
