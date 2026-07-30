<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AggregateStatistic;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

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

        $statistics = $query->orderBy('event_date', 'desc')->paginate(25)->withQueryString();

        return Inertia::render('admin/statistics/index', [
            'statistics' => $statistics,
            'filters' => $request->only(['event_type', 'category_slug']),
        ]);
    }
}
