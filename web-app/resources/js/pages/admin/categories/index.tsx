import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Pencil, Trash2, RotateCcw } from 'lucide-react';
import AdminLayout from '@/layouts/AdminLayout';
import SearchFilterBar from '@/components/admin/SearchFilterBar';
import StatusBadge from '@/components/admin/StatusBadge';
import AdminPagination from '@/components/admin/AdminPagination';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import CategoryFormModal from '@/components/admin/forms/CategoryFormModal';
import type {CategoryItem} from '@/components/admin/forms/CategoryFormModal';

interface PageProps {
    categories: {
        data: CategoryItem[];
        links: any[];
        total: number;
    };
    filters: {
        search?: string;
        trashed?: string;
    };
}

export default function AdminCategoriesIndex({ categories, filters }: PageProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryItem | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'restore' | 'toggle'; item: CategoryItem } | null>(null);

    const handleOpenCreate = () => {
        setSelectedCategory(null);
        setIsFormOpen(true);
    };

    const handleOpenEdit = (item: CategoryItem) => {
        setSelectedCategory(item);
        setIsFormOpen(true);
    };

    const handleExecuteConfirm = () => {
        if (!confirmAction) {
return;
}

        const { type, item } = confirmAction;

        if (type === 'delete') {
            router.delete(`/admin/categories/${item.id}`, { preserveScroll: true });
        } else if (type === 'restore') {
            router.post(`/admin/categories/${item.id}/restore`, {}, { preserveScroll: true });
        } else if (type === 'toggle') {
            router.put(`/admin/categories/${item.id}`, { ...item, is_active: !item.is_active }, { preserveScroll: true });
        }
    };

    return (
        <AdminLayout breadcrumbs={[{ title: 'Kategori Keadaan Darurat', href: '/admin/categories' }]}>
            <Head title="Manajemen Kategori Darurat — CMS ResponSetara" />

            <div className="mx-auto max-w-7xl space-y-6 py-2">
                <header>
                    <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">
                        Kategori Keadaan Darurat
                    </h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        Atur klasifikasi kondisi darurat (Medis, Keamanan, Bencana, dll) yang ditampilkan dalam Mode Komunikasi Bantuan.
                    </p>
                </header>

                <SearchFilterBar
                    routePath="/admin/categories"
                    initialSearch={filters.search}
                    showTrashedFilter={true}
                    initialTrashed={!!filters.trashed}
                    onOpenCreate={handleOpenCreate}
                    createButtonLabel="Tambah Kategori Baru"
                />

                <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-sm">
                    <table aria-label="Daftar Kategori Darurat" className="w-full text-left text-sm text-zinc-300">
                        <caption className="sr-only">Tabel manajemen kategori darurat ResponSetara</caption>
                        <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase text-zinc-400">
                            <tr>
                                <th scope="col" className="px-4 py-3 font-semibold">Urutan</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Kode & Nama</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Slug & Deskripsi</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Warna Label</th>
                                <th scope="col" className="px-4 py-3 font-semibold">Status Publik</th>
                                <th scope="col" className="px-4 py-3 text-right font-semibold">Aksi Manajemen</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {categories.data.length > 0 ? (
                                categories.data.map((cat) => (
                                    <tr key={cat.id} className="hover:bg-zinc-800/30 transition-colors">
                                        <td className="px-4 py-3.5 font-mono text-xs text-zinc-400 font-semibold"> # {cat.sort_order} </td>
                                        <td className="px-4 py-3.5">
                                            <div className="font-semibold text-white">{cat.name}</div>
                                            <div className="text-xs font-mono text-red-400 uppercase">{cat.code}</div>
                                        </td>
                                        <td className="px-4 py-3.5 max-w-sm">
                                            <div className="text-xs font-mono text-zinc-400">/{cat.slug}</div>
                                            <div className="text-xs text-zinc-400 truncate mt-0.5">{cat.description || 'Tidak ada deskripsi.'}</div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-800 text-xs font-mono font-medium text-zinc-200">
                                                <span className="h-2.5 w-2.5 rounded-full bg-red-500 inline-block" />
                                                {cat.color || 'default'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <button
                                                type="button"
                                                onClick={() => setConfirmAction({ type: 'toggle', item: cat })}
                                                className="focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full"
                                                title="Klik untuk mengubah status aktif"
                                                disabled={!!cat.deleted_at}
                                            >
                                                <StatusBadge active={cat.is_active} trashed={!!cat.deleted_at} />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="inline-flex items-center justify-end gap-2">
                                                {!cat.deleted_at ? (
                                                    <>
                                                        <button
                                                            type="button"
                                                            onClick={() => handleOpenEdit(cat)}
                                                            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-white"
                                                        >
                                                            <Pencil className="h-3.5 w-3.5 text-zinc-400" />
                                                            <span>Edit</span>
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => setConfirmAction({ type: 'delete', item: cat })}
                                                            className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-red-900 bg-red-950 px-3 py-1.5 text-xs font-medium text-red-300 hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-500"
                                                        >
                                                            <Trash2 className="h-3.5 w-3.5 text-red-400" />
                                                            <span>Hapus</span>
                                                        </button>
                                                    </>
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() => setConfirmAction({ type: 'restore', item: cat })}
                                                        className="inline-flex min-h-[38px] items-center gap-1.5 rounded-lg border border-emerald-800 bg-emerald-950 px-3.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                                    >
                                                        <RotateCcw className="h-4 w-4" />
                                                        <span>Pulihkan (Restore)</span>
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-4 py-12 text-center text-sm text-zinc-500 font-medium">
                                        Tidak ada data kategori darurat yang ditemukan sesuai kriteria pencarian Anda.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <AdminPagination links={categories.links} total={categories.total} />
            </div>

            <CategoryFormModal
                isOpen={isFormOpen}
                initialData={selectedCategory}
                onClose={() => setIsFormOpen(false)}
            />

            <ConfirmationModal
                isOpen={!!confirmAction}
                title={
                    confirmAction?.type === 'delete'
                        ? 'Konfirmasi Hapus Sementara (Soft-Delete)'
                        : confirmAction?.type === 'restore'
                        ? 'Konfirmasi Pulihkan Data'
                        : 'Ubah Status Publik Kategori'
                }
                description={
                    confirmAction?.type === 'delete'
                        ? `Apakah Anda yakin ingin menghapus sementara kategori "${confirmAction?.item.name}"? Data masih dapat dipulihkan melalui filter sampah.`
                        : confirmAction?.type === 'restore'
                        ? `Pulihkan kategori "${confirmAction?.item.name}" agar kembali aktif di dalam sistem?`
                        : `Anda akan merubah status publik kategori "${confirmAction?.item.name}". Kategori yang nonaktif tidak akan ditampilkan di antarmuka publik.`
                }
                confirmLabel={confirmAction?.type === 'delete' ? 'Ya, Hapus Sementara' : 'Ya, Lanjutkan'}
                variant={confirmAction?.type === 'delete' ? 'danger' : 'warning'}
                onConfirm={handleExecuteConfirm}
                onCancel={() => setConfirmAction(null)}
            />
        </AdminLayout>
    );
}
