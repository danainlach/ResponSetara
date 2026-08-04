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
                    className="inline-flex items-center font-extrabold text-sm sm:text-base text-teal-primary hover:text-teal-hover focus:outline-none focus:underline transition-colors duration-200"
                >
                    &larr; Kembali ke Beranda
                </a>
                <span className="text-xs font-semibold text-text-secondary hidden sm:inline-block">
                    ⚡ Mode Tanpa Retensi Data (Zero Storage)
                </span>
            </div>

            <div className="rounded-[22px] bg-card border border-public-border p-6 sm:p-8 shadow-card space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
                    Susun &amp; Bagikan Pesan Darurat
                </h1>
                <p className="text-sm sm:text-base text-text-secondary font-semibold leading-relaxed">
                    ResponSetara membantu menyusun dan menyampaikan informasi kepada orang di sekitar atau melalui aplikasi komunikasi pilihan Anda. ResponSetara tidak mengirim laporan otomatis ke layanan darurat.
                </p>
            </div>

            {hasError && (
                <div role="alert" className="p-4 rounded-2xl bg-coral-emergency/10 border border-coral-emergency/20 text-coral-emergency font-bold text-sm">
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
                    <div className="p-5 rounded-2xl bg-public-surface-muted border border-public-border text-center text-text-secondary text-sm font-semibold">
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
