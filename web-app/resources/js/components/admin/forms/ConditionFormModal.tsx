import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, HeartPulse } from 'lucide-react';

export interface ConditionItem {
    id?: number;
    category_id?: number | null;
    code: string;
    label: string;
    description?: string | null;
    template_fragment: string;
    is_active: boolean;
    sort_order: number;
    deleted_at?: string | null;
    category?: { id: number; name: string; color?: string };
}

interface ModalProps {
    isOpen: boolean;
    initialData: ConditionItem | null;
    categories: { id: number; name: string }[];
    onClose: () => void;
}

export default function ConditionFormModal({ isOpen, initialData, categories, onClose }: ModalProps) {
    const isEdit = !!initialData;
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        category_id: initialData?.category_id || '',
        code: initialData?.code || '',
        label: initialData?.label || '',
        description: initialData?.description || '',
        template_fragment: initialData?.template_fragment || '',
        sort_order: initialData?.sort_order ?? 10,
        is_active: initialData ? initialData.is_active : true,
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            setData({
                category_id: initialData?.category_id || '',
                code: initialData?.code || '',
                label: initialData?.label || '',
                description: initialData?.description || '',
                template_fragment: initialData?.template_fragment || '',
                sort_order: initialData?.sort_order ?? 10,
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
            put(`/admin/conditions/${initialData.id}`, { onSuccess: () => {
 reset(); onClose(); 
} });
        } else {
            post('/admin/conditions', { onSuccess: () => {
 reset(); onClose(); 
} });
        }
    };

    return (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl my-8">
                <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-2">
                        <HeartPulse className="h-5 w-5 text-red-500" />
                        <h2 className="text-lg font-bold text-white">{isEdit ? 'Edit Kondisi Darurat' : 'Tambah Kondisi Baru'}</h2>
                    </div>
                    <button type="button" onClick={onClose} className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-zinc-400 hover:text-white"><X className="h-5 w-5" /></button>
                </header>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Kategori Darurat</label>
                        <select value={data.category_id || ''} onChange={(e) => setData('category_id', e.target.value ? parseInt(e.target.value) : null as any)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100">
                            <option value="">Umum (Tanpa Kategori Spesifik)</option>
                            {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                        </select>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300">Label Kondisi *</label>
                            <input type="text" required value={data.label} onChange={(e) => setData('label', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100" placeholder="Sesak Napas" />
                            {errors.label && <p className="text-xs text-red-400 mt-1">{errors.label}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300">Kode Unik *</label>
                            <input type="text" required value={data.code} onChange={(e) => setData('code', e.target.value.toUpperCase())} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm font-mono text-zinc-100 uppercase" placeholder="COND_BREATHING" />
                            {errors.code && <p className="text-xs text-red-400 mt-1">{errors.code}</p>}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Fragmen Template (Untuk Pesan Darurat) *</label>
                        <input type="text" required value={data.template_fragment} onChange={(e) => setData('template_fragment', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm font-mono text-emerald-300" placeholder="mengalami sesak napas akut" />
                        {errors.template_fragment && <p className="text-xs text-red-400 mt-1">{errors.template_fragment}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Deskripsi Tambahan</label>
                        <textarea rows={2} value={data.description || ''} onChange={(e) => setData('description', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-200">
                            <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="rounded border-zinc-700 bg-zinc-950 text-red-600" /> Aktif di Publik
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-zinc-400">Urutan:</span>
                            <input type="number" value={data.sort_order} onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)} className="w-20 rounded border-zinc-700 bg-zinc-950 py-1 px-2 text-sm text-zinc-200" />
                        </div>
                    </div>
                    <footer className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                        <button type="button" onClick={onClose} className="min-h-[44px] px-4 rounded-lg bg-zinc-800 text-sm text-zinc-300 hover:bg-zinc-700">Batal</button>
                        <button type="submit" disabled={processing} className="min-h-[44px] px-6 rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-500">Simpan Kondisi</button>
                    </footer>
                </form>
            </div>
        </div>
    );
}
