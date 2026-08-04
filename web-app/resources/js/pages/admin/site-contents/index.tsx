import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Pencil, Trash2 } from 'lucide-react';
import { AdminPersistentLayout } from '@/layouts/AdminLayout';
import SearchFilterBar from '@/components/admin/SearchFilterBar';
import StatusBadge from '@/components/admin/StatusBadge';
import AdminPagination from '@/components/admin/AdminPagination';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import SiteContentFormModal from '@/components/admin/forms/SiteContentFormModal';
import type {SiteContentItem} from '@/components/admin/forms/SiteContentFormModal';

interface PageProps {
    contents: { data: SiteContentItem[]; links: any[]; total: number };
    filters: { search?: string };
}

export default function AdminSiteContentsIndex({ contents, filters }: PageProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<SiteContentItem | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'toggle'; item: SiteContentItem } | null>(null);

    const handleExecuteConfirm = () => {
        if (!confirmAction) {
return;
}

        const { type, item } = confirmAction;

        if (type === 'delete') {
            router.delete(`/admin/site-contents/${item.id}`, { preserveScroll: true });
        } else if (type === 'toggle') {
            router.put(`/admin/site-contents/${item.id}`, { ...item, is_active: !item.is_active }, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Manajemen Konten Website — CMS ResponSetara" />
            <div className="mx-auto max-w-7xl space-y-6 py-2">
                <header>
                    <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">Konten Website & Informasi Publik</h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        Atur teks statis, disclaimer medis/hukum, dan informasi privasi (Zero-Retention Policy) pada halaman utama.
                    </p>
                </header>

                <SearchFilterBar
                    routePath="/admin/site-contents"
                    initialSearch={filters.search}
                    showTrashedFilter={false}
                    onOpenCreate={() => {
 setSelectedItem(null); setIsFormOpen(true); 
}}
                    createButtonLabel="Tambah Konten Baru"
                />

                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-sm">
                    <table aria-label="Tabel Konten Website" className="w-full text-left text-sm text-zinc-300">
                        <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase text-zinc-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">Key (Kunci Pengenal)</th>
                                <th scope="col" className="px-4 py-3">Tipe Konten</th>
                                <th scope="col" className="px-4 py-3">Nilai Teks / Kandungan</th>
                                <th scope="col" className="px-4 py-3">Status</th>
                                <th scope="col" className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {contents.data.length > 0 ? (
                                contents.data.map((c) => (
                                    <tr key={c.id} className="hover:bg-zinc-800/30">
                                        <td className="px-4 py-3.5 font-mono font-bold text-red-400 max-w-xs truncate">{c.key}</td>
                                        <td className="px-4 py-3.5"><span className="rounded bg-zinc-800 px-2 py-0.5 text-xs font-mono text-zinc-300 uppercase">{c.content_type || 'text'}</span></td>
                                        <td className="px-4 py-3.5 max-w-md text-zinc-300 text-xs truncate whitespace-pre-line">{c.value}</td>
                                        <td className="px-4 py-3.5">
                                            <button type="button" onClick={() => setConfirmAction({ type: 'toggle', item: c })}>
                                                <StatusBadge active={c.is_active} />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            <div className="inline-flex gap-2">
                                                <button type="button" onClick={() => {
 setSelectedItem(c); setIsFormOpen(true); 
}} className="inline-flex min-h-[38px] items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-200 hover:bg-zinc-700"><Pencil className="h-3 w-3" /> Edit</button>
                                                <button type="button" onClick={() => setConfirmAction({ type: 'delete', item: c })} className="inline-flex min-h-[38px] items-center gap-1 rounded border border-red-900 bg-red-950 px-2.5 py-1 text-xs text-red-300 hover:bg-red-900"><Trash2 className="h-3 w-3" /> Hapus</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={5} className="px-4 py-12 text-center text-zinc-500">Belum ada data konten website.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <AdminPagination links={contents.links} total={contents.total} />
            </div>

            <SiteContentFormModal isOpen={isFormOpen} initialData={selectedItem} onClose={() => setIsFormOpen(false)} />
            <ConfirmationModal isOpen={!!confirmAction} title="Konfirmasi Perubahan Konten" description={`Apakah Anda yakin ingin memproses aksi pada konten "${confirmAction?.item.key}"?`} onConfirm={handleExecuteConfirm} onCancel={() => setConfirmAction(null)} />
        </>
    );
}

AdminSiteContentsIndex.layout = AdminPersistentLayout;
AdminSiteContentsIndex.breadcrumbs = [{ title: 'Konten Website & Diskon', href: '/admin/site-contents' }];
