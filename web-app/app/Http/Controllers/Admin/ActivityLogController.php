<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminActivityLog;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    /**
     * Display read-only administrative activity audit trail.
     */
    public function index(Request $request): Response
    {
        $query = AdminActivityLog::with('user:id,name,email');

        if ($search = $request->input('search')) {
            $query->where('description', 'like', "%{$search}%")
                  ->orWhere('action', 'like', "%{$search}%")
                  ->orWhere('target_type', 'like', "%{$search}%");
        }

        $logs = $query->orderBy('created_at', 'desc')->paginate(30)->withQueryString();

        return Inertia::render('admin/activity-logs/index', [
            'logs' => $logs,
            'filters' => $request->only(['search']),
        ]);
    }
}
