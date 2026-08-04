import React from 'react';
import type { SpeechRate } from './types';

interface SpeechRateSelectorProps {
    currentRate: SpeechRate;
    isSupported: boolean;
    onSelectRate: (rate: SpeechRate) => void;
}

const RATES: { label: string; value: SpeechRate; ariaLabel: string }[] = [
    { label: '0.75x Lambat', value: 0.75, ariaLabel: 'Atur kecepatan suara 0.75x lebih lambat' },
    { label: '1.0x Normal', value: 1.0, ariaLabel: 'Atur kecepatan suara 1.0x normal' },
    { label: '1.25x Cepat', value: 1.25, ariaLabel: 'Atur kecepatan suara 1.25x lebih cepat' },
    { label: '1.5x Sangat Cepat', value: 1.5, ariaLabel: 'Atur kecepatan suara 1.5x sangat cepat' },
];

export default function SpeechRateSelector({
    currentRate,
    isSupported,
    onSelectRate,
}: SpeechRateSelectorProps) {
    if (!isSupported) {
        return null;
    }

    return (
        <fieldset className="space-y-2">
            <legend className="text-sm sm:text-base font-extrabold text-text-primary">
                Kecepatan Baca Suara (Rate)
            </legend>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3" role="radiogroup" aria-label="Kecepatan Baca Suara">
                {RATES.map((rate) => {
                    const isSelected = currentRate === rate.value;

                    return (
                        <button
                            key={rate.value}
                            type="button"
                            role="radio"
                            aria-checked={isSelected}
                            aria-label={rate.ariaLabel}
                            onClick={() => onSelectRate(rate.value)}
                            className={`min-h-[44px] min-w-[44px] rounded-xl px-3 py-2 text-xs sm:text-sm font-extrabold transition-colors focus:outline-none focus-visible:ring-[3px] focus-visible:ring-teal-primary/30 shadow-2xs ${
                                isSelected
                                    ? 'bg-teal-primary text-white border border-teal-primary shadow-sm'
                                    : 'bg-[var(--surface)] text-text-primary border border-public-border-strong hover:border-[var(--focus)] hover:bg-public-selected'
                            }`}
                        >
                            {rate.label}
                        </button>
                    );
                })}
            </div>
        </fieldset>
    );
}
