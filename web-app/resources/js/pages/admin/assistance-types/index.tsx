import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Pencil, Trash2, RotateCcw } from 'lucide-react';
import { AdminPersistentLayout } from '@/layouts/AdminLayout';
import SearchFilterBar from '@/components/admin/SearchFilterBar';
import StatusBadge from '@/components/admin/StatusBadge';
import AdminPagination from '@/components/admin/AdminPagination';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import AssistanceTypeFormModal from '@/components/admin/forms/AssistanceTypeFormModal';
import type {AssistanceTypeItem} from '@/components/admin/forms/AssistanceTypeFormModal';

interface PageProps {
    assistanceTypes: {
        data: AssistanceTypeItem[];
        links: any[];
        total: number;
    };
    categories: { id: number; name: string }[];
    filters: {
        search?: string;
        trashed?: string;
    };
}

export default function AdminAssistanceTypesIndex({ assistanceTypes, categories, filters }: PageProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<AssistanceTypeItem | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'restore' | 'toggle'; item: AssistanceTypeItem } | null>(null);

    const handleExecuteConfirm = () => {
        if (!confirmAction) {
return;
}

        const { type, item } = confirmAction;

        if (type === 'delete') {
            router.delete(`/admin/assistance-types/${item.id}`, { preserveScroll: true });
        } else if (type === 'restore') {
            router.post(`/admin/assistance-types/${item.id}/restore`, {}, { preserveScroll: true });
        } else if (type === 'toggle') {
            router.put(`/admin/assistance-types/${item.id}`, { ...item, is_active: !item.is_active }, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Manajemen Jenis Bantuan — CMS ResponSetara" />
            <div className="mx-auto max-w-7xl space-y-6 py-2">
                <header>
                    <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">Jenis Bantuan yang Dibutuhkan</h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        Kelola daftar jenis bantuan (misal: Ambulans, Pemadam Kebakaran, Evakuasi) untuk generator pesan cepat.
                    </p>
                </header>

                <SearchFilterBar
                    routePath="/admin/assistance-types"
                    initialSearch={filters.search}
                    initialTrashed={!!filters.trashed}
                    onOpenCreate={() => {
 setSelectedItem(null); setIsFormOpen(true); 
}}
                    createButtonLabel="Tambah Jenis Bantuan"
                />

                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-sm">
                    <table aria-label="Tabel Jenis Bantuan" className="w-full text-left text-sm text-zinc-300">
                        <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase text-zinc-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">Urutan</th>
                                <th scope="col" className="px-4 py-3">Kategori</th>
                                <th scope="col" className="px-4 py-3">Label & Kode</th>
                                <th scope="col" className="px-4 py-3">Fragmen Template Bantuan</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                                <th scope="col" className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {assistanceTypes.data.length > 0 ? (
                                assistanceTypes.data.map((item) => (
                                    <tr key={item.id} className="hover:bg-zinc-800/30">
                                        <td className="px-4 py-3.5 font-mono text-xs font-semibold text-zinc-400">#{item.sort_order}</td>
                                        <td className="px-4 py-3.5">
                                            <span className="rounded bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-200">
                                                {item.category?.name || 'Umum'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="font-semibold text-white">{item.label}</div>
                                            <div className="text-xs font-mono text-zinc-400 uppercase">{item.code}</div>
                                        </td>
                                        <td className="px-4 py-3.5 text-sm font-mono text-blue-300 truncate max-w-xs">
                                            "{item.template_fragment}"
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <button
                                                type="button"
                                                onClick={() => setConfirmAction({ type: 'toggle', item })}
                                                disabled={!!item.deleted_at}
                                                className="focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
                                            >
                                                <StatusBadge active={item.is_active} trashed={!!item.deleted_at} />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            {!item.deleted_at ? (
                                                <div className="inline-flex gap-2">
                                                    <button type="button" onClick={() => {
 setSelectedItem(item); setIsFormOpen(true); 
}} className="inline-flex min-h-[38px] items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-200 hover:bg-zinc-700"><Pencil className="h-3 w-3" /> Edit</button>
                                                    <button type="button" onClick={() => setConfirmAction({ type: 'delete', item })} className="inline-flex min-h-[38px] items-center gap-1 rounded border border-red-900 bg-red-950 px-2.5 py-1 text-xs text-red-300 hover:bg-red-900"><Trash2 className="h-3 w-3" /> Hapus</button>
                                                </div>
                                            ) : (
                                                <button type="button" onClick={() => setConfirmAction({ type: 'restore', item })} className="inline-flex min-h-[38px] items-center gap-1.5 rounded border border-emerald-800 bg-emerald-950 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-900"><RotateCcw className="h-3.5 w-3.5" /> Pulihkan</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-500 font-medium">Belum ada data jenis bantuan.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <AdminPagination links={assistanceTypes.links} total={assistanceTypes.total} />
            </div>

            <AssistanceTypeFormModal isOpen={isFormOpen} initialData={selectedItem} categories={categories} onClose={() => setIsFormOpen(false)} />
            <ConfirmationModal isOpen={!!confirmAction} title={confirmAction?.type === 'delete' ? 'Hapus Sementara Jenis Bantuan' : confirmAction?.type === 'restore' ? 'Pulihkan Jenis Bantuan' : 'Ubah Status Jenis Bantuan'} description={`Konfirmasi aksi untuk "${confirmAction?.item.label}"?`} onConfirm={handleExecuteConfirm} onCancel={() => setConfirmAction(null)} />
        </>
    );
}

AdminAssistanceTypesIndex.layout = AdminPersistentLayout;
AdminAssistanceTypesIndex.breadcrumbs = [{ title: 'Jenis Bantuan Darurat', href: '/admin/assistance-types' }];
