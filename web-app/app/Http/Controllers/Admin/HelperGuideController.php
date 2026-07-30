<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\GuideAudience;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\HelperGuideRequest;
use App\Models\HelperGuide;
use App\Services\AdminActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class HelperGuideController extends Controller
{
    public function index(Request $request): Response
    {
        $query = HelperGuide::query();

        if ($request->boolean('trashed')) {
            $query->onlyTrashed();
        }

        if ($audience = $request->input('audience')) {
            $query->where('audience', $audience);
        }

        if ($search = $request->input('search')) {
            $query->where('title', 'like', "%{$search}%")
                  ->orWhere('body', 'like', "%{$search}%");
        }

        $guides = $query->orderBy('sort_order')->paginate(15)->withQueryString();
        $audiences = array_map(fn($a) => ['value' => $a->value, 'label' => $a->label()], GuideAudience::cases());

        return Inertia::render('admin/helper-guides/index', [
            'guides' => $guides,
            'audiences' => $audiences,
            'filters' => $request->only(['search', 'audience', 'trashed']),
        ]);
    }

    public function store(HelperGuideRequest $request): RedirectResponse
    {
        $guide = HelperGuide::create($request->validated());

        AdminActivityLogger::log(
            $request->user(),
            'CREATE',
            'HelperGuide',
            $guide->id,
            "Membuat panduan penolong baru ({$guide->audience->value}): {$guide->title}"
        );

        return redirect()->back()->with('success', 'Panduan penolong berhasil dibuat.');
    }

    public function update(HelperGuideRequest $request, HelperGuide $helperGuide): RedirectResponse
    {
        $helperGuide->update($request->validated());

        AdminActivityLogger::log(
            $request->user(),
            'UPDATE',
            'HelperGuide',
            $helperGuide->id,
            "Memperbarui panduan penolong: {$helperGuide->title}"
        );

        return redirect()->back()->with('success', 'Panduan penolong berhasil diperbarui.');
    }

    public function destroy(Request $request, HelperGuide $helperGuide): RedirectResponse
    {
        $helperGuide->delete();

        AdminActivityLogger::log(
            $request->user(),
            'DELETE (SOFT)',
            'HelperGuide',
            $helperGuide->id,
            "Menghapus sementara panduan penolong: {$helperGuide->title}"
        );

        return redirect()->back()->with('success', 'Panduan penolong berhasil dihapus sementara.');
    }

    public function restore(Request $request, int $id): RedirectResponse
    {
        $helperGuide = HelperGuide::onlyTrashed()->findOrFail($id);
        $helperGuide->restore();

        AdminActivityLogger::log(
            $request->user(),
            'RESTORE',
            'HelperGuide',
            $helperGuide->id,
            "Memulihkan panduan penolong: {$helperGuide->title}"
        );

        return redirect()->back()->with('success', 'Panduan penolong berhasil dipulihkan.');
    }
}
