import React, { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { X, PhoneCall } from 'lucide-react';
import ConfirmationModal from '@/components/admin/ConfirmationModal';

export interface EmergencyContactItem {
    id?: number;
    service_name: string;
    number: string;
    scope: string;
    coverage_note?: string | null;
    source_name?: string | null;
    source_url?: string | null;
    last_verified_at?: string | null;
    is_verified: boolean;
    is_active: boolean;
    sort_order: number;
    deleted_at?: string | null;
}

interface ModalProps {
    isOpen: boolean;
    initialData: EmergencyContactItem | null;
    onClose: () => void;
}

export default function EmergencyContactFormModal({ isOpen, initialData, onClose }: ModalProps) {
    const isEdit = !!initialData;
    const [confirmPhoneEdit, setConfirmPhoneEdit] = useState(false);

    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        service_name: initialData?.service_name || '',
        number: initialData?.number || '',
        scope: initialData?.scope || 'Nasional',
        coverage_note: initialData?.coverage_note || '',
        source_name: initialData?.source_name || '',
        source_url: initialData?.source_url || '',
        last_verified_at: initialData?.last_verified_at ? initialData.last_verified_at.split('T')[0] : new Date().toISOString().split('T')[0],
        is_verified: initialData ? initialData.is_verified : true,
        sort_order: initialData?.sort_order ?? 10,
        is_active: initialData ? initialData.is_active : true,
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            setData({
                service_name: initialData?.service_name || '',
                number: initialData?.number || '',
                scope: initialData?.scope || 'Nasional',
                coverage_note: initialData?.coverage_note || '',
                source_name: initialData?.source_name || '',
                source_url: initialData?.source_url || '',
                last_verified_at: initialData?.last_verified_at ? initialData.last_verified_at.split('T')[0] : new Date().toISOString().split('T')[0],
                is_verified: initialData ? initialData.is_verified : true,
                sort_order: initialData?.sort_order ?? 10,
                is_active: initialData ? initialData.is_active : true,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, initialData]);

    if (!isOpen) {
return null;
}

    const executeSubmit = () => {
        if (isEdit && initialData?.id) {
            put(`/admin/emergency-contacts/${initialData.id}`, { onSuccess: () => {
 reset(); onClose(); 
} });
        } else {
            post('/admin/emergency-contacts', { onSuccess: () => {
 reset(); onClose(); 
} });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // If editing and phone number changed, show explicit warning confirmation
        if (isEdit && initialData && initialData.number !== data.number) {
            setConfirmPhoneEdit(true);

            return;
        }

        executeSubmit();
    };

    return (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl my-8">
                <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-2"><PhoneCall className="h-5 w-5 text-red-500" /><h2 className="text-lg font-bold text-white">{isEdit ? 'Edit Kontak Darurat' : 'Tambah Kontak Baru'}</h2></div>
                    <button type="button" onClick={onClose} className="min-h-[44px] min-w-[44px] text-zinc-400 hover:text-white"><X className="h-5 w-5" /></button>
                </header>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300">Nama Layanan *</label>
                            <input type="text" required value={data.service_name} onChange={(e) => setData('service_name', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100" placeholder="Layanan Darurat Terpadu" />
                            {errors.service_name && <p className="text-xs text-red-400 mt-1">{errors.service_name}</p>}
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300">Nomor Telepon *</label>
                            <input type="text" required value={data.number} onChange={(e) => setData('number', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm font-mono font-bold text-amber-400" placeholder="112" />
                            {errors.number && <p className="text-xs text-red-400 mt-1">{errors.number}</p>}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300">Cakupan Wilayah *</label>
                            <input type="text" required value={data.scope} onChange={(e) => setData('scope', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100" placeholder="Nasional / Provinsi / Kota" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300">Tanggal Verifikasi Terakhir</label>
                            <input type="date" value={data.last_verified_at || ''} onChange={(e) => setData('last_verified_at', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-zinc-300">Catatan Cakupan (Opsional)</label>
                        <textarea rows={2} value={data.coverage_note || ''} onChange={(e) => setData('coverage_note', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100" placeholder="Berlaku 24 jam untuk seluruh operator telepon seluler." />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300">Sumber Data / Instansi</label>
                            <input type="text" value={data.source_name || ''} onChange={(e) => setData('source_name', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100" placeholder="Komdigi / Kemenkes / Polri" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-zinc-300">URL Sumber Resmi</label>
                            <input type="url" value={data.source_url || ''} onChange={(e) => setData('source_url', e.target.value)} className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100" placeholder="https://..." />
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-zinc-800">
                        <div className="flex items-center gap-4">
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-blue-300 font-semibold"><input type="checkbox" checked={data.is_verified} onChange={(e) => setData('is_verified', e.target.checked)} className="rounded border-zinc-700 bg-zinc-950 text-blue-600" /> Terverifikasi</label>
                            <label className="flex items-center gap-2 cursor-pointer text-sm text-emerald-300 font-semibold"><input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="rounded border-zinc-700 bg-zinc-950 text-emerald-600" /> Aktif Publik</label>
                        </div>
                        <div className="flex items-center gap-2"><span className="text-xs text-zinc-400">Urutan:</span><input type="number" value={data.sort_order} onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)} className="w-20 rounded border-zinc-700 bg-zinc-950 py-1 px-2 text-sm text-zinc-200" /></div>
                    </div>
                    <footer className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
                        <button type="button" onClick={onClose} className="min-h-[44px] px-4 rounded-lg bg-zinc-800 text-sm text-zinc-300 hover:bg-zinc-700">Batal</button>
                        <button type="submit" disabled={processing} className="min-h-[44px] px-6 rounded-lg bg-red-600 text-sm font-semibold text-white hover:bg-red-500">Simpan Kontak</button>
                    </footer>
                </form>

                <ConfirmationModal
                    isOpen={confirmPhoneEdit}
                    title="PERINGATAN KRITIS: Perubahan Nomor Telepon Darurat"
                    description={`Anda sedang mengubah nomor layanan darurat "${initialData?.service_name}" dari "${initialData?.number}" menjadi "${data.number}". Pastikan nomor baru 100% akurat agar tidak mengganggu kedaruratan masyarakat!`}
                    confirmLabel="Ya, Saya Memvalidasi Nomor Baru"
                    variant="danger"
                    onConfirm={() => {
 setConfirmPhoneEdit(false); executeSubmit(); 
}}
                    onCancel={() => setConfirmPhoneEdit(false)}
                />
            </div>
        </div>
    );
}
