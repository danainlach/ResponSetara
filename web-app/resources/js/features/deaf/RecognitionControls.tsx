import React from 'react';
import type { RecognitionStateStatus } from './types';

interface RecognitionControlsProps {
    status: RecognitionStateStatus;
    isSupported: boolean;
    isListening: boolean;
    isLimitReached: boolean;
    hasText: boolean;
    isCopying: boolean;
    copyFeedback: string | null;
    onStart: () => void;
    onStop: () => void;
    onClear: () => void;
    onCopy: () => void;
    onShowLargeText: () => void;
}

export default function RecognitionControls({
    status,
    isSupported,
    isListening,
    isLimitReached,
    hasText,
    isCopying,
    copyFeedback,
    onStart,
    onStop,
    onClear,
    onCopy,
    onShowLargeText,
}: RecognitionControlsProps) {
    const isStoppedOrError = status === 'stopped' || status === 'error';

    return (
        <section aria-labelledby="controls-heading" className="rounded-[22px] border border-public-border bg-card p-6 shadow-card">
            <h3 id="controls-heading" className="text-base sm:text-lg font-extrabold text-text-primary mb-3">
                Kontrol Pengenalan Suara
            </h3>

            <div className="flex flex-wrap items-center gap-3">
                {/* Main Microphone Action Button */}
                {!isListening ? (
                    <button
                        type="button"
                        onClick={onStart}
                        disabled={!isSupported || isLimitReached}
                        aria-label={isStoppedOrError ? "Dengarkan Lagi ucapan penolong" : "Mulai Mendengarkan ucapan penolong melalui mikrofon"}
                        className="min-h-[48px] px-5 py-2.5 rounded-xl bg-teal-primary text-white font-extrabold text-sm sm:text-base shadow-md hover:bg-teal-hover focus:outline-none focus-visible:ring-[3px] focus-visible:ring-teal-primary/30 disabled:bg-[var(--surface-soft)] disabled:text-[var(--text-muted)] disabled:opacity-100 disabled:cursor-not-allowed transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <span aria-hidden="true">🎙️</span>
                        <span>{isStoppedOrError ? 'Dengarkan Lagi' : 'Mulai Mendengarkan'}</span>
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onStop}
                        aria-label="Berhentikan proses mendengarkan suara"
                        className="min-h-[48px] px-5 py-2.5 rounded-xl bg-coral-emergency text-white font-extrabold text-sm sm:text-base shadow-md hover:bg-coral-hover focus:outline-none focus-visible:ring-[3px] focus-visible:ring-coral-emergency/30 transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <span aria-hidden="true">⏹️</span>
                        <span>Berhenti</span>
                    </button>
                )}

                {/* Show Large Text Action */}
                <button
                    type="button"
                    onClick={onShowLargeText}
                    disabled={!hasText}
                    aria-label="Tampilkan hasil transkripsi dalam mode teks besar kontras tinggi"
                    className="min-h-[48px] px-4 py-2.5 rounded-xl border border-public-border-strong bg-[var(--surface)] text-text-primary font-extrabold text-sm sm:text-base hover:bg-public-selected hover:border-[var(--focus)] focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--focus-ring)] disabled:opacity-100 disabled:border-[var(--border)] disabled:text-[var(--text-muted)] disabled:bg-[var(--surface-soft)] disabled:cursor-not-allowed transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                >
                    <span aria-hidden="true">🔍</span>
                    <span>Teks Besar</span>
                </button>

                {/* Copy to Clipboard */}
                <button
                    type="button"
                    onClick={onCopy}
                    disabled={!hasText || isCopying}
                    aria-label="Salin seluruh teks hasil transkripsi dan input manual ke clipboard"
                    className="min-h-[48px] px-4 py-2.5 rounded-xl border border-public-border-strong bg-[var(--surface)] text-text-primary font-extrabold text-sm sm:text-base hover:bg-public-selected hover:border-[var(--focus)] focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--focus-ring)] disabled:opacity-100 disabled:border-[var(--border)] disabled:text-[var(--text-muted)] disabled:bg-[var(--surface-soft)] disabled:cursor-not-allowed transition-all flex items-center gap-2 hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                >
                    <span aria-hidden="true">{copyFeedback ? '✅' : '📋'}</span>
                    <span>{copyFeedback || 'Salin Teks'}</span>
                </button>

                {/* Clear All Transcript Action */}
                <button
                    type="button"
                    onClick={onClear}
                    disabled={!hasText && !isListening}
                    aria-label="Hapus dan bersihkan seluruh hasil transkripsi dari layar"
                    className="min-h-[48px] px-4 py-2.5 rounded-xl border border-coral-emergency bg-coral-emergency/10 text-coral-emergency font-extrabold text-sm sm:text-base hover:bg-coral-emergency/20 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-coral-emergency/30 disabled:opacity-100 disabled:border-[var(--border)] disabled:text-[var(--text-muted)] disabled:bg-[var(--surface-soft)] disabled:cursor-not-allowed transition-all flex items-center gap-2 ml-auto hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                >
                    <span aria-hidden="true">🗑️</span>
                    <span>Hapus Teks</span>
                </button>
            </div>
        </section>
    );
}
