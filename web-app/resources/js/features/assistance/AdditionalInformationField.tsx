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
            <div className="flex items-baseline justify-between pb-1 border-b border-slate-200">
                <legend className="text-lg sm:text-xl font-extrabold text-navy-900">
                    5. Informasi Tambahan <span className="text-xs sm:text-sm font-normal text-ink-600">(Opsional)</span>
                </legend>
                <span id="char-count-desc" aria-live="polite" aria-atomic="true" className={`text-xs sm:text-sm font-semibold ${charsRemaining < 20 ? 'text-coral-600 font-bold' : 'text-ink-600'}`}>
                    Sisa karakter: {charsRemaining} / {maxLength}
                </span>
            </div>

            {error && (
                <p id="addinfo-error-desc" role="alert" className="text-sm font-bold text-coral-600 bg-coral-50 p-3 rounded-lg border border-coral-600/30">
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
                    className="w-full rounded-xl border-2 border-slate-300 bg-white p-4 text-base text-ink-900 placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-colors leading-relaxed resize-y"
                    aria-label="Informasi tambahan mengenai kondisi atau pertolongan spesifik"
                />
                <p className="text-xs text-ink-600 mt-1.5">
                    Hanya cantumkan keterangan yang membantu penolong memahami situasi secara cepat.
                </p>
            </div>
        </fieldset>
    );
}
