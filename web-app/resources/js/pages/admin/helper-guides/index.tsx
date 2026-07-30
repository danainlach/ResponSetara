import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Pencil, Trash2, RotateCcw } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import SearchFilterBar from '@/components/admin/SearchFilterBar';
import StatusBadge from '@/components/admin/StatusBadge';
import AdminPagination from '@/components/admin/AdminPagination';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import HelperGuideFormModal from '@/components/admin/forms/HelperGuideFormModal';
import type {HelperGuideItem} from '@/components/admin/forms/HelperGuideFormModal';

interface PageProps {
    guides: { data: HelperGuideItem[]; links: any[]; total: number };
    audiences: { value: string; label: string }[];
    filters: { search?: string; audience?: string; trashed?: string };
}

export default function AdminHelperGuidesIndex({ guides, audiences, filters }: PageProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<HelperGuideItem | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'restore' | 'toggle'; item: HelperGuideItem } | null>(null);

    const handleExecuteConfirm = () => {
        if (!confirmAction) {
return;
}

        const { type, item } = confirmAction;

        if (type === 'delete') {
            router.delete(`/admin/helper-guides/${item.id}`, { preserveScroll: true });
        } else if (type === 'restore') {
            router.post(`/admin/helper-guides/${item.id}/restore`, {}, { preserveScroll: true });
        } else if (type === 'toggle') {
            router.put(`/admin/helper-guides/${item.id}`, { ...item, is_active: !item.is_active }, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Panduan Penolong', href: '/admin/helper-guides' }]}>
            <Head title="Manajemen Panduan Penolong — CMS ResponSetara" />
            <div className="mx-auto max-w-7xl space-y-6 py-2">
                <header>
                    <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">Panduan Cara Membantu (Helper Guides)</h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        Atur panduan praktis berformat teks bersih yang ditampilkan kepada penolong atau relawan saat situasi darurat.
                    </p>
                </header>

                <SearchFilterBar
                    routePath="/admin/helper-guides"
                    initialSearch={filters.search}
                    initialTrashed={!!filters.trashed}
                    extraFilters={[{ name: 'audience', label: 'Target Audiens', value: filters.audience || '', options: audiences }]}
                    onOpenCreate={() => {
 setSelectedItem(null); setIsFormOpen(true); 
}}
                    createButtonLabel="Tambah Panduan Baru"
                />

                <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-sm">
                    <table aria-label="Tabel Panduan Penolong" className="w-full text-left text-sm text-zinc-300">
                        <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase text-zinc-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">Audiens</th>
                                <th scope="col" className="px-4 py-3">Judul Panduan</th>
                                <th scope="col" className="px-4 py-3">Isi Instruksi (Teks Bersih)</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                                <th scope="col" className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {guides.data.length > 0 ? (
                                guides.data.map((g) => (
                                    <tr key={g.id} className="hover:bg-zinc-800/30">
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <span className="rounded bg-zinc-800 px-2.5 py-1 text-xs font-bold text-blue-400 uppercase font-mono">
                                                {g.audience}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5 font-semibold text-white max-w-xs">{g.title}</td>
                                        <td className="px-4 py-3.5 text-xs text-zinc-400 max-w-md truncate whitespace-pre-line">{g.body}</td>
                                        <td className="px-4 py-3.5">
                                            <button type="button" onClick={() => setConfirmAction({ type: 'toggle', item: g })} disabled={!!g.deleted_at}>
                                                <StatusBadge active={g.is_active} trashed={!!g.deleted_at} />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            {!g.deleted_at ? (
                                                <div className="inline-flex gap-2">
                                                    <button type="button" onClick={() => {
 setSelectedItem(g); setIsFormOpen(true); 
}} className="inline-flex min-h-[38px] items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-200 hover:bg-zinc-700"><Pencil className="h-3 w-3" /> Edit</button>
                                                    <button type="button" onClick={() => setConfirmAction({ type: 'delete', item: g })} className="inline-flex min-h-[38px] items-center gap-1 rounded border border-red-900 bg-red-950 px-2.5 py-1 text-xs text-red-300 hover:bg-red-900"><Trash2 className="h-3 w-3" /> Hapus</button>
                                                </div>
                                            ) : (
                                                <button type="button" onClick={() => setConfirmAction({ type: 'restore', item: g })} className="inline-flex min-h-[38px] items-center gap-1.5 rounded border border-emerald-800 bg-emerald-950 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-900"><RotateCcw className="h-3.5 w-3.5" /> Pulihkan</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={5} className="px-4 py-12 text-center text-zinc-500">Belum ada data panduan penolong.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <AdminPagination links={guides.links} total={guides.total} />
            </div>

            <HelperGuideFormModal isOpen={isFormOpen} initialData={selectedItem} audiences={audiences} onClose={() => setIsFormOpen(false)} />
            <ConfirmationModal isOpen={!!confirmAction} title="Konfirmasi Panduan Penolong" description={`Konfirmasi aksi untuk panduan "${confirmAction?.item.title}"?`} onConfirm={handleExecuteConfirm} onCancel={() => setConfirmAction(null)} />
        </AdminLayout>
    );
}
