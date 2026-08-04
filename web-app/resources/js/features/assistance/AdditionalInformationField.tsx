import React from 'react';

interface AdditionalInformationFieldProps {
    value: string;
    onChange: (text: string) => void;
    error?: string[];
}

export default function AdditionalInformationField({
    value,
    onChange,
    error
}: AdditionalInformationFieldProps) {
    const maxLength = 300;
    const charsRemaining = maxLength - value.length;

    return (
        <fieldset aria-invalid={!!error} aria-describedby={error ? "addinfo-error-desc" : "char-count-desc"} className="space-y-3 pt-4">
            <div className="flex items-baseline justify-between pb-1 border-b border-public-border">
                <legend className="text-lg sm:text-xl font-extrabold text-text-primary">
                    5. Informasi Tambahan <span className="text-xs sm:text-sm font-extrabold text-text-secondary">(Opsional)</span>
                </legend>
                <span id="char-count-desc" aria-live="polite" aria-atomic="true" className={`text-xs sm:text-sm font-extrabold ${charsRemaining < 20 ? 'text-coral-emergency' : 'text-text-secondary'}`}>
                    Sisa karakter: {charsRemaining} / {maxLength}
                </span>
            </div>

            {error && (
                <p id="addinfo-error-desc" role="alert" className="text-sm font-bold text-coral-emergency bg-coral-emergency/10 p-3.5 rounded-xl border border-coral-emergency/20">
                    ⚠️ {error.join(' ')}
                </p>
            )}

            <div>
                <textarea
                    id="additional-info-textarea"
                    rows={3}
                    maxLength={maxLength}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="Contoh: Korban berumur 65 tahun dan membutuhkan kursi roda, atau saya bersama 2 rekan di lokasi..."
                    className="w-full rounded-xl border border-public-border bg-[var(--surface)] p-4 text-base text-text-primary placeholder:text-public-text-muted focus:border-[var(--focus)] focus:outline-none focus:ring-[3px] focus:ring-[var(--focus-ring)] transition-all leading-relaxed resize-y"
                    aria-label="Informasi tambahan mengenai kondisi atau pertolongan spesifik"
                />
                <p className="text-xs text-text-secondary font-semibold mt-1.5">
                    Hanya cantumkan keterangan yang membantu penolong memahami situasi secara cepat.
                </p>
            </div>
        </fieldset>
    );
}
