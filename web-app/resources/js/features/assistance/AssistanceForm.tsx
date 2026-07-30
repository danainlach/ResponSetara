import React from 'react';
import type { EmergencyCategoryItem, EmergencyConditionItem, AssistanceTypeItem, GeoStatus } from './types';
import CategorySelector from './CategorySelector';
import ConditionSelector from './ConditionSelector';
import AssistanceTypeSelector from './AssistanceTypeSelector';
import LocationField from './LocationField';
import AdditionalInformationField from './AdditionalInformationField';

interface AssistanceFormProps {
    categories: EmergencyCategoryItem[];
    conditions: EmergencyConditionItem[];
    assistanceTypes: AssistanceTypeItem[];
    selectedCategoryId: number | null;
    selectedConditionIds: number[];
    selectedAssistanceIds: number[];
    locationText: string;
    latitude: number | null;
    longitude: number | null;
    includeCoordinates: boolean;
    additionalInfo: string;
    useAi: boolean;
    aiConsent: boolean;
    isSubmitting: boolean;
    geoStatus: GeoStatus;
    validationErrors: Record<string, string[]>;
    onSelectCategory: (id: number) => void;
    onToggleCondition: (id: number) => void;
    onToggleAssistance: (id: number) => void;
    onLocationTextChange: (text: string) => void;
    onAdditionalInfoChange: (text: string) => void;
    onToggleUseAi: (checked: boolean) => void;
    onToggleAiConsent: (checked: boolean) => void;
    onSearchGeo: () => void;
    onSubmit: () => void;
}

