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
            <div className="flex items-baseline justify-between pb-1 border-b border-public-border">
                <legend className="text-lg sm:text-xl font-extrabold text-text-primary">
                    3. Bantuan yang Dibutuhkan
                </legend>
                <span className="text-xs sm:text-sm font-extrabold text-text-secondary">
                    (Maks. 3 opsi — Terpilih: {selectedIds.length}/3)
                </span>
            </div>

            {error && (
                <p id="assistance-error-desc" role="alert" className="text-sm font-bold text-coral-emergency bg-coral-emergency/10 p-3.5 rounded-xl border border-coral-emergency/20">
                    ⚠️ {error.join(' ')}
                </p>
            )}

            {assistanceTypes.length === 0 ? (
                <p className="text-sm text-text-secondary font-semibold italic py-2">
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
                                    value={item.id}
                                    checked={isSelected}
                                    disabled={isDisabled}
                                    onChange={() => onToggle(item.id)}
                                    className="h-5 w-5 rounded border border-public-border-strong text-teal-primary focus:ring-[3px] focus:ring-teal-primary/30 cursor-pointer disabled:cursor-not-allowed"
                                    aria-label={`Bantuan: ${item.label}`}
                                />
                                <span className="flex-1 text-sm sm:text-base font-extrabold leading-tight">
                                    {item.label}
                                    {item.category_id === null && (
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
                    ℹ️ Anda telah memilih batas maksimal 3 jenis bantuan darurat.
                </p>
            )}
        </fieldset>
    );
}
