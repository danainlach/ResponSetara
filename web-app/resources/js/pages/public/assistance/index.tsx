import React from 'react';
import { Head } from '@inertiajs/react';
import PublicLayout from '../../../layouts/PublicLayout';
import AssistanceMode from '../../../features/assistance/AssistanceMode';
import type { EmergencyCategoryItem, EmergencyConditionItem, AssistanceTypeItem } from '../../../features/assistance/types';

interface AssistanceIndexProps {
    initialCategories?: EmergencyCategoryItem[];
    initialConditions?: EmergencyConditionItem[];
    initialAssistanceTypes?: AssistanceTypeItem[];
    hasError?: boolean;
}

export default function AssistanceIndex({
    initialCategories = [],
    initialConditions = [],
    initialAssistanceTypes = [],
    hasError = false
}: AssistanceIndexProps) {
    return (
        <PublicLayout announcement={hasError ? "Terjadi kendala koneksi saat memuat referensi darurat online." : "Halaman Mode Saya Butuh Bantuan terbuka."}>
            <Head>
                <title>Saya Butuh Bantuan &mdash; Mode Darurat ResponSetara</title>
                <meta 
                    name="description" 
                    content="Susun pesan pertolongan darurat terstruktur secara inklusif, cepat, dan aman privasi bersama ResponSetara Indonesia." 
                />
            </Head>

            <div className="max-w-4xl mx-auto py-4 sm:py-6">
                <AssistanceMode 
                    initialCategories={initialCategories}
                    initialConditions={initialConditions}
                    initialAssistanceTypes={initialAssistanceTypes}
                    hasError={hasError}
                />
            </div>
        </PublicLayout>
    );
}
