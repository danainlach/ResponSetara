import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '../../../layouts/PublicLayout';
import NonverbalMode from '../../../features/nonverbal/NonverbalMode';
import type { QuickPhraseItem, EmergencyCategoryItem } from '../../../features/nonverbal/types';

interface NonverbalIndexProps {
    initialPhrases?: QuickPhraseItem[];
    initialCategories?: EmergencyCategoryItem[];
    hasError?: boolean;
}

export default function NonverbalIndex({
    initialPhrases = [],
    initialCategories = [],
    hasError = false,
}: NonverbalIndexProps) {
    return (
        <PublicLayout announcement={hasError ? "Terjadi kendala koneksi saat memuat referensi frasa darurat." : "Halaman Mode Saya Tidak Dapat Berbicara (Nonverbal) terbuka."}>
            <Head>
                <title>Saya Tidak Dapat Berbicara &mdash; Mode Nonverbal ResponSetara</title>
                <meta
                    name="description"
                    content="Susun dan bacakan pesan pertolongan darurat melalui Text-to-Speech secara cepat, mandiri, dan terlindungi privasi bersama ResponSetara Indonesia."
                />
            </Head>

            <div className="max-w-6xl mx-auto py-4 sm:py-6 px-3 sm:px-0">
                <div className="mb-6 border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                            Mode: Saya Tidak Dapat Berbicara (Nonverbal)
                        </h1>
                        <p className="mt-1 text-sm sm:text-base text-ink-600 font-semibold">
                            Fasilitas percakapan darurat berbasis teks dan suara untuk situasi bisu, disabilitas wicara, maupun genting sesak napas.
                        </p>
                    </div>
                    <a
                        href="/"
                        className="min-h-[44px] inline-flex items-center justify-center px-4 py-2 rounded-xl border-2 border-navy-800 text-navy-900 font-extrabold text-sm hover:bg-slate-100 transition-colors shrink-0"
                    >
                        ← Kembali ke Beranda
                    </a>
                </div>

                <NonverbalMode
                    initialPhrases={initialPhrases}
                    initialCategories={initialCategories}
                    hasError={hasError}
                />
            </div>
        </PublicLayout>
    );
}
