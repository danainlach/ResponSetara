import React, { useState, useEffect } from 'react';
import LargeTextDialog from '../../components/shared/LargeTextDialog';
import { useTextToSpeech } from '../../hooks/useTextToSpeech';
import type { ComposedMessageResult } from './types';

interface MessagePreviewProps {
    result: ComposedMessageResult;
    onEdit: () => void;
    onReset: () => void;
    onSwitchVersion?: (version: 'ai' | 'template') => void;
}

export default function MessagePreview({
    result,
    onEdit,
    onReset,
    onSwitchVersion,
}: MessagePreviewProps) {
    const [isCopying, setIsCopying] = useState<boolean>(false);
    const [copyFeedback, setCopyFeedback] = useState<string | null>(null);
    const [isLargeTextOpen, setIsLargeTextOpen] = useState<boolean>(false);
    const [canShare] = useState<boolean>(
        () => typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'share' in navigator && typeof navigator.share === 'function'
    );

    const { state: ttsState, speak, pause, resume, stop } = useTextToSpeech();

    useEffect(() => {
        return () => {
            stop();
        };
    }, [stop]);

    const handleShare = async () => {
        if (canShare && typeof navigator !== 'undefined' && navigator.share) {
            try {
                await navigator.share({
                    title: 'Pesan Darurat - ResponSetara',
                    text: result.message,
                });
                setCopyFeedback('✔ Pesan berhasil dibagikan!');

                return;
            } catch (e: any) {
                if (e?.name === 'AbortError') {
return;
}
            }
        }

        // Fallback to direct WhatsApp web/app share
        const waUrl = `https://wa.me/?text=${encodeURIComponent(result.message)}`;
        window.open(waUrl, '_blank', 'noopener,noreferrer');
    };

    const handleCopyMessage = async () => {
        try {
            await navigator.clipboard.writeText(result.message);
            setIsCopying(true);
            setCopyFeedback('✔ Pesan berhasil disalin ke clipboard! Siap dibagikan.');
            setTimeout(() => {
                setIsCopying(false);
            }, 3000);
        } catch {
            setCopyFeedback('⚠️ Gagal menyalin secara otomatis. Silakan blok teks dan salin manual.');
        }
    };

    const handleEditClick = () => {
        stop();
        onEdit();
    };

    const handleResetClick = () => {
        stop();
        onReset();
    };

    return (
        <section id="message-preview-card" tabIndex={-1} aria-labelledby="preview-heading" className="w-full rounded-[22px] border border-public-border bg-card p-6 sm:p-8 shadow-card outline-none transition-all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-public-border">
                <div>
                    <h2 id="preview-heading" className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                        Pusat Aksi Darurat (Emergency Action Hub)
                    </h2>
                    <p className="mt-1 text-sm text-text-secondary font-semibold">
                        Pesan siap dibagikan, dibacakan, atau diperlihatkan kepada penolong dan layanan darurat.
                    </p>
                </div>
                {result.source === 'ai' ? (
                    <span className="inline-block rounded-xl bg-indigo-50 px-3.5 py-1.5 text-xs sm:text-sm font-extrabold text-indigo-850 border border-indigo-200 whitespace-nowrap shadow-xs">
                        ✨ Dirapikan oleh AI
                    </span>
                ) : (
                    <span className="inline-block rounded-xl bg-teal-primary/10 px-3.5 py-1.5 text-xs sm:text-sm font-extrabold text-teal-primary border border-teal-primary/20 whitespace-nowrap">
                        ✔ Disusun menggunakan template
                    </span>
                )}
            </div>

            {/* Transparent Friendly AI Fallback Notice */}
            {result.fallback_used && (
                <div role="status" aria-live="polite" className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-250 text-amber-850 font-bold text-xs sm:text-sm flex items-start gap-3 shadow-xs">
                    <span className="text-xl">💡</span>
                    <span>
                        Penyempurnaan AI sedang tidak dapat digunakan (karena kendala jaringan atau perlindungan keamanan otomatis sistem). Kami telah menghadirkan versi template murni yang tetap jelas, lengkap, akurat, dan siap dibagikan.
                    </span>
                </div>
            )}

            {/* Composed Message Box with whitespace preservation for clean structured sections */}
            <div className="my-6 rounded-2xl bg-public-surface-muted p-5 sm:p-7 border border-public-border text-text-primary font-extrabold text-lg sm:text-xl lg:text-2xl leading-relaxed select-all whitespace-pre-line">
                {result.message}
            </div>

            {/* Version Switcher option if generated by AI */}
            {result.source === 'ai' && result.template_message && onSwitchVersion && (
                <div className="mb-6 flex items-center justify-end">
                    <button
                        type="button"
                        onClick={() => {
                            stop(); onSwitchVersion('template'); 
                        }}
                        className="text-xs sm:text-sm font-extrabold text-indigo-650 hover:text-indigo-750 hover:underline inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-200 rounded-lg p-1"
                    >
                        <span>🔄 Gunakan Versi Template Murni (Tanpa AI)</span>
                    </button>
                </div>
            )}

            {/* Live Copy & Action Notification Feedback */}
            {copyFeedback && (
                <div role="status" aria-live="assertive" className={`mb-6 p-4 rounded-xl font-bold text-sm text-center border ${isCopying || copyFeedback.includes('berhasil') ? 'bg-teal-primary/10 text-teal-primary border-teal-primary/20' : 'bg-coral-emergency/10 text-coral-emergency border-coral-emergency/20'}`}>
                    {copyFeedback}
                </div>
            )}

            {/* TTS Error Notification */}
            {ttsState.errorMessage && ttsState.status === 'error' && (
                <div role="alert" className="mb-6 p-4 rounded-xl bg-coral-emergency/10 text-coral-emergency font-bold text-sm text-center border border-coral-emergency/20">
                    ⚠️ {ttsState.errorMessage}
                </div>
            )}

            {/* Emergency Action Hub Buttons (Hierarchy: 1. Share, 2. Speaker TTS, 3. Copy, 4. Large Text, 5. Emergency Contacts) */}
            <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Action 1: Bagikan / Kirim via Aplikasi Komunikasi */}
                    <button
                        type="button"
                        onClick={handleShare}
                        aria-label="Bagikan pesan ke aplikasi pesan atau WhatsApp"
                        className="min-h-[54px] inline-flex items-center justify-center gap-2.5 rounded-2xl bg-coral-emergency px-6 py-3.5 text-base sm:text-lg font-black text-white shadow-lg hover:bg-coral-hover focus:outline-none focus-visible:ring-[3px] focus-visible:ring-coral-emergency/30 transition-all hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <span aria-hidden="true" className="text-xl">📲</span>
                        <span>{canShare ? 'Bagikan Pesan (Share API)' : 'Kirim via WhatsApp'}</span>
                    </button>

                    {/* Action 2: Bacakan Pesan via Speaker (TTS) */}
                    {ttsState.status === 'speaking' ? (
                        <div className="flex items-stretch gap-2">
                            <button
                                type="button"
                                onClick={pause}
                                aria-label="Jeda membacakan pesan"
                                className="flex-1 min-h-[54px] inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-primary px-4 py-3 text-base font-extrabold text-white shadow-md hover:bg-teal-hover focus:outline-none focus-visible:ring-[3px] focus-visible:ring-teal-primary/30 transition-all"
                            >
                                <span aria-hidden="true">⏸</span>
                                <span>Jeda Suara</span>
                            </button>
                            <button
                                type="button"
                                onClick={stop}
                                title="Berhenti"
                                aria-label="Berhenti membacakan pesan"
                                className="min-h-[54px] px-5 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)] text-text-primary font-bold hover:bg-[var(--border)] transition-colors"
                            >
                                ⏹ Berhenti
                            </button>
                        </div>
                    ) : ttsState.status === 'paused' ? (
                        <div className="flex items-stretch gap-2">
                            <button
                                type="button"
                                onClick={resume}
                                aria-label="Lanjutkan membacakan pesan"
                                className="flex-1 min-h-[54px] inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-primary px-4 py-3 text-base font-extrabold text-white shadow-md hover:bg-teal-hover focus:outline-none focus-visible:ring-[3px] focus-visible:ring-teal-primary/30 transition-all"
                            >
                                <span aria-hidden="true">▶</span>
                                <span>Lanjutkan</span>
                            </button>
                            <button
                                type="button"
                                onClick={stop}
                                title="Berhenti"
                                aria-label="Berhenti membacakan pesan"
                                className="min-h-[54px] px-5 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)] text-text-primary font-bold hover:bg-[var(--border)] transition-colors"
                            >
                                ⏹ Berhenti
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            onClick={() => speak(result.message)}
                            disabled={ttsState.status === 'unsupported'}
                            aria-label="Bacakan pesan darurat melalui speaker menggunakan Text-to-Speech"
                            className="min-h-[54px] inline-flex items-center justify-center gap-2.5 rounded-2xl bg-teal-primary px-6 py-3 text-base sm:text-lg font-extrabold text-white shadow-md hover:bg-teal-hover focus:outline-none focus-visible:ring-[3px] focus-visible:ring-teal-primary/30 disabled:bg-[var(--surface-soft)] disabled:text-text-muted disabled:opacity-100 disabled:shadow-none transition-all hover:-translate-y-0.5 active:translate-y-0"
                        >
                            <span aria-hidden="true" className="text-xl">🔊</span>
                            <span>{ttsState.status === 'unsupported' ? 'TTS Tidak Didukung' : 'Bacakan Pesan (Speaker)'}</span>
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {/* Action 3: Salin Teks */}
                    <button
                        type="button"
                        onClick={handleCopyMessage}
                        aria-label="Salin teks pesan darurat ke papan klip clipboard"
                        className="public-button-secondary min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm sm:text-base transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm public-focus-ring"
                    >
                        <span aria-hidden="true">📋</span>
                        <span>{isCopying ? 'Tersalin!' : 'Salin Teks'}</span>
                    </button>

                    {/* Action 4: Tampilkan Teks Besar */}
                    <button
                        type="button"
                        onClick={() => setIsLargeTextOpen(true)}
                        aria-label="Tampilkan pesan darurat dalam mode layar penuh teks besar"
                        className="public-button-secondary min-h-[48px] inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm sm:text-base transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm public-focus-ring"
                    >
                        <span aria-hidden="true">🔍</span>
                        <span>Teks Besar</span>
                    </button>

                    {/* Action 5: Kontak Darurat Resmi / 112 */}
                    <a
                        href="/#emergency-contacts"
                        aria-label="Lihat Kontak Darurat Resmi Nasional 112, 119, dan aparat terkait"
                        className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-white border border-public-border-strong px-4 py-2.5 text-sm sm:text-base font-extrabold text-text-primary hover:bg-public-selected hover:border-teal-primary focus:outline-none focus-visible:ring-[3px] focus-visible:ring-teal-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm text-center"
                    >
                        <span aria-hidden="true">📞</span>
                        <span>Kontak Darurat 112</span>
                    </a>
                </div>
            </div>

            <div className="mt-6 pt-5 border-t border-public-border flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={handleEditClick}
                    className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center rounded-xl border border-public-border-strong bg-white px-6 py-2 text-sm sm:text-base font-extrabold text-text-primary hover:bg-public-selected hover:border-teal-primary focus:outline-none focus-visible:ring-[3px] focus-visible:ring-teal-primary/30 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                >
                    ✏️ Ubah Informasi
                </button>

                <button
                    type="button"
                    onClick={handleResetClick}
                    className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center rounded-xl border border-coral-emergency bg-coral-emergency/10 px-6 py-2 text-sm sm:text-base font-extrabold text-coral-emergency hover:bg-coral-emergency/20 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-coral-emergency/30 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-sm"
                >
                    🔄 Mulai Ulang (Reset Form)
                </button>
            </div>

            <div className="mt-6 text-center text-xs text-text-secondary font-semibold">
                <span aria-hidden="true" className="mr-1">🔒</span>
                <span>Data pesan darurat ini dipersembahkan langsung di layar peramban dan tidak disimpan di server maupun analitik ResponSetara.</span>
            </div>

            {/* High-Contrast Large Text Modal */}
            <LargeTextDialog 
                isOpen={isLargeTextOpen} 
                onClose={() => setIsLargeTextOpen(false)} 
                message={result.message} 
            />
        </section>
    );
}
