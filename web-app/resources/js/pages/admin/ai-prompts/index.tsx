import React, { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import { Pencil, Trash2, RotateCcw, Bot, AlertCircle } from 'lucide-react';
import { AdminPersistentLayout } from '@/layouts/AdminLayout';
import SearchFilterBar from '@/components/admin/SearchFilterBar';
import StatusBadge from '@/components/admin/StatusBadge';
import AdminPagination from '@/components/admin/AdminPagination';
import ConfirmationModal from '@/components/admin/ConfirmationModal';
import AiPromptFormModal from '@/components/admin/forms/AiPromptFormModal';
import type {AiPromptItem} from '@/components/admin/forms/AiPromptFormModal';

interface PageProps {
    prompts: { data: AiPromptItem[]; links: any[]; total: number };
    filters: { search?: string; trashed?: string };
}

export default function AdminAiPromptsIndex({ prompts, filters }: PageProps) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<AiPromptItem | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ type: 'delete' | 'restore' | 'toggle'; item: AiPromptItem } | null>(null);

    const handleExecuteConfirm = () => {
        if (!confirmAction) {
return;
}

        const { type, item } = confirmAction;

        if (type === 'delete') {
            router.delete(`/admin/ai-prompts/${item.id}`, { preserveScroll: true });
        } else if (type === 'restore') {
            router.post(`/admin/ai-prompts/${item.id}/restore`, {}, { preserveScroll: true });
        } else if (type === 'toggle') {
            router.put(`/admin/ai-prompts/${item.id}`, { ...item, is_active: !item.is_active }, { preserveScroll: true });
        }
    };

    return (
        <>
            <Head title="Manajemen Prompt AI — CMS ResponSetara" />
            <div className="mx-auto max-w-7xl space-y-6 py-2">
                <header>
                    <h1 className="text-2xl font-bold text-white tracking-tight sm:text-3xl">Konfigurasi Prompt & Aturan AI</h1>
                    <p className="mt-1 text-sm text-zinc-400">
                        Atur parameter system prompt, template pengguna, dan versioning untuk AI Emergency Composer.
                    </p>
                </header>

                <div className="flex items-center gap-3 rounded-xl border border-blue-900 bg-blue-950/40 p-4 text-blue-200">
                    <AlertCircle className="h-5 w-5 text-blue-400 shrink-0" />
                    <div className="text-xs sm:text-sm">
                        <span className="font-bold">Aturan Single Active Prompt:</span> Hanya 1 versi prompt yang boleh berstatus aktif pada waktu yang sama. Mengaktifkan prompt baru akan otomatis menonaktifkan versi lain. <span className="font-mono bg-blue-900/60 px-1.5 py-0.5 rounded">Catatan: Pengujian/Eksekusi Gemini API sengaja ditidakaktifkan pada fase ini sesuai instruksi PRD.</span>
                    </div>
                </div>

                <SearchFilterBar
                    routePath="/admin/ai-prompts"
                    initialSearch={filters.search}
                    initialTrashed={!!filters.trashed}
                    onOpenCreate={() => {
 setSelectedItem(null); setIsFormOpen(true); 
}}
                    createButtonLabel="Tambah Versi Prompt"
                />

                <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/50 shadow-sm">
                    <table aria-label="Tabel Konfigurasi Prompt AI" className="w-full text-left text-sm text-zinc-300">
                        <thead className="border-b border-zinc-800 bg-zinc-950/80 text-xs uppercase text-zinc-400">
                            <tr>
                                <th scope="col" className="px-4 py-3">Versi & Status</th>
                                <th scope="col" className="px-4 py-3">System Prompt (Aturan Dasar)</th>
                                <th scope="col" className="px-4 py-3">User Prompt Template</th>
                                <th scope="col" className="px-4 py-3">Catatan Audit</th>
                                <th scope="col" className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800/60">
                            {prompts.data.length > 0 ? (
                                prompts.data.map((p) => (
                                    <tr key={p.id} className="hover:bg-zinc-800/30">
                                        <td className="px-4 py-3.5 whitespace-nowrap">
                                            <div className="font-bold text-white text-base flex items-center gap-1.5">
                                                <Bot className="h-4 w-4 text-red-500" />
                                                <span>{p.version_name}</span>
                                            </div>
                                            <div className="mt-2">
                                                <button type="button" onClick={() => setConfirmAction({ type: 'toggle', item: p })} disabled={!!p.deleted_at}>
                                                    <StatusBadge active={p.is_active} trashed={!!p.deleted_at} label={p.is_active ? ' Aktif (Utama)' : ' Nonaktif (Arsip)'} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3.5 font-mono text-xs text-emerald-300 max-w-xs truncate whitespace-pre-line">{p.system_prompt}</td>
                                        <td className="px-4 py-3.5 font-mono text-xs text-blue-300 max-w-xs truncate whitespace-pre-line">{p.user_prompt_template}</td>
                                        <td className="px-4 py-3.5 text-xs text-zinc-400 max-w-xs truncate">{p.notes || '—'}</td>
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
                                <tr><td colSpan={5} className="px-4 py-12 text-center text-zinc-500">Belum ada data prompt AI.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <AdminPagination links={prompts.links} total={prompts.total} />
            </div>

            <AiPromptFormModal isOpen={isFormOpen} initialData={selectedItem} onClose={() => setIsFormOpen(false)} />
            <ConfirmationModal
                isOpen={!!confirmAction}
                title={confirmAction?.type === 'delete' ? 'Hapus Sementara Prompt' : 'Ubah Status Aktif Prompt AI'}
                description={confirmAction?.type === 'delete' ? `Hapus sementara versi prompt "${confirmAction?.item.version_name}"?` : `Mengaktifkan prompt "${confirmAction?.item.version_name}" akan menonaktifkan versi prompt lain yang sedang berjalan.`}
                onConfirm={handleExecuteConfirm}
                onCancel={() => setConfirmAction(null)}
            />
        </>
    );
}

AdminAiPromptsIndex.layout = AdminPersistentLayout;
AdminAiPromptsIndex.breadcrumbs = [{ title: 'Konfigurasi Prompt AI', href: '/admin/ai-prompts' }];
