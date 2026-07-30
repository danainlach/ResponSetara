<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AggregateStatistic;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use App\Models\EmergencyCategory;

class StatisticController extends Controller
{
    /**
     * Display read-only aggregate statistics (no sensitive user data, messages, or locations).
     */
    public function index(Request $request): Response
    {
        $query = AggregateStatistic::query();

        if ($type = $request->input('event_type')) {
            $query->where('event_type', $type);
        }

        if ($slug = $request->input('category_slug')) {
            $query->where('category_slug', $slug);
        }

        if ($startDate = $request->input('start_date')) {
            $query->where('event_date', '>=', $startDate);
        }

        if ($endDate = $request->input('end_date')) {
            $query->where('event_date', '<=', $endDate);
        }

        $statistics = $query->orderBy('event_date', 'desc')
            ->paginate(25)
            ->withQueryString();

        return Inertia::render('admin/statistics/index', [
            'statistics' => $statistics,
            'filters' => $request->only(['event_type', 'category_slug', 'start_date', 'end_date']),
            'categories' => EmergencyCategory::select(['id', 'name', 'slug'])->get(),
            'summary' => [
                'total_opened' => (int) AggregateStatistic::whereIn('event_type', [
                    'assistance_mode_opened',
                    'nonverbal_mode_opened',
                    'deaf_mode_opened'
                ])->sum('count'),
                'total_template' => (int) AggregateStatistic::where('event_type', 'message_composed_template')->sum('count'),
                'total_ai' => (int) AggregateStatistic::where('event_type', 'message_composed_ai')->sum('count'),
                'total_fallback' => (int) AggregateStatistic::where('event_type', 'ai_fallback_used')->sum('count'),
                'total_today' => (int) AggregateStatistic::whereDate('event_date', now()->toDateString())->sum('count'),
            ],
        ]);
    }
}
