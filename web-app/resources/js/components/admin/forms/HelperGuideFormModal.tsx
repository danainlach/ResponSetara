import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, BookOpen } from 'lucide-react';

export interface HelperGuideItem {
    id?: number;
    title: string;
    body: string;
    audience: string;
    is_active: boolean;
    sort_order: number;
    deleted_at?: string | null;
}

interface ModalProps {
    isOpen: boolean;
    initialData: HelperGuideItem | null;
    audiences: { value: string; label: string }[];
    onClose: () => void;
}

export default function HelperGuideFormModal({ isOpen, initialData, audiences, onClose }: ModalProps) {
    const isEdit = !!initialData;
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        title: initialData?.title || '',
        body: initialData?.body || '',
        audience: initialData?.audience || 'general',
        sort_order: initialData?.sort_order ?? 10,
        is_active: initialData ? initialData.is_active : true,
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            setData({
                title: initialData?.title || '',
                body: initialData?.body || '',
                audience: initialData?.audience || 'general',
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
            put(`/admin/helper-guides/${initialData.id}`, { onSuccess: () => {
 reset(); onClose(); 
} });
        } else {
            post('/admin/helper-guides', { onSuccess: () => {
 reset(); onClose(); 
} });
        }
    };

    return (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl my-8">
                <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-2"><BookOpen className="h-5 w-5 text-red-500" /><h2 className="text-lg font-bold text-white">{isEdit ? 'Edit Panduan Penolong' : 'Tambah Panduan Baru'}</h2></div>
                    <button type="button" onClick={onClose} className="min-h-[44px] min-w-[44px] text-zinc-400 hover:text-white"><X className="h-5 w-5" /></button>
                </header>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Target Audiens *</label>
                        <select value={data.audience} onChange={(e) => setData('audience', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100">
                            {audiences.map((a) => (<option key={a.value} value={a.value}>{a.label}</option>))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Judul Panduan *</label>
                        <input type="text" required value={data.title} onChange={(e) => setData('title', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100" placeholder="Cara Membantu Penyandang Tuli saat Gempa" />
                        {errors.title && <p className="text-xs text-red-400 mt-1">{errors.title}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Isi Instruksi (Teks Bersih Tanpa HTML) *</label>
                        <textarea rows={6} required value={data.body} onChange={(e) => setData('body', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100" placeholder="1. Gunakan gestur tangan atau sentuh bahu dengan lembut...&#10;2. Tampilkan pesan layar secara visual..." />
                        {errors.body && <p className="text-xs text-red-400 mt-1">{errors.body}</p>}
                        <p className="text-[11px] text-zinc-500 mt-1">Sesuai rancangan sistem, gunakan teks bersingkat dan langsung tanpa formatting rumit.</p>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-200"><input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="rounded border-zinc-700 bg-zinc-950 text-red-600" /> Aktif di Publik</label>
                        <div className="flex items-center gap-2"><span className="text-xs text-zinc-400">Urutan:</span><input type="number" value={data.sort_order} onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)} className="w-20 rounded border-zinc-700 bg-zinc-950 py-1 px-2 text-sm text-zinc-200" /></div>
                    </div>
                    <footer className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                        <button type="button" onClick={onClose} className="min-h-[44px] px-4 rounded-lg bg-zinc-800 text-sm text-zinc-300 hover:bg-zinc-700">Batal</button>
                        <button type="submit" disabled={processing} className="min-h-[44px] px-6 rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-500">Simpan Panduan</button>
                    </footer>
                </form>
            </div>
        </div>
    );
}
