import React from 'react';
import type { EmergencyConditionItem } from './types';

interface ConditionSelectorProps {
    conditions: EmergencyConditionItem[];
    selectedIds: number[];
    onToggle: (id: number) => void;
    error?: string[];
}

export default function ConditionSelector({
    conditions,
    selectedIds,
    onToggle,
    error
}: ConditionSelectorProps) {
    const isMaxReached = selectedIds.length >= 3;

    return (
        <fieldset aria-invalid={!!error} aria-describedby={error ? "condition-error-desc" : undefined} className="space-y-4 pt-4">
            <div className="flex items-baseline justify-between pb-1 border-b border-slate-200">
                <legend className="text-lg sm:text-xl font-extrabold text-navy-900">
                    2. Kondisi Pengguna atau Korban
                </legend>
                <span className="text-xs sm:text-sm font-semibold text-ink-600">
                    (Maks. 3 opsi — Terpilih: {selectedIds.length}/3)
                </span>
            </div>

            {error && (
                <p id="condition-error-desc" role="alert" className="text-sm font-bold text-coral-600 bg-coral-50 p-3 rounded-lg border border-coral-600/30">
                    ⚠️ {error.join(' ')}
                </p>
            )}

            {conditions.length === 0 ? (
                <p className="text-sm text-ink-600 italic py-2">
                    Pilih kategori di atas untuk melihat spesifik kondisi medis atau ketersambungan umum.
                </p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {conditions.map((condition) => {
                        const isSelected = selectedIds.includes(condition.id);
                        const isDisabled = !isSelected && isMaxReached;

                        return (
                            <label
                                key={condition.id}
                                className={`min-h-[52px] relative flex items-center space-x-3.5 px-4 py-3 rounded-xl border-2 transition-colors ${
                                    isSelected 
                                        ? 'bg-navy-900 border-navy-900 text-white shadow-xs' 
                                        : (isDisabled 
                                            ? 'bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed opacity-60' 
                                            : 'bg-white border-slate-200 hover:border-slate-300 text-ink-900 cursor-pointer'
                                        )
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    value={condition.id}
                                    checked={isSelected}
                                    disabled={isDisabled}
                                    onChange={() => onToggle(condition.id)}
                                    className="h-5 w-5 rounded border-2 border-slate-400 text-teal-700 focus:ring-4 focus:ring-teal-500 cursor-pointer disabled:cursor-not-allowed"
                                    aria-label={`Kondisi: ${condition.label}`}
                                />
                                <span className="flex-1 text-sm sm:text-base font-medium leading-tight">
                                    {condition.label}
                                    {condition.category_id === null && (
                                        <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-md inline-block ${isSelected ? 'bg-navy-800 text-teal-50' : 'bg-slate-200 text-ink-600'}`}>
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
                    ℹ️ Anda telah memilih batas maksimal 3 kondisi untuk efisiensi komunikasi darurat.
                </p>
            )}
        </fieldset>
    );
}
