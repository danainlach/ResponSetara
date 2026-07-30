import React from 'react';
import LiveAnnouncer from '../../components/accessibility/LiveAnnouncer';
import type { EmergencyCategoryItem, EmergencyConditionItem, AssistanceTypeItem } from './types';
import { useAssistanceForm } from './useAssistanceForm';
import AssistanceForm from './AssistanceForm';
import MessagePreview from './MessagePreview';

interface AssistanceModeProps {
    initialCategories: EmergencyCategoryItem[];
    initialConditions: EmergencyConditionItem[];
    initialAssistanceTypes: AssistanceTypeItem[];
    hasError?: boolean;
}

export default function AssistanceMode({
    initialCategories,
    initialConditions,
    initialAssistanceTypes,
    hasError = false
}: AssistanceModeProps) {
    const {
        selectedCategoryId,
        selectedConditionIds,
        selectedAssistanceIds,
        locationText,
        includeCoordinates,
        latitude,
        longitude,
        additionalInfo,
        useAi,
        aiConsent,
        isSubmitting,
        composedResult,
        geoStatus,
        validationErrors,
        announcement,
        availableConditions,
        availableAssistanceTypes,
        handleSelectCategory,
        handleToggleCondition,
        handleToggleAssistance,
        handleLocationTextChange,
        handleAdditionalInfoChange,
        handleToggleUseAi,
        handleToggleAiConsent,
        requestGeolocation,
        handleSubmit,
        resetForm,
        handleEditInformation,
        handleSwitchVersion,
    } = useAssistanceForm({
        categories: initialCategories,
        conditions: initialConditions,
        assistanceTypes: initialAssistanceTypes,
    });

    return (
        <div className="space-y-8">
            <LiveAnnouncer message={announcement} ariaLive="polite" />

            {/* Back to Home navigation header */}
            <div className="flex items-center justify-between">
                <a
                    href="/"
                    className="inline-flex items-center font-extrabold text-sm sm:text-base text-teal-700 hover:text-teal-800 focus:outline-none focus:underline"
                >
                    &larr; Kembali ke Beranda
                </a>
                <span className="text-xs font-semibold text-ink-600 hidden sm:inline-block">
                    ⚡ Mode Tanpa Retensi Data (Zero Storage)
                </span>
            </div>

            <div className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
                    Susun &amp; Bagikan Pesan Darurat
                </h1>
                <p className="text-sm sm:text-base text-ink-600 font-semibold leading-relaxed">
                    ResponSetara membantu menyusun dan menyampaikan informasi kepada orang di sekitar atau melalui aplikasi komunikasi pilihan Anda. ResponSetara tidak mengirim laporan otomatis ke layanan darurat.
                </p>
            </div>

            {hasError && (
                <div role="alert" className="p-4 rounded-2xl bg-coral-50 border border-coral-600/30 text-ink-900 font-bold text-sm">
                    ⚠️ Terjadi kendala memuat sebagian data referensi online. Sistem tetap beroperasi menggunakan data cadangan aman.
                </div>
            )}

            {/* Display composed message preview when available, with easy edit return */}
            {composedResult ? (
                <div className="space-y-6">
                    <MessagePreview 
                        result={composedResult}
                        onEdit={handleEditInformation}
                        onReset={resetForm}
                        onSwitchVersion={handleSwitchVersion}
                    />
                    <div className="p-5 rounded-2xl bg-slate-200 text-center text-ink-600 text-sm font-semibold">
                        Ingin mendaftarkan kondisi yang berbeda? Klik &ldquo;Ubah Informasi&rdquo; di atas untuk menyesuaikan formulir tanpa menghapus teks yang telah Anda pilih.
                    </div>
                </div>
            ) : (
                <AssistanceForm 
                    categories={initialCategories}
                    conditions={availableConditions}
                    assistanceTypes={availableAssistanceTypes}
                    selectedCategoryId={selectedCategoryId}
                    selectedConditionIds={selectedConditionIds}
                    selectedAssistanceIds={selectedAssistanceIds}
                    locationText={locationText}
                    latitude={latitude}
                    longitude={longitude}
                    includeCoordinates={includeCoordinates}
                    additionalInfo={additionalInfo}
                    useAi={useAi}
                    aiConsent={aiConsent}
                    isSubmitting={isSubmitting}
                    geoStatus={geoStatus}
                    validationErrors={validationErrors}
                    onSelectCategory={handleSelectCategory}
                    onToggleCondition={handleToggleCondition}
                    onToggleAssistance={handleToggleAssistance}
                    onLocationTextChange={handleLocationTextChange}
                    onAdditionalInfoChange={handleAdditionalInfoChange}
                    onToggleUseAi={handleToggleUseAi}
                    onToggleAiConsent={handleToggleAiConsent}
                    onSearchGeo={requestGeolocation}
                    onSubmit={handleSubmit}
                />
            )}
        </div>
    );
}
