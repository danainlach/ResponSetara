import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, MessageSquare } from 'lucide-react';

export interface QuickPhraseItem {
    id?: number;
    category_id?: number | null;
    mode: string;
    phrase_text: string;
    speech_text: string;
    simplified_text: string;
    priority: string;
    is_active: boolean;
    sort_order: number;
    deleted_at?: string | null;
    category?: { id: number; name: string };
}

interface ModalProps {
    isOpen: boolean;
    initialData: QuickPhraseItem | null;
    categories: { id: number; name: string }[];
    modes: { value: string; label: string }[];
    priorities: { value: string; label: string }[];
    onClose: () => void;
}

export default function QuickPhraseFormModal({ isOpen, initialData, categories, modes, priorities, onClose }: ModalProps) {
    const isEdit = !!initialData;
    const { data, setData, post, put, processing, reset, clearErrors } = useForm({
        category_id: initialData?.category_id || '',
        mode: initialData?.mode || 'nonverbal',
        phrase_text: initialData?.phrase_text || '',
        speech_text: initialData?.speech_text || '',
        simplified_text: initialData?.simplified_text || '',
        priority: initialData?.priority || 'medium',
        sort_order: initialData?.sort_order ?? 10,
        is_active: initialData ? initialData.is_active : true,
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            setData({
                category_id: initialData?.category_id || '',
                mode: initialData?.mode || 'nonverbal',
                phrase_text: initialData?.phrase_text || '',
                speech_text: initialData?.speech_text || '',
                simplified_text: initialData?.simplified_text || '',
                priority: initialData?.priority || 'medium',
                sort_order: initialData?.sort_order ?? 10,
                is_active: initialData ? initialData.is_active : true,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, initialData]);

    if (!isOpen) {
return null;
}

    const handlePhraseChange = (val: string) => {
        setData((prev) => ({
            ...prev,
            phrase_text: val,
            speech_text: !isEdit && !prev.speech_text.trim() ? val : prev.speech_text,
            simplified_text: !isEdit && !prev.simplified_text.trim() ? val.toUpperCase() : prev.simplified_text,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && initialData?.id) {
            put(`/admin/quick-phrases/${initialData.id}`, { onSuccess: () => {
 reset(); onClose(); 
} });
        } else {
            post('/admin/quick-phrases', { onSuccess: () => {
 reset(); onClose(); 
} });
        }
    };

    return (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl my-8">
                <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-red-500" /><h2 className="text-lg font-bold text-white">{isEdit ? 'Edit Frasa Cepat' : 'Tambah Frasa Baru'}</h2></div>
                    <button type="button" onClick={onClose} className="min-h-[44px] min-w-[44px] text-zinc-400 hover:text-white"><X className="h-5 w-5" /></button>
                </header>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300">Mode Komunikasi *</label>
                            <select value={data.mode} onChange={(e) => setData('mode', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100">
                                {modes.map((m) => (<option key={m.value} value={m.value}>{m.label}</option>))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300">Prioritas *</label>
                            <select value={data.priority} onChange={(e) => setData('priority', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100">
                                {priorities.map((p) => (<option key={p.value} value={p.value}>{p.label}</option>))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Kategori</label>
                        <select value={data.category_id || ''} onChange={(e) => setData('category_id', e.target.value ? parseInt(e.target.value) : null as any)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100">
                            <option value="">Umum / Tanpa Kategori</option>
                            {categories.map((c) => (<option key={c.id} value={c.id}>{c.name}</option>))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Teks Frasa (Tampilan UI) *</label>
                        <input type="text" required value={data.phrase_text} onChange={(e) => handlePhraseChange(e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100" placeholder="Tolong bantu saya mengambil obat." />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Teks Suara (Web Speech API / TTS) *</label>
                        <input type="text" required value={data.speech_text} onChange={(e) => setData('speech_text', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100" placeholder="Tolong bantu saya mengambil obat." />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Teks Sederhana (Untuk Mode Teks Besar) *</label>
                        <input type="text" required value={data.simplified_text} onChange={(e) => setData('simplified_text', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm font-bold text-zinc-100 uppercase" placeholder="TOLONG AMBIL OBAT SAYA" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 cursor-pointer text-sm text-zinc-200"><input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="rounded border-zinc-700 bg-zinc-950 text-red-600" /> Aktif di Publik</label>
                        <div className="flex items-center gap-2"><span className="text-xs text-zinc-400">Urutan:</span><input type="number" value={data.sort_order} onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)} className="w-20 rounded border-zinc-700 bg-zinc-950 py-1 px-2 text-sm text-zinc-200" /></div>
                    </div>
                    <footer className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                        <button type="button" onClick={onClose} className="min-h-[44px] px-4 rounded-lg bg-zinc-800 text-sm text-zinc-300 hover:bg-zinc-700">Batal</button>
                        <button type="submit" disabled={processing} className="min-h-[44px] px-6 rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-500">Simpan Frasa</button>
                    </footer>
                </form>
            </div>
        </div>
    );
}
