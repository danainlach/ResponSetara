import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Bot } from 'lucide-react';

export interface AiPromptItem {
    id?: number;
    version_name: string;
    system_prompt: string;
    user_prompt_template?: string | null;
    notes?: string | null;
    is_active: boolean;
    deleted_at?: string | null;
}

interface ModalProps {
    isOpen: boolean;
    initialData: AiPromptItem | null;
    onClose: () => void;
}

export default function AiPromptFormModal({ isOpen, initialData, onClose }: ModalProps) {
    const isEdit = !!initialData;
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        version_name: initialData?.version_name || '',
        system_prompt: initialData?.system_prompt || '',
        user_prompt_template: initialData?.user_prompt_template || '',
        notes: initialData?.notes || '',
        is_active: initialData ? initialData.is_active : true,
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            setData({
                version_name: initialData?.version_name || '',
                system_prompt: initialData?.system_prompt || '',
                user_prompt_template: initialData?.user_prompt_template || '',
                notes: initialData?.notes || '',
                is_active: initialData ? initialData.is_active : true,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, initialData]);

    if (!isOpen) {
return null;
}

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && initialData?.id) {
            put(`/admin/ai-prompts/${initialData.id}`, { onSuccess: () => {
 reset(); onClose(); 
} });
        } else {
            post('/admin/ai-prompts', { onSuccess: () => {
 reset(); onClose(); 
} });
        }
    };

    return (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-xl rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl my-8">
                <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-2"><Bot className="h-5 w-5 text-red-500" /><h2 className="text-lg font-bold text-white">{isEdit ? 'Edit Versi Prompt AI' : 'Tambah Versi Prompt AI Baru'}</h2></div>
                    <button type="button" onClick={onClose} className="min-h-[44px] min-w-[44px] text-zinc-400 hover:text-white"><X className="h-5 w-5" /></button>
                </header>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Nama Versi / Identitas Prompt *</label>
                        <input type="text" required value={data.version_name} onChange={(e) => setData('version_name', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm font-mono text-zinc-100" placeholder="v1.0-emergency-standard" />
                        {errors.version_name && <p className="text-xs text-red-400 mt-1">{errors.version_name}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">System Prompt (Instruksi Keamanan & Karakter AI) *</label>
                        <textarea rows={5} required value={data.system_prompt} onChange={(e) => setData('system_prompt', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm font-mono text-emerald-300" placeholder="Anda adalah sistem penyusun pesan darurat ResponSetara..." />
                        {errors.system_prompt && <p className="text-xs text-red-400 mt-1">{errors.system_prompt}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">User Prompt Template (Opsional)</label>
                        <textarea rows={3} value={data.user_prompt_template || ''} onChange={(e) => setData('user_prompt_template', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm font-mono text-blue-300" placeholder="Susun pesan berdasarkan kondisi berikut: {conditions}" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Catatan Perubahan / Alasan (Opsional)</label>
                        <input type="text" value={data.notes || ''} onChange={(e) => setData('notes', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100" placeholder="Diperbarui untuk meningkatkan kepastian format SOS." />
                    </div>
                    <div className="flex items-center gap-3 pt-2 border-t border-zinc-800">
                        <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="h-5 w-5 rounded border-zinc-700 bg-zinc-950 text-red-600" />
                        <div>
                            <span className="text-sm font-bold text-white">Aktif sebagai Prompt Utama (Single Active Rule)</span>
                            <p className="text-xs text-zinc-400">Centang opsi ini akan secara otomatis menonaktifkan prompt versi lain di database.</p>
                        </div>
                    </div>
                    <footer className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                        <button type="button" onClick={onClose} className="min-h-[44px] px-4 rounded-lg bg-zinc-800 text-sm text-zinc-300 hover:bg-zinc-700">Batal</button>
                        <button type="submit" disabled={processing} className="min-h-[44px] px-6 rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-500">Simpan Konfigurasi AI</button>
                    </footer>
                </form>
            </div>
        </div>
    );
}
