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
            <legend className="text-lg sm:text-xl font-extrabold text-navy-900 pb-1 border-b border-slate-200 w-full">
                1. Pilih Kategori Kejadian <span className="text-coral-600 font-bold" aria-hidden="true">*</span>
            </legend>

            {error && (
                <p id="category-error-desc" role="alert" className="text-sm font-bold text-coral-600 bg-coral-50 p-3 rounded-lg border border-coral-600/30">
                    ⚠️ {error.join(' ')}
                </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categories.map((category) => {
                    const isSelected = selectedId === category.id;

                    return (
                        <label
                            key={category.id}
                            className={`min-h-[64px] relative flex items-start space-x-3.5 p-4 rounded-2xl border-2 cursor-pointer transition-colors ${
                                isSelected 
                                    ? 'bg-teal-50 border-teal-700 shadow-md text-navy-900' 
                                    : 'bg-white border-slate-200 hover:border-slate-300 text-ink-900'
                            }`}
                        >
                            <input
                                type="radio"
                                name="emergency_category"
                                value={category.id}
                                checked={isSelected}
                                onChange={() => onSelect(category.id)}
                                className="mt-1 h-5 w-5 rounded-full border-2 border-navy-800 text-teal-700 focus:ring-4 focus:ring-teal-500 cursor-pointer"
                                aria-label={`Kategori darurat: ${category.name}`}
                            />
                            <div className="flex-1">
                                <p className="text-base font-bold leading-tight">
                                    {category.name}
                                </p>
                                {category.description && (
                                    <p className="mt-1 text-xs sm:text-sm text-ink-600 leading-normal">
                                        {category.description}
                                    </p>
                                )}
                            </div>
                            {isSelected && (
                                <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-teal-700 text-white text-xs font-bold" aria-hidden="true">
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
