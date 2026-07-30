<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\CategoryRequest;
use App\Models\EmergencyCategory;
use App\Services\AdminActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CategoryController extends Controller
{
    public function index(Request $request): Response
    {
        $query = EmergencyCategory::query();

        if ($request->boolean('trashed')) {
            $query->onlyTrashed();
        }

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }

        $categories = $query->orderBy('sort_order')->paginate(15)->withQueryString();

        return Inertia::render('admin/categories/index', [
            'categories' => $categories,
            'filters' => $request->only(['search', 'trashed']),
        ]);
    }

    public function store(CategoryRequest $request): RedirectResponse
    {
        $category = EmergencyCategory::create($request->validated());

        AdminActivityLogger::log(
            $request->user(),
            'CREATE',
            'EmergencyCategory',
            $category->id,
            "Membuat kategori darurat baru: {$category->name}"
        );

        return redirect()->back()->with('success', 'Kategori darurat berhasil dibuat.');
    }

    public function update(CategoryRequest $request, EmergencyCategory $category): RedirectResponse
    {
        $category->update($request->validated());

        AdminActivityLogger::log(
            $request->user(),
            'UPDATE',
            'EmergencyCategory',
            $category->id,
            "Memperbarui kategori darurat: {$category->name} (Status Aktif: " . ($category->is_active ? 'Ya' : 'Tidak') . ')'
        );

        return redirect()->back()->with('success', 'Kategori darurat berhasil diperbarui.');
    }

    public function destroy(Request $request, EmergencyCategory $category): RedirectResponse
    {
        // Safe soft delete only as per PRD
        $category->delete();

        AdminActivityLogger::log(
            $request->user(),
            'DELETE (SOFT)',
            'EmergencyCategory',
            $category->id,
            "Menghapus sementara kategori darurat: {$category->name}"
        );

        return redirect()->back()->with('success', 'Kategori darurat berhasil dihapus sementara.');
    }

    public function restore(Request $request, int $id): RedirectResponse
    {
        $category = EmergencyCategory::onlyTrashed()->findOrFail($id);
        $category->restore();

        AdminActivityLogger::log(
            $request->user(),
            'RESTORE',
            'EmergencyCategory',
            $category->id,
            "Memulihkan kategori darurat: {$category->name}"
        );

        return redirect()->back()->with('success', 'Kategori darurat berhasil dipulihkan.');
    }
}
