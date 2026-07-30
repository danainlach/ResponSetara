<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\EmergencyContactRequest;
use App\Models\EmergencyContact;
use App\Services\AdminActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EmergencyContactController extends Controller
{
    public function index(Request $request): Response
    {
        $query = EmergencyContact::query();

        if ($request->boolean('trashed')) {
            $query->onlyTrashed();
        }

        if ($search = $request->input('search')) {
            $query->where('service_name', 'like', "%{$search}%")
                  ->orWhere('number', 'like', "%{$search}%")
                  ->orWhere('scope', 'like', "%{$search}%");
        }

        $contacts = $query->orderBy('sort_order')->paginate(15)->withQueryString();

        return Inertia::render('admin/emergency-contacts/index', [
            'contacts' => $contacts,
            'filters' => $request->only(['search', 'trashed']),
        ]);
    }

    public function store(EmergencyContactRequest $request): RedirectResponse
    {
        $contact = EmergencyContact::create($request->validated());

        AdminActivityLogger::log(
            $request->user(),
            'CREATE',
            'EmergencyContact',
            $contact->id,
            "Membuat kontak darurat baru: {$contact->service_name} ({$contact->number})"
        );

        return redirect()->back()->with('success', 'Kontak darurat berhasil dibuat.');
    }

    public function update(EmergencyContactRequest $request, EmergencyContact $emergencyContact): RedirectResponse
    {
        $oldNumber = $emergencyContact->number;
        $emergencyContact->update($request->validated());

        $msg = "Memperbarui kontak darurat: {$emergencyContact->service_name}";
        if ($oldNumber !== $emergencyContact->number) {
            $msg .= " (Nomor diubah dari {$oldNumber} menjadi {$emergencyContact->number})";
        }

        AdminActivityLogger::log($request->user(), 'UPDATE', 'EmergencyContact', $emergencyContact->id, $msg);

        return redirect()->back()->with('success', 'Kontak darurat berhasil diperbarui.');
    }

    public function destroy(Request $request, EmergencyContact $emergencyContact): RedirectResponse
    {
        $emergencyContact->delete();

        AdminActivityLogger::log(
            $request->user(),
            'DELETE (SOFT)',
            'EmergencyContact',
            $emergencyContact->id,
            "Menghapus sementara kontak darurat: {$emergencyContact->service_name}"
        );

        return redirect()->back()->with('success', 'Kontak darurat berhasil dihapus sementara.');
    }

    public function restore(Request $request, int $id): RedirectResponse
    {
        $emergencyContact = EmergencyContact::onlyTrashed()->findOrFail($id);
        $emergencyContact->restore();

        AdminActivityLogger::log(
            $request->user(),
            'RESTORE',
            'EmergencyContact',
            $emergencyContact->id,
            "Memulihkan kontak darurat: {$emergencyContact->service_name}"
        );

        return redirect()->back()->with('success', 'Kontak darurat berhasil dipulihkan.');
    }
}
