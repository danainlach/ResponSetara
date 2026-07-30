<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\SiteContentRequest;
use App\Models\SiteContent;
use App\Services\AdminActivityLogger;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SiteContentController extends Controller
{
    public function index(Request $request): Response
    {
        $query = SiteContent::query();

        if ($search = $request->input('search')) {
            $query->where('key', 'like', "%{$search}%")
                  ->orWhere('value', 'like', "%{$search}%")
                  ->orWhere('content_type', 'like', "%{$search}%");
        }

        $contents = $query->orderBy('key')->paginate(15)->withQueryString();

        return Inertia::render('admin/site-contents/index', [
            'contents' => $contents,
            'filters' => $request->only(['search']),
        ]);
    }

    public function store(SiteContentRequest $request): RedirectResponse
    {
        $content = SiteContent::create($request->validated());

        AdminActivityLogger::log(
            $request->user(),
            'CREATE',
            'SiteContent',
            $content->id,
            "Membuat konten website baru: {$content->key}"
        );

        return redirect()->back()->with('success', 'Konten website berhasil dibuat.');
    }

    public function update(SiteContentRequest $request, SiteContent $siteContent): RedirectResponse
    {
        $siteContent->update($request->validated());

        AdminActivityLogger::log(
            $request->user(),
            'UPDATE',
            'SiteContent',
            $siteContent->id,
            "Memperbarui konten website: {$siteContent->key}"
        );

        return redirect()->back()->with('success', 'Konten website berhasil diperbarui.');
    }

    public function destroy(Request $request, SiteContent $siteContent): RedirectResponse
    {
        $key = $siteContent->key;
        $id = $siteContent->id;
        $siteContent->delete();

        AdminActivityLogger::log(
            $request->user(),
            'DELETE',
            'SiteContent',
            $id,
            "Menghapus konten website: {$key}"
        );

        return redirect()->back()->with('success', 'Konten website berhasil dihapus.');
    }
}
