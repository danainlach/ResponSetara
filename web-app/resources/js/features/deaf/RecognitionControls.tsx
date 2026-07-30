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
        <section aria-labelledby="controls-heading" className="rounded-2xl border-2 border-navy-800 p-4 sm:p-6 bg-white shadow-xs">
            <h3 id="controls-heading" className="text-base sm:text-lg font-bold text-navy-900 mb-3">
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
                        className="min-h-[48px] px-5 py-2.5 rounded-xl bg-coral-600 text-white font-extrabold text-sm sm:text-base shadow-md hover:bg-coral-600/90 focus:outline-none focus-visible:ring-4 focus-visible:ring-coral-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                        <span aria-hidden="true">🎙️</span>
                        <span>{isStoppedOrError ? 'Dengarkan Lagi' : 'Mulai Mendengarkan'}</span>
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={onStop}
                        aria-label="Berhentikan proses mendengarkan suara"
                        className="min-h-[48px] px-5 py-2.5 rounded-xl bg-navy-900 text-white font-extrabold text-sm sm:text-base shadow-md hover:bg-navy-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500 transition-colors flex items-center gap-2"
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
                    className="min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-navy-800 bg-white text-navy-900 font-extrabold text-sm sm:text-base hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500 disabled:opacity-40 disabled:border-slate-300 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
                    className="min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-teal-700 bg-teal-50 text-teal-900 font-bold text-sm sm:text-base hover:bg-teal-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500 disabled:opacity-40 disabled:border-slate-300 disabled:bg-slate-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
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
                    className="min-h-[48px] px-4 py-2.5 rounded-xl border-2 border-red-200 text-coral-600 font-bold text-sm sm:text-base hover:bg-red-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-coral-500 disabled:opacity-40 disabled:border-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2 ml-auto"
                >
                    <span aria-hidden="true">🗑️</span>
                    <span>Hapus Teks</span>
                </button>
            </div>
        </section>
    );
}
