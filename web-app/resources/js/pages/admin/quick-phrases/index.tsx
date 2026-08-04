import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Pencil, Trash2, RotateCcw, Volume2 } from 'lucide-react';
import { AdminPersistentLayout } from '@/layouts/AdminLayout';
import SearchFilterBar from '@/components/admin/SearchFilterBar';
import StatusBadge from '@/components/admin/StatusBadge';
import AdminPagination from '@/components/admin/AdminPagination';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import QuickPhraseFormModal from '@/components/admin/forms/QuickPhraseFormModal';
import type {QuickPhraseItem} from '@/components/admin/forms/QuickPhraseFormModal';

interface PageProps {
    phrases: { data: QuickPhraseItem[]; links: any[]; total: number };
    categories: { id: number; name: string }[];
    modes: { value: string; label: string }[];
    priorities: { value: string; label: string }[];
    filters: { search?: string; mode?: string; trashed?: string };
}

export default function AdminQuickPhrasesIndex({ phrases, categories, modes, priorities, filters }: PageProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<QuickPhraseItem | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'restore' | 'toggle'; item: QuickPhraseItem } | null>(null);

    const handleExecuteConfirm = () => {
        if (!confirmAction) {
return;
}

        const { type, item } = confirmAction;

        if (type === 'delete') {
            router.delete(`/admin/quick-phrases/${item.id}`, { preserveScroll: true });
        } else if (type === 'restore') {
            router.post(`/admin/quick-phrases/${item.id}/restore`, {}, { preserveScroll: true });
        } else if (type === 'toggle') {
            router.put(`/admin/quick-phrases/${item.id}`, { ...item, is_active: !item.is_active }, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Manajemen Frasa Cepat — CMS ResponSetara" />
            <div className="mx-auto max-w-7xl space-y-6 py-2">
                <header>
                    <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">Frasa Cepat Darurat</h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        Atur perpustakaan frasa komunikasi siap pakai untuk penyandang disabilitas nonverbal maupun mode umum.
                    </p>
                </header>

                <SearchFilterBar
                    routePath="/admin/quick-phrases"
                    initialSearch={filters.search}
                    initialTrashed={!!filters.trashed}
                    extraFilters={[{ name: 'mode', label: 'Mode Komunikasi', value: filters.mode || '', options: modes }]}
                    onOpenCreate={() => {
 setSelectedItem(null); setIsFormOpen(true); 
}}
                    createButtonLabel="Tambah Frasa Baru"
                />

                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-sm">
                    <table aria-label="Tabel Frasa Cepat" className="w-full text-left text-sm text-zinc-300">
                        <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase text-zinc-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">Mode</th>
                                <th scope="col" className="px-4 py-3">Teks Tampilan (UI)</th>
                                <th scope="col" className="px-4 py-3">Teks Suara (TTS)</th>
                                <th scope="col" className="px-4 py-3">Prioritas</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                                <th scope="col" className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {phrases.data.length > 0 ? (
                                phrases.data.map((p) => (
                                    <tr key={p.id} className="hover:bg-zinc-800/30">
                                        <td className="px-4 py-3.5">
                                            <span className="rounded bg-zinc-800 px-2.5 py-1 text-xs font-bold font-mono text-amber-400 uppercase">
                                                {p.mode}
                                            </span>
                                            <div className="text-[11px] text-zinc-500 mt-1">{p.category?.name || 'Umum'}</div>
                                        </td>
                                        <td className="px-4 py-3.5 font-semibold text-white max-w-xs truncate">{p.phrase_text}</td>
                                        <td className="px-4 py-3.5 text-xs text-zinc-300 flex items-center gap-1.5 pt-4">
                                            <Volume2 className="h-4 w-4 text-emerald-400 shrink-0" />
                                            <span className="truncate max-w-xs">{p.speech_text}</span>
                                        </td>
                                        <td className="px-4 py-3.5 font-mono text-xs text-zinc-300 uppercase font-semibold">{p.priority}</td>
                                        <td className="px-4 py-3.5">
                                            <button type="button" onClick={() => setConfirmAction({ type: 'toggle', item: p })} disabled={!!p.deleted_at}>
                                                <StatusBadge active={p.is_active} trashed={!!p.deleted_at} />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            {!p.deleted_at ? (
                                                <div className="inline-flex gap-2">
                                                    <button type="button" onClick={() => {
 setSelectedItem(p); setIsFormOpen(true); 
}} className="inline-flex min-h-[38px] items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-200 hover:bg-zinc-700"><Pencil className="h-3 w-3" /> Edit</button>
                                                    <button type="button" onClick={() => setConfirmAction({ type: 'delete', item: p })} className="inline-flex min-h-[38px] items-center gap-1 rounded border border-red-900 bg-red-950 px-2.5 py-1 text-xs text-red-300 hover:bg-red-900"><Trash2 className="h-3 w-3" /> Hapus</button>
                                                </div>
                                            ) : (
                                                <button type="button" onClick={() => setConfirmAction({ type: 'restore', item: p })} className="inline-flex min-h-[38px] items-center gap-1.5 rounded border border-emerald-800 bg-emerald-950 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-900"><RotateCcw className="h-3.5 w-3.5" /> Pulihkan</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-500">Belum ada data frasa cepat.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <AdminPagination links={phrases.links} total={phrases.total} />
            </div>

            <QuickPhraseFormModal isOpen={isFormOpen} initialData={selectedItem} categories={categories} modes={modes} priorities={priorities} onClose={() => setIsFormOpen(false)} />
            <ConfirmationModal isOpen={!!confirmAction} title="Konfirmasi Perubahan Frasa" description={`Melanjutkan aksi untuk frasa "${confirmAction?.item.phrase_text}"?`} onConfirm={handleExecuteConfirm} onCancel={() => setConfirmAction(null)} />
        </>
    );
}

AdminQuickPhrasesIndex.layout = AdminPersistentLayout;
AdminQuickPhrasesIndex.breadcrumbs = [{ title: 'Frasa Cepat Darurat', href: '/admin/quick-phrases' }];
