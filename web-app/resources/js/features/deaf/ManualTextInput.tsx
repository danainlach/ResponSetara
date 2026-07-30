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
        <section aria-labelledby="manual-input-heading" className="rounded-2xl border-2 border-slate-300 bg-white p-4 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div>
                    <h3 id="manual-input-heading" className="text-base sm:text-lg font-bold text-navy-900">
                        Input Teks Manual (Alternatif Tanpa Mikrofon)
                    </h3>
                    <p className="text-xs sm:text-sm text-ink-600">
                        Dapat digunakan jika pengenalan suara tidak tersedia, lingkungan bising, atau izin mikrofon ditolak.
                    </p>
                </div>
            </div>

            <div className="mt-3 space-y-2">
                <label htmlFor="manual-fallback-textarea" className="font-semibold text-sm sm:text-base text-navy-900 block">
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
                    placeholder="Contoh: Apakah ada tempat yang teras sakit? Kami akan bantu memanggil dokter..."
                    aria-label="Ketik pesan untuk pengguna tuli atau darurat"
                    className="w-full rounded-xl border-2 border-slate-300 p-3 text-sm sm:text-base text-ink-900 font-medium placeholder:text-slate-400 focus:border-teal-700 focus:outline-none focus:ring-4 focus:ring-teal-500/20 disabled:bg-slate-100 disabled:text-slate-500 transition-colors"
                />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <span className="text-xs text-ink-600 font-semibold">
                        Karakter masukan manual: {charCount} / {characterLimit}
                    </span>

                    <button
                        type="button"
                        onClick={onSubmit}
                        disabled={!value.trim() || isLimitReached}
                        className="min-h-[44px] px-5 py-2.5 rounded-xl bg-teal-700 text-white font-extrabold text-sm hover:bg-teal-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                    >
                        <span>Tambahkan ke Teks Bacaan ➔</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
