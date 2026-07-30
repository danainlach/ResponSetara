import React from 'react';
import type { AssistanceTypeItem } from './types';

interface AssistanceTypeSelectorProps {
    assistanceTypes: AssistanceTypeItem[];
    selectedIds: number[];
    onToggle: (id: number) => void;
    error?: string[];
}

export default function AssistanceTypeSelector({
    assistanceTypes,
    selectedIds,
    onToggle,
    error
}: AssistanceTypeSelectorProps) {
    const isMaxReached = selectedIds.length >= 3;

    return (
        <fieldset aria-invalid={!!error} aria-describedby={error ? "assistance-error-desc" : undefined} className="space-y-4 pt-4">
            <div className="flex items-baseline justify-between pb-1 border-b border-slate-200">
                <legend className="text-lg sm:text-xl font-extrabold text-navy-900">
                    3. Bantuan yang Dibutuhkan
                </legend>
                <span className="text-xs sm:text-sm font-semibold text-ink-600">
                    (Maks. 3 opsi — Terpilih: {selectedIds.length}/3)
                </span>
            </div>

            {error && (
                <p id="assistance-error-desc" role="alert" className="text-sm font-bold text-coral-600 bg-coral-50 p-3 rounded-lg border border-coral-600/30">
                    ⚠️ {error.join(' ')}
                </p>
            )}

            {assistanceTypes.length === 0 ? (
                <p className="text-sm text-ink-600 italic py-2">
                    Daftar jenis bantuan darurat akan menyesuaikan dengan kategori yang dipilih.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {assistanceTypes.map((item) => {
                        const isSelected = selectedIds.includes(item.id);
                        const isDisabled = !isSelected && isMaxReached;

                        return (
                            <label
                                key={item.id}
                                className={`min-h-[52px] relative flex items-center space-x-3.5 px-4 py-3 rounded-xl border-2 transition-colors ${
                                    isSelected 
                                        ? 'bg-teal-700 border-teal-700 text-white shadow-xs' 
                                        : (isDisabled 
                                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60' 
                                            : 'bg-white border-slate-200 hover:border-slate-300 text-ink-900 cursor-pointer'
                                        )
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    value={item.id}
                                    checked={isSelected}
                                    disabled={isDisabled}
                                    onChange={() => onToggle(item.id)}
                                    className="h-5 w-5 rounded border-2 border-slate-400 text-navy-900 focus:ring-4 focus:ring-navy-900/50 cursor-pointer disabled:cursor-not-allowed"
                                    aria-label={`Bantuan: ${item.label}`}
                                />
                                <span className="flex-1 text-sm sm:text-base font-medium leading-tight">
                                    {item.label}
                                    {item.category_id === null && (
                                        <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-md inline-block ${isSelected ? 'bg-teal-800 text-white' : 'bg-slate-200 text-ink-600'}`}>
                                            Umum
                                        </span>
                                    )}
                                </span>
                            </label>
                        );
                    })}
                </div>
            )}
            {isMaxReached && (
                <p className="text-xs text-teal-700 font-bold mt-1" aria-live="polite">
                    ℹ️ Anda telah memilih batas maksimal 3 jenis bantuan darurat.
                </p>
            )}
        </fieldset>
    );
}
