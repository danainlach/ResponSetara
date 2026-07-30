<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\ConditionRequest;
use App\Models\EmergencyCategory;
use App\Models\EmergencyCondition;
use App\Services\AdminActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ConditionController extends Controller
{
    public function index(Request $request): Response
    {
        $query = EmergencyCondition::with('category:id,name,color');

        if ($request->boolean('trashed')) {
            $query->onlyTrashed();
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('label', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('template_fragment', 'like', "%{$search}%");
            });
        }

        $conditions = $query->orderBy('sort_order')->paginate(15)->withQueryString();
        $categories = EmergencyCategory::active()->select('id', 'name')->orderBy('sort_order')->get();

        return Inertia::render('admin/conditions/index', [
            'conditions' => $conditions,
            'categories' => $categories,
            'filters' => $request->only(['search', 'trashed']),
        ]);
    }

    public function store(ConditionRequest $request): RedirectResponse
    {
        $condition = EmergencyCondition::create($request->validated());

        AdminActivityLogger::log(
            $request->user(),
            'CREATE',
            'EmergencyCondition',
            $condition->id,
            "Membuat kondisi darurat baru: {$condition->label}"
        );

        return redirect()->back()->with('success', 'Kondisi darurat berhasil dibuat.');
    }

    public function update(ConditionRequest $request, EmergencyCondition $condition): RedirectResponse
    {
        $condition->update($request->validated());

        AdminActivityLogger::log(
            $request->user(),
            'UPDATE',
            'EmergencyCondition',
            $condition->id,
            "Memperbarui kondisi darurat: {$condition->label}"
        );

        return redirect()->back()->with('success', 'Kondisi darurat berhasil diperbarui.');
    }

    public function destroy(Request $request, EmergencyCondition $condition): RedirectResponse
    {
        $condition->delete();

        AdminActivityLogger::log(
            $request->user(),
            'DELETE (SOFT)',
            'EmergencyCondition',
            $condition->id,
            "Menghapus sementara kondisi darurat: {$condition->label}"
        );

        return redirect()->back()->with('success', 'Kondisi darurat berhasil dihapus sementara.');
    }

    public function restore(Request $request, int $id): RedirectResponse
    {
        $condition = EmergencyCondition::onlyTrashed()->findOrFail($id);
        $condition->restore();

        AdminActivityLogger::log(
            $request->user(),
            'RESTORE',
            'EmergencyCondition',
            $condition->id,
            "Memulihkan kondisi darurat: {$condition->label}"
        );

        return redirect()->back()->with('success', 'Kondisi darurat berhasil dipulihkan.');
    }
}
