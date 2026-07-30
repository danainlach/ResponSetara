<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminActivityLog;
use App\Models\AiPrompt;
use App\Models\AssistanceType;
use App\Models\EmergencyCategory;
use App\Models\EmergencyCondition;
use App\Models\EmergencyContact;
use App\Models\HelperGuide;
use App\Models\QuickPhrase;
use App\Models\SiteContent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

use Illuminate\Support\Facades\Cache;

class DashboardController extends Controller
{
    /**
     * Display the non-sensitive aggregate statistics summary and recent activity logs for admin.
     */
    public function index(Request $request): Response
    {
        $stats = Cache::remember('admin_dashboard_stats', 120, fn () => [
            'active_categories' => (int) EmergencyCategory::active()->count(),
            'active_conditions' => (int) EmergencyCondition::active()->count(),
            'active_assistance_types' => (int) AssistanceType::active()->count(),
            'active_phrases' => (int) QuickPhrase::active()->count(),
            'active_guides' => (int) HelperGuide::active()->count(),
            'verified_contacts' => (int) EmergencyContact::active()->verified()->count(),
            'inactive_contents' => (int) SiteContent::where('is_active', false)->count(),
            'active_ai_prompts' => (int) AiPrompt::active()->count(),
        ]);

        $recentLogs = AdminActivityLog::with('user:id,name,email')
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get();

        return Inertia::render('admin/dashboard/index', [
            'stats' => $stats,
            'recentLogs' => $recentLogs,
        ]);
    }
}
