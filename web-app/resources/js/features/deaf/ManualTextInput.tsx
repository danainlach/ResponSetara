import React from 'react';

interface ManualTextInputProps {
    value: string;
    onChange: (text: string) => void;
    onSubmit: () => void;
    isLimitReached: boolean;
    characterLimit: number;
}

export default function ManualTextInput({
    value,
    onChange,
    onSubmit,
    isLimitReached,
    characterLimit,
}: ManualTextInputProps) {
    const charCount = value.length;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            onSubmit();
        }
    };

    return (
        <section aria-labelledby="manual-input-heading" className="rounded-[22px] border border-public-border bg-card p-6 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2 border-b border-public-border pb-3">
                <div>
                    <h3 id="manual-input-heading" className="text-base sm:text-lg font-extrabold text-text-primary">
                        Input Teks Manual (Alternatif Tanpa Mikrofon)
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary font-semibold">
                        Dapat digunakan jika pengenalan suara tidak tersedia, lingkungan bising, atau izin mikrofon ditolak.
                    </p>
                </div>
            </div>

            <div className="mt-3 space-y-2">
                <label htmlFor="manual-fallback-textarea" className="font-extrabold text-sm sm:text-base text-text-primary block">
                    Ketik pesan untuk pengguna
                </label>

                <textarea
                    id="manual-fallback-textarea"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={isLimitReached}
                    maxLength={characterLimit}
                    rows={3}
                    placeholder="Contoh: Apakah ada tempat yang terasa sakit? Kami akan bantu memanggil dokter..."
                    aria-label="Ketik pesan untuk pengguna tuli atau darurat"
                    className="w-full rounded-xl border border-public-border bg-[var(--surface)] p-3.5 text-sm sm:text-base text-text-primary font-bold placeholder:text-[var(--text-muted)] focus:border-[var(--focus)] focus:outline-none focus:ring-[3px] focus:ring-[var(--focus-ring)] disabled:bg-[var(--surface-soft)] disabled:text-[var(--text-muted)] transition-all"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <span className="text-xs text-text-secondary font-semibold">
                        Karakter masukan manual: {charCount} / {characterLimit}
                    </span>

                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={!value.trim() || isLimitReached}
                        className="min-h-[44px] px-5 py-2.5 rounded-xl bg-teal-primary text-white font-extrabold text-sm hover:bg-teal-hover focus:outline-none focus-visible:ring-[3px] focus-visible:ring-teal-primary/30 disabled:bg-[var(--surface-soft)] disabled:text-[var(--text-muted)] disabled:opacity-100 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                    >
                        <span>Tambahkan ke Teks Bacaan ➔</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
