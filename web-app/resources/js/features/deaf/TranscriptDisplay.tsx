import React from 'react';

interface TranscriptDisplayProps {
    finalTranscript: string;
    interimTranscript: string;
    characterCount: number;
    characterLimit: number;
    isLimitReached: boolean;
    onEditFinalTranscript?: (text: string) => void;
}

export default function TranscriptDisplay({
    finalTranscript,
    interimTranscript,
    characterCount,
    characterLimit,
    isLimitReached,
    onEditFinalTranscript,
}: TranscriptDisplayProps) {
    const percentage = Math.min(100, Math.round((characterCount / characterLimit) * 100));
    const isNearLimit = percentage >= 85;

    return (
        <section aria-labelledby="transcript-heading" className="rounded-[22px] border border-public-border bg-card p-6 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-public-border pb-3 mb-4">
                <div>
                    <h3 id="transcript-heading" className="text-lg sm:text-xl font-extrabold text-text-primary">
                        Hasil Transkripsi Ucapan
                    </h3>
                    <p className="text-xs sm:text-sm text-text-secondary mt-0.5 font-semibold">
                        Ucapan penolong akan ditampilkan seketika dalam bentuk teks bacaan di bawah ini.
                    </p>
                </div>

                <div
                    id="char-limit-counter"
                    role="status"
                    aria-live="polite"
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full font-extrabold text-xs sm:text-sm border ${
                        isLimitReached
                            ? 'bg-coral-emergency/10 text-coral-emergency border-coral-emergency/20'
                            : (isNearLimit
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : 'bg-[var(--surface-soft)] text-[var(--text-muted)] border-public-border')
                    }`}
                >
                    <span>Karakter: {characterCount} / {characterLimit.toLocaleString('id-ID')}</span>
                    {isLimitReached && <span aria-hidden="true">(Maksimal)</span>}
                </div>
            </div>

            {/* Warning Box When Memory Limit Reached */}
            {isLimitReached && (
                <div role="alert" aria-live="assertive" 
                    className="mb-4 p-3.5 rounded-xl border border-coral-emergency/20 bg-coral-emergency/10 text-coral-emergency text-xs sm:text-sm font-semibold flex items-center gap-2"
                >
                    <span aria-hidden="true" className="text-lg font-bold">🛑</span>
                    <span>
                        Batas kuota memori transkripsi 3.000 karakter telah tercapai demi menjaga kecepatan peramban.
                        Silakan salin pesan atau tekan "Hapus Teks" untuk memulai sesi percakapan baru.
                    </span>
                </div>
            )}

            {/* Transcript Area */}
            <div className="min-h-[220px] max-h-[380px] overflow-y-auto rounded-xl border border-public-border bg-public-surface-muted p-4 font-normal text-base sm:text-lg text-text-primary leading-relaxed focus-within:border-[var(--focus)] focus-within:bg-[var(--surface)] transition-all">
                {finalTranscript || interimTranscript ? (
                    <div className="space-y-3">
                        {finalTranscript && (
                            <div className="space-y-1.5">
                                <label htmlFor="edit-final-transcript-input" className="text-xs font-extrabold text-teal-primary block">
                                    Teks Hasil Akhir (Bisa disunting secara manual):
                                </label>
                                <textarea
                                    id="edit-final-transcript-input"
                                    value={finalTranscript}
                                    onChange={(e) => onEditFinalTranscript?.(e.target.value)}
                                    rows={4}
                                    aria-label="Teks hasil akhir pengenalan suara dan ketikan manual"
                                    className="w-full min-h-[120px] rounded-xl border border-public-border bg-[var(--surface)] p-3.5 text-base sm:text-lg font-extrabold text-text-primary leading-relaxed focus:border-[var(--focus)] focus:outline-none focus:ring-[3px] focus:ring-[var(--focus-ring)] transition-all"
                                />
                            </div>
                        )}

                        {interimTranscript && (
                            <div className="inline-block px-3 py-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-text-primary italic font-semibold shadow-xs">
                                <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-amber-800 uppercase not-italic mr-2">
                                    <span className="inline-block h-2 w-2 rounded-full bg-amber-500 animate-ping" />
                                    [Sedang didengar...]
                                </span>
                                {interimTranscript}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center text-text-muted py-12">
                        <span aria-hidden="true" className="text-4xl mb-2">💬</span>
                        <p className="text-base font-extrabold text-text-primary">
                            Belum ada transkripsi ucapan.
                        </p>
                        <p className="text-xs sm:text-sm text-text-secondary font-semibold mt-1 max-w-sm">
                            Tekan tombol "Mulai Mendengarkan" di bawah, lalu biarkan penolong berbicara ke arah mikrofon perangkat.
                        </p>
                    </div>
                )}
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-text-secondary font-semibold italic">
                <span>*Teks di atas diproses dalam memori sementara peramban dan akan terhapus saat Anda meninggalkan halaman.</span>
            </div>
        </section>
    );
}
