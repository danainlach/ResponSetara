<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\AggregateStatistic;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AggregateStatisticRecorder
{
    private const ALLOWED_EVENTS = [
        'assistance_mode_opened',
        'nonverbal_mode_opened',
        'deaf_mode_opened',
        'message_composed_template',
        'message_composed_ai',
        'ai_fallback_used',
        'emergency_contacts_viewed',
    ];

    /**
     * Records an event occurrence safely and anonymously in daily aggregates.
     *
     * @param string $eventType
     * @param string|null $categorySlug
     * @return void
     */
    public static function record(string $eventType, ?string $categorySlug = null): void
    {
        try {
            // 1. Verify event type is within allowlist
            if (!in_array($eventType, self::ALLOWED_EVENTS, true)) {
                return;
            }

            // 2. Ignore prefetch requests from Inertia
            if (request()->hasHeader('X-Inertia-Prefetch')) {
                return;
            }

            // 3. Prevent logging during tests if desired, or let it write to SQLite test DB
            $date = now()->toDateString();

            DB::transaction(function () use ($date, $eventType, $categorySlug) {
                // Find existing row using lock for concurrent safety
                $stat = AggregateStatistic::whereDate('event_date', $date)
                    ->where('event_type', $eventType)
                    ->where(function ($query) use ($categorySlug) {
                        if ($categorySlug === null) {
                            $query->whereNull('category_slug');
                        } else {
                            $query->where('category_slug', $categorySlug);
                        }
                    })
                    ->lockForUpdate()
                    ->first();

                if ($stat) {
                    $stat->increment('count');
                } else {
                    try {
                        AggregateStatistic::create([
                            'event_date' => $date,
                            'event_type' => $eventType,
                            'category_slug' => $categorySlug,
                            'count' => 1,
                        ]);
                    } catch (\Throwable $e) {
                        // In case of a concurrent race condition leading to unique constraint violation,
                        // retry query and increment.
                        $retryStat = AggregateStatistic::whereDate('event_date', $date)
                            ->where('event_type', $eventType)
                            ->where(function ($query) use ($categorySlug) {
                                if ($categorySlug === null) {
                                    $query->whereNull('category_slug');
                                } else {
                                    $query->where('category_slug', $categorySlug);
                                }
                            })
                            ->lockForUpdate()
                            ->first();

                        if ($retryStat) {
                            $retryStat->increment('count');
                        }
                    }
                }
            });
        } catch (\Throwable $e) {
            // Fail-safe: log warning internally but do NOT throw error to preserve main user flow
            Log::warning('Failed to record aggregate statistic: ' . $e->getMessage());
        }
    }
}
