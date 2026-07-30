import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '../../../layouts/PublicLayout';
import DeafMode from '../../../features/deaf/DeafMode';
import type { HelperGuideItem } from '../../../features/deaf/types';

interface DeafPageProps {
    initialHelperGuides?: HelperGuideItem[];
    hasError?: boolean;
}

export default function DeafIndexPage({
    initialHelperGuides = [],
    hasError = false,
}: DeafPageProps) {
    return (
        <PublicLayout>
            <Head title="Saya Tidak Dapat Mendengar — Mode Komunikasi Tuli ResponSetara">
                <meta
                    name="description"
                    content="Mode Komunikasi Saya Tidak Dapat Mendengar dari ResponSetara. Mengubah ucapan penolong darurat menjadi teks interaktif real-time tanpa penampungan atau retensi data privasi."
                />
            </Head>

            <div className="py-4 sm:py-8 px-3 sm:px-6">
                <DeafMode
                    initialHelperGuides={initialHelperGuides}
                    hasError={hasError}
                />
            </div>
        </PublicLayout>
    );
}
