import React from 'react';
import type { SpeechStatus } from './types';

interface SpeechControlsProps {
    status: SpeechStatus;
    isSupported: boolean;
    isTextEmpty: boolean;
    errorMessage: string | null;
    onSpeak: () => void;
    onPause: () => void;
    onResume: () => void;
    onStop: () => void;
    onRepeat: () => void;
}

const STATUS_LABELS: Record<SpeechStatus, { text: string; color: string; icon: string }> = {
    ready: { text: 'Siap dibacakan', color: 'bg-teal-primary/10 border-teal-primary/20 text-teal-primary', icon: '🟢' },
    speaking: { text: 'Sedang dibacakan...', color: 'bg-coral-emergency/10 border-coral-emergency/20 text-coral-emergency animate-pulse', icon: '🔊' },
    paused: { text: 'Dijeda (Paused)', color: 'bg-amber-500/10 border-amber-500/20 text-amber-500', icon: '⏸️' },
    finished: { text: 'Selesai dibacakan', color: 'bg-[var(--surface-soft)] border-[var(--border)] text-[var(--text-secondary)]', icon: '✅' },
    unsupported: { text: 'Tidak didukung oleh browser', color: 'bg-coral-emergency/10 border-coral-emergency/20 text-coral-emergency', icon: '⚠️' },
    error: { text: 'Terjadi kendala pemutaran', color: 'bg-coral-emergency/10 border-coral-emergency/20 text-coral-emergency', icon: '❌' },
};

export default function SpeechControls({
    status,
    isSupported,
    isTextEmpty,
    errorMessage,
    onSpeak,
    onPause,
    onResume,
    onStop,
    onRepeat,
}: SpeechControlsProps) {
    const statusInfo = STATUS_LABELS[status];
    const isPlaying = status === 'speaking';
    const isPaused = status === 'paused';
    const isIdle = status === 'ready' || status === 'finished' || status === 'error';

    return (
        <fieldset className="rounded-[22px] border border-public-border bg-card p-6 shadow-card space-y-4">
            <legend className="sr-only">Kontrol Pemutaran Suara Text-to-Speech</legend>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-public-border pb-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-text-primary">
                        Kontrol Suara (Web Speech API)
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-primary text-white">
                        Browser Native
                    </span>
                </div>

                <div 
                    role="status" 
                    aria-live="polite" 
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border font-bold text-xs sm:text-sm ${statusInfo.color}`}
                >
                    <span>{statusInfo.icon}</span>
                    <span>Status: {statusInfo.text}</span>
                </div>
            </div>

            {errorMessage && (
                <div role="alert" className="rounded-xl bg-coral-emergency/10 p-3 text-xs sm:text-sm font-semibold text-coral-emergency border border-coral-emergency/20">
                    {errorMessage}
                </div>
            )}

            {!isSupported && (
                <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-3.5 text-xs sm:text-sm text-amber-850 font-semibold">
                    Layanan Text-to-Speech tidak didukung pada browser atau perangkat ini. Anda tetap dapat menggunakan fungsi <strong>Salin Teks</strong> dan <strong>Teks Besar</strong>.
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3.5">
                {isIdle || (!isPlaying && !isPaused) ? (
                    <button
                        type="button"
                        onClick={onSpeak}
                        disabled={!isSupported || isTextEmpty}
                        aria-label="Bacakan teks dengan suara"
                        className="col-span-2 min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-coral-emergency px-5 py-2.5 text-sm sm:text-base font-extrabold text-white shadow-md hover:bg-coral-hover focus:outline-none focus-visible:ring-[3px] focus-visible:ring-coral-emergency/30 disabled:bg-[var(--surface-soft)] disabled:text-[var(--text-muted)] disabled:opacity-100 disabled:shadow-none transition-all active:scale-95"
                    >
                        <span>▶️</span>
                        <span>Bacakan Suara</span>
                    </button>
                ) : (
                    <>
                        {isPlaying && (
                            <button
                                type="button"
                                onClick={onPause}
                                aria-label="Jeda pembacaan suara sementara"
                                className="min-h-[48px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-amber-700 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-amber-650/30 transition-all"
                            >
                                <span>⏸️</span>
                                <span>Jeda</span>
                            </button>
                        )}
                        {isPaused && (
                            <button
                                type="button"
                                onClick={onResume}
                                aria-label="Lanjutkan pembacaan suara"
                                className="min-h-[48px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-primary px-4 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-teal-hover focus:outline-none focus-visible:ring-[3px] focus-visible:ring-teal-primary/30 transition-all"
                            >
                                <span>▶️</span>
                                <span>Lanjut</span>
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onStop}
                            title="Berhenti"
                            aria-label="Berhenti membacakan pesan"
                            className="min-h-[48px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-coral-emergency px-4 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-coral-hover focus:outline-none focus-visible:ring-[3px] focus-visible:ring-coral-emergency/30 transition-all"
                        >
                            <span>⏹️</span>
                            <span>Berhenti</span>
                        </button>
                    </>
                )}

                <button
                    type="button"
                    onClick={onRepeat}
                    disabled={!isSupported || isTextEmpty}
                    aria-label="Ulangi pembacaan suara dari awal"
                    className="min-h-[48px] inline-flex items-center justify-center gap-1.5 rounded-xl border border-public-border-strong bg-[var(--surface)] px-3 py-2.5 text-xs sm:text-sm font-extrabold text-text-primary shadow-xs hover:bg-public-selected hover:border-[var(--focus)] focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--focus-ring)] disabled:border-[var(--border)] disabled:text-[var(--text-muted)] disabled:bg-[var(--surface-soft)] transition-all"
                >
                    <span>🔄</span>
                    <span>Ulangi Awal</span>
                </button>

                <button
                    type="button"
                    onClick={onStop}
                    disabled={!isSupported || isIdle}
                    title="Berhenti"
                    aria-label="Berhenti membacakan pesan"
                    className="min-h-[48px] inline-flex items-center justify-center gap-1.5 rounded-xl border border-coral-emergency bg-coral-emergency/10 px-3 py-2.5 text-xs sm:text-sm font-extrabold text-coral-emergency hover:bg-coral-emergency/20 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-coral-emergency/30 disabled:border-[var(--border)] disabled:text-[var(--text-muted)] disabled:bg-[var(--surface-soft)] disabled:opacity-100 transition-all"
                >
                    <span>⏹️</span>
                    <span>Berhenti</span>
                </button>
            </div>
        </fieldset>
    );
}
