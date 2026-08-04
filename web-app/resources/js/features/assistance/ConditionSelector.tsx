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
            <div className="flex items-baseline justify-between pb-1 border-b border-public-border">
                <legend className="text-lg sm:text-xl font-extrabold text-text-primary">
                    2. Kondisi Pengguna atau Korban
                </legend>
                <span className="text-xs sm:text-sm font-extrabold text-text-secondary">
                    (Maks. 3 opsi — Terpilih: {selectedIds.length}/3)
                </span>
            </div>

            {error && (
                <p id="condition-error-desc" role="alert" className="text-sm font-bold text-coral-emergency bg-coral-emergency/10 p-3.5 rounded-xl border border-coral-emergency/20">
                    ⚠️ {error.join(' ')}
                </p>
            )}

            {conditions.length === 0 ? (
                <p className="text-sm text-text-secondary font-semibold italic py-2">
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
                                className={`min-h-[52px] relative flex items-center space-x-3.5 px-4 py-3 rounded-xl border transition-all ${
                                    isSelected 
                                        ? 'bg-public-selected border-[var(--focus)] ring-[3px] ring-[var(--focus-ring)] text-text-primary font-extrabold shadow-xs' 
                                        : (isDisabled 
                                            ? 'bg-[var(--surface-soft)] border-[var(--border)] text-[var(--text-muted)] cursor-not-allowed opacity-60' 
                                            : 'bg-[var(--surface)] border-public-border-strong hover:border-[var(--focus)] hover:bg-public-selected text-text-primary cursor-pointer'
                                        )
                                }`}
                            >
                                <input
                                    type="checkbox"
                                    value={condition.id}
                                    checked={isSelected}
                                    disabled={isDisabled}
                                    onChange={() => onToggle(condition.id)}
                                    className="h-5 w-5 rounded border border-public-border-strong text-teal-primary focus:ring-[3px] focus:ring-teal-primary/30 cursor-pointer disabled:cursor-not-allowed"
                                    aria-label={`Kondisi: ${condition.label}`}
                                />
                                <span className="flex-1 text-sm sm:text-base font-extrabold leading-tight">
                                    {condition.label}
                                    {condition.category_id === null && (
                                        <span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-md inline-block ${isSelected ? 'bg-teal-primary text-white' : 'bg-public-surface-muted text-text-secondary border border-public-border'}`}>
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
                <p className="text-xs text-teal-primary font-extrabold mt-1" aria-live="polite">
                    ℹ️ Anda telah memilih batas maksimal 3 kondisi untuk efisiensi komunikasi darurat.
                </p>
            )}
        </fieldset>
    );
}
