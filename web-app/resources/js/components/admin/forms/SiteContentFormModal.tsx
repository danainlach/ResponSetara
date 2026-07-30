import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, FileText } from 'lucide-react';

export interface SiteContentItem {
    id?: number;
    key: string;
    value: string;
    content_type?: string | null;
    is_active: boolean;
}

interface ModalProps {
    isOpen: boolean;
    initialData: SiteContentItem | null;
    onClose: () => void;
}

export default function SiteContentFormModal({ isOpen, initialData, onClose }: ModalProps) {
    const isEdit = !!initialData;
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        key: initialData?.key || '',
        value: initialData?.value || '',
        content_type: initialData?.content_type || 'text',
        is_active: initialData ? initialData.is_active : true,
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            setData({
                key: initialData?.key || '',
                value: initialData?.value || '',
                content_type: initialData?.content_type || 'text',
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
            put(`/admin/site-contents/${initialData.id}`, { onSuccess: () => {
 reset(); onClose(); 
} });
        } else {
            post('/admin/site-contents', { onSuccess: () => {
 reset(); onClose(); 
} });
        }
    };

    return (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl my-8">
                <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-2"><FileText className="h-5 w-5 text-red-500" /><h2 className="text-lg font-bold text-white">{isEdit ? 'Edit Konten Website' : 'Tambah Konten Website'}</h2></div>
                    <button type="button" onClick={onClose} className="min-h-[44px] min-w-[44px] text-zinc-400 hover:text-white"><X className="h-5 w-5" /></button>
                </header>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Key Konten (Unik) *</label>
                        <input type="text" required value={data.key} onChange={(e) => setData('key', e.target.value)} disabled={isEdit} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm font-mono text-zinc-100 disabled:opacity-50" placeholder="privacy.zero_retention" />
                        {errors.key && <p className="text-xs text-red-400 mt-1">{errors.key}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Tipe Konten</label>
                        <select value={data.content_type || 'text'} onChange={(e) => setData('content_type', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100">
                            <option value="text">Text (Standard Teks Bersingkat)</option>
                            <option value="html">HTML / Formatted</option>
                            <option value="json">JSON Metadata</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Nilai Konten / Teks *</label>
                        <textarea rows={6} required value={data.value} onChange={(e) => setData('value', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100 font-mono" placeholder="ResponSetara tidak menyimpan data pesan..." />
                        {errors.value && <p className="text-xs text-red-400 mt-1">{errors.value}</p>}
                    </div>
                    <div className="flex items-center gap-2 pt-2">
                        <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="rounded border-zinc-700 bg-zinc-950 text-red-600" />
                        <span className="text-sm text-zinc-200">Aktif & Gunakan pada Endpoint /api/v1/config</span>
                    </div>
                    <footer className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                        <button type="button" onClick={onClose} className="min-h-[44px] px-4 rounded-lg bg-zinc-800 text-sm text-zinc-300 hover:bg-zinc-700">Batal</button>
                        <button type="submit" disabled={processing} className="min-h-[44px] px-6 rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-500">Simpan Konten</button>
                    </footer>
                </form>
            </div>
        </div>
    );
}
