import React from 'react';
import type { EmergencyCategoryItem } from './types';

interface CategorySelectorProps {
    categories: EmergencyCategoryItem[];
    selectedId: number | null;
    onSelect: (id: number) => void;
    error?: string[];
}

export default function CategorySelector({
    categories,
    selectedId,
    onSelect,
    error
}: CategorySelectorProps) {
    return (
        <fieldset id="category-selector-box" aria-invalid={!!error} aria-describedby={error ? "category-error-desc" : undefined} className="space-y-4">
            <legend className="text-lg sm:text-xl font-extrabold text-text-primary pb-1 border-b border-public-border w-full">
                1. Pilih Kategori Kejadian <span className="text-coral-emergency font-bold" aria-hidden="true">*</span>
            </legend>

            {error && (
                <p id="category-error-desc" role="alert" className="text-sm font-bold text-coral-emergency bg-coral-emergency/10 p-3.5 rounded-xl border border-coral-emergency/20">
                    ⚠️ {error.join(' ')}
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((category) => {
                    const isSelected = selectedId === category.id;

                    return (
                        <label
                            key={category.id}
                            className={`min-h-[64px] relative flex items-start space-x-3.5 p-4 rounded-2xl border cursor-pointer transition-all ${
                                isSelected 
                                    ? 'bg-public-selected border-[var(--focus)] shadow-sm text-text-primary' 
                                    : 'bg-[var(--surface)] border-public-border-strong hover:border-[var(--focus)] hover:bg-public-selected text-text-primary'
                            }`}
                        >
                            <input
                                type="radio"
                                name="emergency_category"
                                value={category.id}
                                checked={isSelected}
                                onChange={() => onSelect(category.id)}
                                className="mt-1 h-5 w-5 rounded-full border border-public-border-strong text-teal-primary focus:ring-[3px] focus:ring-teal-primary/30 cursor-pointer"
                                aria-label={`Kategori darurat: ${category.name}`}
                            />
                            <div className="flex-1">
                                <p className="text-base font-extrabold leading-tight">
                                    {category.name}
                                </p>
                                {category.description && (
                                    <p className="mt-1 text-xs sm:text-sm text-text-secondary font-semibold leading-normal">
                                        {category.description}
                                    </p>
                                )}
                            </div>
                            {isSelected && (
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-primary text-white text-xs font-bold shrink-0" aria-hidden="true">
                                    ✓
                                </span>
                            )}
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}
