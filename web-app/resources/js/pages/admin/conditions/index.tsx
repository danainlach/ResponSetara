import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Pencil, Trash2, RotateCcw } from 'lucide-react';
import { AdminPersistentLayout } from '@/layouts/AdminLayout';
import SearchFilterBar from '@/components/admin/SearchFilterBar';
import StatusBadge from '@/components/admin/StatusBadge';
import AdminPagination from '@/components/admin/AdminPagination';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import ConditionFormModal from '@/components/admin/forms/ConditionFormModal';
import type {ConditionItem} from '@/components/admin/forms/ConditionFormModal';

interface PageProps {
    conditions: {
        data: ConditionItem[];
        links: any[];
        total: number;
    };
    categories: { id: number; name: string }[];
    filters: {
        search?: string;
        trashed?: string;
    };
}

export default function AdminConditionsIndex({ conditions, categories, filters }: PageProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCondition, setSelectedCondition] = useState<ConditionItem | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'restore' | 'toggle'; item: ConditionItem } | null>(null);

    const handleExecuteConfirm = () => {
        if (!confirmAction) {
return;
}

        const { type, item } = confirmAction;

        if (type === 'delete') {
            router.delete(`/admin/conditions/${item.id}`, { preserveScroll: true });
        } else if (type === 'restore') {
            router.post(`/admin/conditions/${item.id}/restore`, {}, { preserveScroll: true });
        } else if (type === 'toggle') {
            router.put(`/admin/conditions/${item.id}`, { ...item, is_active: !item.is_active }, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Manajemen Kondisi Darurat — CMS ResponSetara" />
            <div className="mx-auto max-w-7xl space-y-6 py-2">
                <header>
                    <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">Kondisi Pengguna & Darurat</h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        Atur daftar kondisi atau gejala yang dipilih pengguna saat menyusun pesan darurat deterministik.
                    </p>
                </header>

                <SearchFilterBar
                    routePath="/admin/conditions"
                    initialSearch={filters.search}
                    initialTrashed={!!filters.trashed}
                    onOpenCreate={() => {
 setSelectedCondition(null); setIsFormOpen(true); 
}}
                    createButtonLabel="Tambah Kondisi Baru"
                />

                <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-sm">
                    <table aria-label="Tabel Kondisi Pengguna" className="w-full text-left text-sm text-zinc-300">
                        <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase text-zinc-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">Urutan</th>
                                <th scope="col" className="px-4 py-3">Kategori</th>
                                <th scope="col" className="px-4 py-3">Label & Kode</th>
                                <th scope="col" className="px-4 py-3">Fragmen Template Pesan</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                                <th scope="col" className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {conditions.data.length > 0 ? (
                                conditions.data.map((cond) => (
                                    <tr key={cond.id} className="hover:bg-zinc-800/30">
                                        <td className="px-4 py-3.5 font-mono text-xs font-semibold text-zinc-400">#{cond.sort_order}</td>
                                        <td className="px-4 py-3.5">
                                            <span className="rounded bg-zinc-800 px-2 py-1 text-xs font-medium text-zinc-200">
                                                {cond.category?.name || 'Umum / Tanpa Kategori'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <div className="font-semibold text-white">{cond.label}</div>
                                            <div className="text-xs font-mono text-zinc-400 uppercase">{cond.code}</div>
                                        </td>
                                        <td className="px-4 py-3.5 max-w-xs text-sm font-mono text-emerald-300 truncate">
                                            "{cond.template_fragment}"
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <button
                                                type="button"
                                                onClick={() => setConfirmAction({ type: 'toggle', item: cond })}
                                                disabled={!!cond.deleted_at}
                                                className="focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
                                            >
                                                <StatusBadge active={cond.is_active} trashed={!!cond.deleted_at} />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            {!cond.deleted_at ? (
                                                <div className="inline-flex gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
 setSelectedCondition(cond); setIsFormOpen(true); 
}}
                                                        className="inline-flex min-h-[38px] items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-200 hover:bg-zinc-700"
                                                    >
                                                        <Pencil className="h-3 w-3 text-zinc-400" /> Edit
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmAction({ type: 'delete', item: cond })}
                                                        className="inline-flex min-h-[38px] items-center gap-1 rounded border border-red-900 bg-red-950 px-2.5 py-1 text-xs font-medium text-red-300 hover:bg-red-900"
                                                    >
                                                        <Trash2 className="h-3 w-3 text-red-400" /> Hapus
                                                    </button>
                                                </div>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setConfirmAction({ type: 'restore', item: cond })}
                                                    className="inline-flex min-h-[38px] items-center gap-1.5 rounded border border-emerald-800 bg-emerald-950 px-3 py-1 text-xs font-medium text-emerald-300 hover:bg-emerald-900"
                                                >
                                                    <RotateCcw className="h-3.5 w-3.5" /> Pulihkan
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-zinc-500 font-medium">Belum ada data kondisi pengguna darurat.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <AdminPagination links={conditions.links} total={conditions.total} />
            </div>

            <ConditionFormModal
                isOpen={isFormOpen}
                initialData={selectedCondition}
                categories={categories}
                onClose={() => setIsFormOpen(false)}
            />

            <ConfirmationModal
                isOpen={!!confirmAction}
                title={confirmAction?.type === 'delete' ? 'Hapus Sementara Kondisi' : confirmAction?.type === 'restore' ? 'Pulihkan Kondisi' : 'Ubah Status Kondisi'}
                description={`Apakah Anda yakin ingin memproses aksi pada kondisi "${confirmAction?.item.label}"?`}
                onConfirm={handleExecuteConfirm}
                onCancel={() => setConfirmAction(null)}
            />
        </>
    );
}

AdminConditionsIndex.layout = AdminPersistentLayout;
AdminConditionsIndex.breadcrumbs = [{ title: 'Kondisi Pengguna', href: '/admin/conditions' }];