export default function AssistanceForm({
    categories,
    conditions,
    assistanceTypes,
    selectedCategoryId,
    selectedConditionIds,
    selectedAssistanceIds,
    locationText,
    latitude,
    longitude,
    includeCoordinates,
    additionalInfo,
    useAi,
    aiConsent,
    isSubmitting,
    geoStatus,
    validationErrors,
    onSelectCategory,
    onToggleCondition,
    onToggleAssistance,
    onLocationTextChange,
    onAdditionalInfoChange,
    onToggleUseAi,
    onToggleAiConsent,
    onSearchGeo,
    onSubmit,
}: AssistanceFormProps) {
    const errorCount = Object.keys(validationErrors).length;

    return (
        <form 
            onSubmit={(e) => {
 e.preventDefault(); onSubmit(); 
}} 
            noValidate
            className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 lg:p-10 shadow-lg space-y-8"
        >
            <div className="border-b border-slate-200 pb-4">
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-900 tracking-tight">
                    Mode Komunikasi Darurat: Saya Butuh Bantuan
                </h1>
                <p className="mt-2 text-base sm:text-lg text-ink-600 leading-relaxed">
                    Susun pesan keterangan darurat Anda secara jernih dan tepat saji dalam hitungan detik tanpa perlu pendaftaran akun.
                </p>
            </div>

            {/* Accessible Error Summary Block (Receives Focus on Failure) */}
            {errorCount > 0 && (
                <div 
                    id="error-summary-box" 
                    tabIndex={-1} 
                    role="alert" 
                    aria-label="Ringkasan kesalahan validasi formulir"
                    className="rounded-2xl border-2 border-coral-600 bg-coral-50 p-5 shadow-md outline-none space-y-2"
                >
                    <h2 className="text-lg font-bold text-coral-700 flex items-center">
                        <span aria-hidden="true" className="mr-2">⚠️</span>
                        <span>Terdapat {errorCount} bagian yang memerlukan perhatian Anda:</span>
                    </h2>
                    <ul className="list-disc pl-6 space-y-1 text-sm sm:text-base font-bold text-ink-900">
                        {Object.entries(validationErrors).map(([key, messages]) => (
                            <li key={key}>
                                {messages.join(' ')}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 1. Emergency Category Selector */}
            <CategorySelector 
                categories={categories}
                selectedId={selectedCategoryId}
                onSelect={onSelectCategory}
                error={validationErrors['category_id']}
            />

            {/* 2. Condition Selector (Filtered by category, max 3) */}
            <ConditionSelector 
                conditions={conditions}
                selectedIds={selectedConditionIds}
                onToggle={onToggleCondition}
                error={validationErrors['condition_ids']}
            />

            {/* 3. Assistance Types Selector (Filtered by category, max 3) */}
            <AssistanceTypeSelector 
                assistanceTypes={assistanceTypes}
                selectedIds={selectedAssistanceIds}
                onToggle={onToggleAssistance}
                error={validationErrors['assistance_type_ids']}
            />

            {/* 4. Location Hybrid Field (Manual + Geolocation without Reverse Geocode) */}
            <LocationField 
                manualText={locationText}
                onManualTextChange={onLocationTextChange}
                onSearchGeo={onSearchGeo}
                geoStatus={geoStatus}
                latitude={latitude}
                longitude={longitude}
                includeCoordinates={includeCoordinates}
                error={validationErrors['location.manual_text'] || validationErrors['location.latitude'] || validationErrors['location']}
            />

            {/* 5. Additional Information Textarea (Max 300 chars) */}
            <AdditionalInformationField 
                value={additionalInfo}
                onChange={onAdditionalInfoChange}
                error={validationErrors['additional_information']}
            />

            {/* 5.5. AI Opt-in and Explicit Consent Checkboxes */}
            <div className="rounded-3xl bg-indigo-50/70 p-6 border-2 border-indigo-200 space-y-4">
                <div className="flex items-start space-x-3.5">
                    <input
                        type="checkbox"
                        id="use-ai-toggle"
                        checked={useAi}
                        onChange={(e) => onToggleUseAi(e.target.checked)}
                        disabled={isSubmitting}
                        className="mt-1 h-6 w-6 shrink-0 rounded-lg border-2 border-indigo-600 text-indigo-600 focus:ring-4 focus:ring-indigo-300 transition-transform active:scale-95 cursor-pointer"
                    />
                    <label htmlFor="use-ai-toggle" className="cursor-pointer space-y-1">
                        <span className="block text-lg font-extrabold text-navy-900">
                            ✨ Rapikan pesan dengan AI (opsional)
                        </span>
                        <span className="block text-sm font-semibold text-ink-600 leading-normal">
                            Merapikan tata bahasa agar susunan kalimat lebih santun, formal, dan mudah dipahami aparat berwenang atau petugas medis. Fitur ini sepenuhnya opsional.
                        </span>
                    </label>
                </div>

                {useAi && (
                    <div className="pl-9 pt-3 border-t border-indigo-200/80 animate-fadeIn transition-all">
                        <div className="flex items-start space-x-3.5 p-4 rounded-2xl bg-white border border-indigo-200 shadow-xs">
                            <input
                                type="checkbox"
                                id="ai-consent-checkbox"
                                checked={aiConsent}
                                onChange={(e) => onToggleAiConsent(e.target.checked)}
                                disabled={isSubmitting}
                                className="mt-0.5 h-5 w-5 shrink-0 rounded-md border-2 border-indigo-600 text-indigo-600 focus:ring-4 focus:ring-indigo-300 transition-transform active:scale-95 cursor-pointer"
                            />
                            <label htmlFor="ai-consent-checkbox" className="cursor-pointer text-xs sm:text-sm font-bold text-navy-900 leading-relaxed">
                                <span className="text-coral-600 font-black mr-1">[Wajib]</span>
                                Saya setuju informasi kedaruratan umum dikirim ke penyedia AI tanpa menyertakan lokasi GPS maupun catatan sensitif saya, serta memahami bahwa hasil dirilis di bawah filter keamanan otomatis sistem.
                            </label>
                        </div>
                        {validationErrors['ai_consent'] && (
                            <p className="mt-2 text-xs sm:text-sm font-extrabold text-coral-600">
                                ⚠️ {validationErrors['ai_consent'][0]}
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* 6. Mandatory Privacy Notice before Submit Button */}
            <div className="rounded-2xl bg-teal-50 p-5 border-2 border-teal-700/30 text-center space-y-1 my-6">
                <p className="text-base sm:text-lg font-extrabold text-navy-900">
                    🔒 Informasi hanya digunakan untuk menyusun pesan dan tidak disimpan oleh ResponSetara.
                </p>
                <p className="text-xs sm:text-sm text-ink-600 font-semibold">
                    Koneksi Anda dilindungi enkripsi aman. ResponSetara beroperasi mandiri di browser tanpa pencetakan log pribadi maupun analitik pelacakan.
                </p>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full min-h-[56px] inline-flex items-center justify-center rounded-2xl bg-coral-600 px-8 py-4 text-lg sm:text-xl font-extrabold text-white shadow-lg hover:bg-coral-600/90 focus:outline-none focus-visible:ring-4 focus-visible:ring-coral-600/50 disabled:opacity-50 transition-transform active:scale-[0.99] motion-reduce:transition-none"
                >
                    {isSubmitting ? (
                        <span className="flex items-center">
                            <span className="animate-spin text-2xl mr-3">⏳</span>
                            <span>Sedang Menyusun Pesan...</span>
                        </span>
                    ) : (
                        <span>Susun Pesan Bantuan Sekarang ➔</span>
                    )}
                </button>
            </div>
        </form>
    );
}
