<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\AiPromptRequest;
use App\Models\AiPrompt;
use App\Services\AdminActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class AiPromptController extends Controller
{
    public function index(Request $request): Response
    {
        $query = AiPrompt::query();

        if ($request->boolean('trashed')) {
            $query->onlyTrashed();
        }

        if ($search = $request->input('search')) {
            $query->where('version_name', 'like', "%{$search}%")
                  ->orWhere('system_prompt', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%");
        }

        $prompts = $query->orderBy('id', 'desc')->paginate(15)->withQueryString();

        return Inertia::render('admin/ai-prompts/index', [
            'prompts' => $prompts,
            'filters' => $request->only(['search', 'trashed']),
        ]);
    }

    public function store(AiPromptRequest $request): RedirectResponse
    {
        $data = $request->validated();

        DB::transaction(function () use ($data, $request) {
            if (!empty($data['is_active'])) {
                AiPrompt::where('is_active', true)->update(['is_active' => false]);
            }

            $prompt = AiPrompt::create($data);

            AdminActivityLogger::log(
                $request->user(),
                'CREATE',
                'AiPrompt',
                $prompt->id,
                "Membuat prompt AI baru: {$prompt->version_name} (Aktif: " . ($prompt->is_active ? 'Ya' : 'Tidak') . ')'
            );
        });

        return redirect()->back()->with('success', 'Prompt AI berhasil disimpan.');
    }

    public function update(AiPromptRequest $request, AiPrompt $aiPrompt): RedirectResponse
    {
        $data = $request->validated();

        DB::transaction(function () use ($data, $aiPrompt, $request) {
            if (!empty($data['is_active']) && !$aiPrompt->is_active) {
                AiPrompt::where('id', '!=', $aiPrompt->id)->update(['is_active' => false]);
            }

            $aiPrompt->update($data);

            AdminActivityLogger::log(
                $request->user(),
                'UPDATE',
                'AiPrompt',
                $aiPrompt->id,
                "Memperbarui prompt AI versi: {$aiPrompt->version_name}"
            );
        });

        return redirect()->back()->with('success', 'Prompt AI berhasil diperbarui.');
    }

    public function destroy(Request $request, AiPrompt $aiPrompt): RedirectResponse
    {
        $aiPrompt->delete();

        AdminActivityLogger::log(
            $request->user(),
            'DELETE (SOFT)',
            'AiPrompt',
            $aiPrompt->id,
            "Menghapus sementara prompt AI: {$aiPrompt->version_name}"
        );

        return redirect()->back()->with('success', 'Prompt AI berhasil dihapus sementara.');
    }

    public function restore(Request $request, int $id): RedirectResponse
    {
        $aiPrompt = AiPrompt::onlyTrashed()->findOrFail($id);
        $aiPrompt->restore();

        AdminActivityLogger::log(
            $request->user(),
            'RESTORE',
            'AiPrompt',
            $aiPrompt->id,
            "Memulihkan prompt AI: {$aiPrompt->version_name}"
        );

        return redirect()->back()->with('success', 'Prompt AI berhasil dipulihkan.');
    }
}
