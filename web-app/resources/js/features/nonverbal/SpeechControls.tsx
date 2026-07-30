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
    ready: { text: 'Siap dibacakan', color: 'bg-teal-50 border-teal-700/40 text-navy-900', icon: '🟢' },
    speaking: { text: 'Sedang dibacakan...', color: 'bg-coral-50 border-coral-600/50 text-navy-900 animate-pulse', icon: '🔊' },
    paused: { text: 'Dijeda (Paused)', color: 'bg-amber-50 border-amber-600/50 text-amber-900', icon: '⏸️' },
    finished: { text: 'Selesai dibacakan', color: 'bg-slate-100 border-slate-300 text-navy-900', icon: '✅' },
    unsupported: { text: 'Tidak didukung oleh browser', color: 'bg-rose-50 border-rose-500 text-rose-900', icon: '⚠️' },
    error: { text: 'Terjadi kendala pemutaran', color: 'bg-rose-100 border-rose-600 text-rose-900', icon: '❌' },
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
        <fieldset className="rounded-2xl border-2 border-navy-800 bg-white p-4 sm:p-6 shadow-xs space-y-4">
            <legend className="sr-only">Kontrol Pemutaran Suara Text-to-Speech</legend>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2">
                    <span className="text-sm sm:text-base font-extrabold text-navy-900">
                        Kontrol Suara (Web Speech API)
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-teal-800 text-white">
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
                <div role="alert" className="rounded-xl bg-rose-50 p-3 text-xs sm:text-sm font-semibold text-rose-900 border border-rose-400">
                    {errorMessage}
                </div>
            )}

            {!isSupported && (
                <div role="alert" className="rounded-xl border border-amber-500 bg-amber-50 p-3.5 text-xs sm:text-sm text-amber-900 font-semibold">
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
                        className="col-span-2 min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-coral-600 px-5 py-2.5 text-sm sm:text-base font-extrabold text-white shadow-md hover:bg-coral-600/90 focus:outline-none focus-visible:ring-4 focus-visible:ring-coral-600/50 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none transition-transform active:scale-95"
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
                                className="min-h-[48px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-amber-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500 transition-colors"
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
                                className="min-h-[48px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-teal-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500 transition-colors"
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
                            className="min-h-[48px] inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-700 px-4 py-2.5 text-sm font-extrabold text-white shadow-sm hover:bg-rose-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500 transition-colors"
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
                    className="min-h-[48px] inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-navy-800 bg-white px-3 py-2.5 text-xs sm:text-sm font-extrabold text-navy-900 shadow-xs hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500 disabled:border-slate-300 disabled:text-slate-400 disabled:bg-slate-50 transition-colors"
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
                    className="min-h-[48px] inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-slate-300 bg-slate-100 px-3 py-2.5 text-xs sm:text-sm font-bold text-ink-600 hover:bg-slate-200 focus:outline-none focus-visible:ring-4 focus-visible:ring-slate-400 disabled:opacity-50 transition-colors"
                >
                    <span>⏹️</span>
                    <span>Berhenti</span>
                </button>
            </div>
        </fieldset>
    );
}
