<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Enums\CommunicationMode;
use App\Enums\PhrasePriority;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\QuickPhraseRequest;
use App\Models\EmergencyCategory;
use App\Models\QuickPhrase;
use App\Services\AdminActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class QuickPhraseController extends Controller
{
    public function index(Request $request): Response
    {
        $query = QuickPhrase::with('category:id,name,color');

        if ($request->boolean('trashed')) {
            $query->onlyTrashed();
        }

        if ($mode = $request->input('mode')) {
            $query->where('mode', $mode);
        }

        if ($search = $request->input('search')) {
            $query->where('phrase_text', 'like', "%{$search}%")
                  ->orWhere('speech_text', 'like', "%{$search}%");
        }

        $phrases = $query->orderBy('sort_order')->paginate(15)->withQueryString();
        $categories = EmergencyCategory::active()->select('id', 'name')->orderBy('sort_order')->get();

        $modes = array_map(fn($m) => ['value' => $m->value, 'label' => $m->label()], CommunicationMode::cases());
        $priorities = array_map(fn($p) => ['value' => $p->value, 'label' => $p->label()], PhrasePriority::cases());

        return Inertia::render('admin/quick-phrases/index', [
            'phrases' => $phrases,
            'categories' => $categories,
            'modes' => $modes,
            'priorities' => $priorities,
            'filters' => $request->only(['search', 'mode', 'trashed']),
        ]);
    }

    public function store(QuickPhraseRequest $request): RedirectResponse
    {
        $phrase = QuickPhrase::create($request->validated());

        AdminActivityLogger::log(
            $request->user(),
            'CREATE',
            'QuickPhrase',
            $phrase->id,
            "Membuat frasa cepat baru ({$phrase->mode->value}): " . mb_substr($phrase->phrase_text, 0, 50)
        );

        return redirect()->back()->with('success', 'Frasa cepat berhasil dibuat.');
    }

    public function update(QuickPhraseRequest $request, QuickPhrase $quickPhrase): RedirectResponse
    {
        $quickPhrase->update($request->validated());

        AdminActivityLogger::log(
            $request->user(),
            'UPDATE',
            'QuickPhrase',
            $quickPhrase->id,
            "Memperbarui frasa cepat ({$quickPhrase->mode->value}): " . mb_substr($quickPhrase->phrase_text, 0, 50)
        );

        return redirect()->back()->with('success', 'Frasa cepat berhasil diperbarui.');
    }

    public function destroy(Request $request, QuickPhrase $quickPhrase): RedirectResponse
    {
        $quickPhrase->delete();

        AdminActivityLogger::log(
            $request->user(),
            'DELETE (SOFT)',
            'QuickPhrase',
            $quickPhrase->id,
            "Menghapus sementara frasa cepat: " . mb_substr($quickPhrase->phrase_text, 0, 50)
        );

        return redirect()->back()->with('success', 'Frasa cepat berhasil dihapus sementara.');
    }

    public function restore(Request $request, int $id): RedirectResponse
    {
        $quickPhrase = QuickPhrase::onlyTrashed()->findOrFail($id);
        $quickPhrase->restore();

        AdminActivityLogger::log(
            $request->user(),
            'RESTORE',
            'QuickPhrase',
            $quickPhrase->id,
            "Memulihkan frasa cepat: " . mb_substr($quickPhrase->phrase_text, 0, 50)
        );

        return redirect()->back()->with('success', 'Frasa cepat berhasil dipulihkan.');
    }
}
