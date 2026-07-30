<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AssistanceTypeRequest;
use App\Models\AssistanceType;
use App\Models\EmergencyCategory;
use App\Services\AdminActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AssistanceTypeController extends Controller
{
    public function index(Request $request): Response
    {
        $query = AssistanceType::with('category:id,name,color');

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

        $assistanceTypes = $query->orderBy('sort_order')->paginate(15)->withQueryString();
        $categories = EmergencyCategory::active()->select('id', 'name')->orderBy('sort_order')->get();

        return Inertia::render('admin/assistance-types/index', [
            'assistanceTypes' => $assistanceTypes,
            'categories' => $categories,
            'filters' => $request->only(['search', 'trashed']),
        ]);
    }

    public function store(AssistanceTypeRequest $request): RedirectResponse
    {
        $assistanceType = AssistanceType::create($request->validated());

        AdminActivityLogger::log(
            $request->user(),
            'CREATE',
            'AssistanceType',
            $assistanceType->id,
            "Membuat jenis bantuan baru: {$assistanceType->label}"
        );

        return redirect()->back()->with('success', 'Jenis bantuan berhasil dibuat.');
    }

    public function update(AssistanceTypeRequest $request, AssistanceType $assistanceType): RedirectResponse
    {
        $assistanceType->update($request->validated());

        AdminActivityLogger::log(
            $request->user(),
            'UPDATE',
            'AssistanceType',
            $assistanceType->id,
            "Memperbarui jenis bantuan: {$assistanceType->label}"
        );

        return redirect()->back()->with('success', 'Jenis bantuan berhasil diperbarui.');
    }

    public function destroy(Request $request, AssistanceType $assistanceType): RedirectResponse
    {
        $assistanceType->delete();

        AdminActivityLogger::log(
            $request->user(),
            'DELETE (SOFT)',
            'AssistanceType',
            $assistanceType->id,
            "Menghapus sementara jenis bantuan: {$assistanceType->label}"
        );

        return redirect()->back()->with('success', 'Jenis bantuan berhasil dihapus sementara.');
    }

    public function restore(Request $request, int $id): RedirectResponse
    {
        $assistanceType = AssistanceType::onlyTrashed()->findOrFail($id);
        $assistanceType->restore();

        AdminActivityLogger::log(
            $request->user(),
            'RESTORE',
            'AssistanceType',
            $assistanceType->id,
            "Memulihkan jenis bantuan: {$assistanceType->label}"
        );

        return redirect()->back()->with('success', 'Jenis bantuan berhasil dipulihkan.');
    }
}
