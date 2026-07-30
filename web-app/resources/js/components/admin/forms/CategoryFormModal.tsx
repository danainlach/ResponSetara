import React, { useEffect } from 'react';
import { useForm } from '@inertiajs/react';
import { X, Layers } from 'lucide-react';

export interface CategoryItem {
    id?: number;
    code: string;
    name: string;
    slug: string;
    description?: string | null;
    color?: string | null;
    is_active: boolean;
    sort_order: number;
    deleted_at?: string | null;
}

interface ModalProps {
    isOpen: boolean;
    initialData: CategoryItem | null;
    onClose: () => void;
}

export default function CategoryFormModal({ isOpen, initialData, onClose }: ModalProps) {
    const isEdit = !!initialData;
    const { data, setData, post, put, processing, errors, reset, clearErrors } = useForm({
        code: initialData?.code || '',
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        color: initialData?.color || 'red',
        sort_order: initialData?.sort_order ?? 10,
        is_active: initialData ? initialData.is_active : true,
    });

    useEffect(() => {
        if (isOpen) {
            clearErrors();
            setData({
                code: initialData?.code || '',
                name: initialData?.name || '',
                slug: initialData?.slug || '',
                description: initialData?.description || '',
                color: initialData?.color || 'red',
                sort_order: initialData?.sort_order ?? 10,
                is_active: initialData ? initialData.is_active : true,
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, initialData]);

    if (!isOpen) {
return null;
}

    const handleNameChange = (val: string) => {
        setData((prev) => ({
            ...prev,
            name: val,
            // auto-generate slug and code only when creating new
            slug: !isEdit && !prev.slug.trim() ? val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : prev.slug,
            code: !isEdit && !prev.code.trim() ? val.toUpperCase().replace(/[^A-Z0-9]+/g, '_') : prev.code,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit && initialData?.id) {
            put(`/admin/categories/${initialData.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post('/admin/categories', {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm overflow-y-auto">
            <div className="w-full max-w-lg rounded-xl border border-zinc-700 bg-zinc-900 p-6 shadow-2xl my-8">
                <header className="flex items-center justify-between border-b border-zinc-800 pb-4">
                    <div className="flex items-center gap-2">
                        <Layers className="h-5 w-5 text-red-500" />
                        <h2 className="text-lg font-bold text-white">
                            {isEdit ? 'Edit Kategori Darurat' : 'Tambah Kategori Baru'}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        aria-label="Tutup modal formulir"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </header>

                <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                    <div>
                        <label htmlFor="cat-name" className="block text-sm font-semibold text-zinc-300">
                            Nama Kategori <span className="text-red-400">*</span>
                        </label>
                        <input
                            id="cat-name"
                            type="text"
                            required
                            value={data.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/30"
                            placeholder="Contoh: Darurat Medis"
                        />
                        {errors.name && <p className="mt-1 text-xs font-semibold text-red-400">{errors.name}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="cat-code" className="block text-sm font-semibold text-zinc-300">
                                Kode Unik (UPPERCASE) <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="cat-code"
                                type="text"
                                required
                                value={data.code}
                                onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm font-mono text-zinc-100 uppercase focus:border-red-500 focus:outline-none"
                                placeholder="MEDIS"
                            />
                            {errors.code && <p className="mt-1 text-xs font-semibold text-red-400">{errors.code}</p>}
                        </div>

                        <div>
                            <label htmlFor="cat-slug" className="block text-sm font-semibold text-zinc-300">
                                Slug URL <span className="text-red-400">*</span>
                            </label>
                            <input
                                id="cat-slug"
                                type="text"
                                required
                                value={data.slug}
                                onChange={(e) => setData('slug', e.target.value.toLowerCase())}
                                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm font-mono text-zinc-100 lowercase focus:border-red-500 focus:outline-none"
                                placeholder="darurat-medis"
                            />
                            {errors.slug && <p className="mt-1 text-xs font-semibold text-red-400">{errors.slug}</p>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="cat-desc" className="block text-sm font-semibold text-zinc-300">
                            Deskripsi Kategori (Opsional)
                        </label>
                        <textarea
                            id="cat-desc"
                            rows={3}
                            value={data.description || ''}
                            onChange={(e) => setData('description', e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100 focus:border-red-500 focus:outline-none"
                            placeholder="Penjelasan singkat mengenai tipe situasi darurat..."
                        />
                        {errors.description && <p className="mt-1 text-xs font-semibold text-red-400">{errors.description}</p>}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="cat-color" className="block text-sm font-semibold text-zinc-300">
                                Kode Warna Tema
                            </label>
                            <select
                                id="cat-color"
                                value={data.color || 'red'}
                                onChange={(e) => setData('color', e.target.value)}
                                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100 focus:border-red-500 focus:outline-none"
                            >
                                <option value="red">Red / Merah Darurat</option>
                                <option value="blue">Blue / Biru Keamanan</option>
                                <option value="emerald">Emerald / Hijau Penyelamatan</option>
                                <option value="amber">Amber / Kuning Waspada</option>
                                <option value="purple">Purple / Ungu Khusus</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="cat-sort" className="block text-sm font-semibold text-zinc-300">
                                Urutan Tampil (Sort Order)
                            </label>
                            <input
                                id="cat-sort"
                                type="number"
                                required
                                value={data.sort_order}
                                onChange={(e) => setData('sort_order', parseInt(e.target.value) || 0)}
                                className="mt-1 block w-full rounded-lg border border-zinc-700 bg-zinc-950 py-2 px-3 text-sm text-zinc-100 focus:border-red-500 focus:outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                        <input
                            id="cat-active"
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) => setData('is_active', e.target.checked)}
                            className="h-5 w-5 rounded border-zinc-700 bg-zinc-950 text-red-600 focus:ring-red-500 focus:ring-offset-zinc-900"
                        />
                        <label htmlFor="cat-active" className="text-sm font-medium text-zinc-200 cursor-pointer">
                            Aktif & Tampilkan di Antarmuka Publik
                        </label>
                    </div>

                    <footer className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex min-h-[44px] px-4 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800 text-sm font-medium text-zinc-300 hover:bg-zinc-700 focus:outline-none"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={processing}
                            className="inline-flex min-h-[44px] px-6 items-center justify-center rounded-lg bg-red-600 text-sm font-semibold text-white shadow-md hover:bg-red-500 focus:outline-none disabled:opacity-50"
                        >
                            {processing ? 'Menyimpan...' : 'Simpan Kategori'}
                        </button>
                    </footer>
                </form>
            </div>
        </div>
    );
}
