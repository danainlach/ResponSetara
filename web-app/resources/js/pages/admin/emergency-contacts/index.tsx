import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Pencil, Trash2, RotateCcw, PhoneCall } from 'lucide-react';
import { AdminPersistentLayout } from '@/layouts/AdminLayout';
import SearchFilterBar from '@/components/admin/SearchFilterBar';
import StatusBadge from '@/components/admin/StatusBadge';
import AdminPagination from '@/components/admin/AdminPagination';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import EmergencyContactFormModal from '@/components/admin/forms/EmergencyContactFormModal';
import type {EmergencyContactItem} from '@/components/admin/forms/EmergencyContactFormModal';

interface PageProps {
    contacts: { data: EmergencyContactItem[]; links: any[]; total: number };
    filters: { search?: string; trashed?: string };
}

export default function AdminEmergencyContactsIndex({ contacts, filters }: PageProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<EmergencyContactItem | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'restore' | 'toggle' | 'verify'; item: EmergencyContactItem } | null>(null);

    const handleExecuteConfirm = () => {
        if (!confirmAction) {
return;
}

        const { type, item } = confirmAction;

        if (type === 'delete') {
            router.delete(`/admin/emergency-contacts/${item.id}`, { preserveScroll: true });
        } else if (type === 'restore') {
            router.post(`/admin/emergency-contacts/${item.id}/restore`, {}, { preserveScroll: true });
        } else if (type === 'toggle') {
            router.put(`/admin/emergency-contacts/${item.id}`, { ...item, is_active: !item.is_active }, { preserveScroll: true });
        } else if (type === 'verify') {
            router.put(`/admin/emergency-contacts/${item.id}`, { ...item, is_verified: !item.is_verified, last_verified_at: new Date().toISOString().split('T')[0] }, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Manajemen Kontak Darurat — CMS ResponSetara" />
            <div className="mx-auto max-w-7xl space-y-6 py-2">
                <header>
                    <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">Kontak Darurat & Layanan Resmi</h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        Atur nomor telepon layanan darurat (112, 118, 110, dll). Perubahan pada nomor resmi akan langsung tercatat dalam audit log aman.
                    </p>
                </header>

                <SearchFilterBar
                    routePath="/admin/emergency-contacts"
                    initialSearch={filters.search}
                    initialTrashed={!!filters.trashed}
                    onOpenCreate={() => {
 setSelectedItem(null); setIsFormOpen(true); 
}}
                    createButtonLabel="Tambah Kontak Baru"
                />

                <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-sm">
                    <table aria-label="Tabel Kontak Darurat" className="w-full text-left text-sm text-zinc-300">
                        <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase text-zinc-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">Layanan & Nomor</th>
                                <th scope="col" className="px-4 py-3">Cakupan Wilayah</th>
                                <th scope="col" className="px-4 py-3">Sumber & Verifikasi</th>
                                <th scope="col" className="px-4 py-3">Status Verifikasi</th>
                                <th scope="col" className="px-4 py-3">Status Publik</th>
                                <th scope="col" className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {contacts.data.length > 0 ? (
                                contacts.data.map((c) => (
                                    <tr key={c.id} className="hover:bg-zinc-800/30">
                                        <td className="px-4 py-3.5">
                                            <div className="font-bold text-white text-base flex items-center gap-2">
                                                <PhoneCall className="h-4 w-4 text-red-500 shrink-0" />
                                                <span>{c.service_name}</span>
                                            </div>
                                            <div className="text-sm font-mono font-extrabold text-amber-400 mt-0.5">{c.number}</div>
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-zinc-300">
                                            <div className="font-semibold text-zinc-200">{c.scope}</div>
                                            {c.coverage_note && <div className="text-zinc-500 truncate max-w-xs mt-0.5">{c.coverage_note}</div>}
                                        </td>
                                        <td className="px-4 py-3.5 text-xs text-zinc-400">
                                            <div>{c.source_name || 'Internal'}</div>
                                            <div className="text-zinc-500 font-mono">Verif: {c.last_verified_at || 'Belum'}</div>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <button type="button" onClick={() => setConfirmAction({ type: 'verify', item: c })} disabled={!!c.deleted_at}>
                                                <StatusBadge verified={c.is_verified} />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3.5">
                                            <button type="button" onClick={() => setConfirmAction({ type: 'toggle', item: c })} disabled={!!c.deleted_at}>
                                                <StatusBadge active={c.is_active} trashed={!!c.deleted_at} />
                                            </button>
                                        </td>
                                        <td className="px-4 py-3.5 text-right">
                                            {!c.deleted_at ? (
                                                <div className="inline-flex gap-2">
                                                    <button type="button" onClick={() => {
 setSelectedItem(c); setIsFormOpen(true); 
}} className="inline-flex min-h-[38px] items-center gap-1 rounded border border-zinc-700 bg-zinc-800 px-2.5 py-1 text-xs text-zinc-200 hover:bg-zinc-700"><Pencil className="h-3 w-3" /> Edit</button>
                                                    <button type="button" onClick={() => setConfirmAction({ type: 'delete', item: c })} className="inline-flex min-h-[38px] items-center gap-1 rounded border border-red-900 bg-red-950 px-2.5 py-1 text-xs text-red-300 hover:bg-red-900"><Trash2 className="h-3 w-3" /> Hapus</button>
                                                </div>
                                            ) : (
                                                <button type="button" onClick={() => setConfirmAction({ type: 'restore', item: c })} className="inline-flex min-h-[38px] items-center gap-1.5 rounded border border-emerald-800 bg-emerald-950 px-3 py-1 text-xs text-emerald-300 hover:bg-emerald-900"><RotateCcw className="h-3.5 w-3.5" /> Pulihkan</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr><td colSpan={6} className="px-4 py-12 text-center text-zinc-500">Belum ada data kontak darurat.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <AdminPagination links={contacts.links} total={contacts.total} />
            </div>

            <EmergencyContactFormModal isOpen={isFormOpen} initialData={selectedItem} onClose={() => setIsFormOpen(false)} />
            <ConfirmationModal
                isOpen={!!confirmAction}
                title={confirmAction?.type === 'delete' ? 'Hapus Sementara Kontak' : confirmAction?.type === 'verify' ? 'Ubah Status Verifikasi' : 'Ubah Status Publik Kontak'}
                description={`Anda akan memproses aksi penting pada kontak resmi "${confirmAction?.item.service_name} (${confirmAction?.item.number})". Perubahan ini langsung diawasi dan memengaruhi nomor telepon yang ditelepon oleh publik.`}
                onConfirm={handleExecuteConfirm}
                onCancel={() => setConfirmAction(null)}
            />
        </>
    );
}

AdminEmergencyContactsIndex.layout = AdminPersistentLayout;
AdminEmergencyContactsIndex.breadcrumbs = [{ title: 'Kontak Darurat Resmi', href: '/admin/emergency-contacts' }];
