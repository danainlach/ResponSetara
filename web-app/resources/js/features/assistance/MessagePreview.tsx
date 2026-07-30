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
        <section id="message-preview-card" tabIndex={-1} aria-labelledby="preview-heading" className="w-full rounded-3xl border-2 border-teal-700 bg-white p-6 sm:p-8 shadow-xl outline-none transition-all">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                    <h2 id="preview-heading" className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                        Pusat Aksi Darurat (Emergency Action Hub)
                    </h2>
                    <p className="mt-1 text-sm text-ink-600 font-medium">
                        Pesan siap dibagikan, dibacakan, atau diperlihatkan kepada penolong dan layanan darurat.
                    </p>
                </div>
                {result.source === 'ai' ? (
                    <span className="inline-block rounded-xl bg-indigo-50 px-3.5 py-1.5 text-xs sm:text-sm font-extrabold text-indigo-900 border border-indigo-300 whitespace-nowrap shadow-xs">
                        ✨ Dirapikan oleh AI
                    </span>
                ) : (
                    <span className="inline-block rounded-xl bg-teal-50 px-3.5 py-1.5 text-xs sm:text-sm font-bold text-teal-800 border border-teal-700/30 whitespace-nowrap">
                        ✔ Disusun menggunakan template
                    </span>
                )}
            </div>

            {/* Transparent Friendly AI Fallback Notice */}
            {result.fallback_used && (
                <div role="status" aria-live="polite" className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-400 text-amber-900 font-bold text-xs sm:text-sm flex items-start gap-3 shadow-xs">
                    <span className="text-xl">💡</span>
                    <span>
                        Penyempurnaan AI sedang tidak dapat digunakan (karena kendala jaringan atau perlindungan keamanan otomatis sistem). Kami telah menghadirkan versi template murni yang tetap jelas, lengkap, akurat, dan siap dibagikan.
                    </span>
                </div>
            )}

            {/* Composed Message Box with whitespace preservation for clean structured sections */}
            <div className="my-6 rounded-2xl bg-slate-100 p-5 sm:p-7 border-2 border-navy-900/10 text-ink-900 font-bold text-lg sm:text-xl lg:text-2xl leading-relaxed select-all whitespace-pre-line">
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
                        className="text-xs sm:text-sm font-extrabold text-indigo-700 hover:text-indigo-900 hover:underline inline-flex items-center gap-1.5 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-lg p-1"
                    >
                        <span>🔄 Gunakan Versi Template Murni (Tanpa AI)</span>
                    </button>
                </div>
            )}

            {/* Live Copy & Action Notification Feedback */}
            {copyFeedback && (
                <div role="status" aria-live="assertive" className={`mb-6 p-4 rounded-xl font-bold text-sm text-center ${isCopying || copyFeedback.includes('berhasil') ? 'bg-teal-50 text-teal-800 border border-teal-700/40' : 'bg-coral-50 text-coral-700 border border-coral-600/30'}`}>
                    {copyFeedback}
                </div>
            )}

            {/* TTS Error Notification */}
            {ttsState.errorMessage && ttsState.status === 'error' && (
                <div role="alert" className="mb-6 p-4 rounded-xl bg-coral-50 text-coral-700 font-bold text-sm text-center border border-coral-600/30">
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
                        className="min-h-[54px] inline-flex items-center justify-center gap-2.5 rounded-2xl bg-coral-600 px-6 py-3.5 text-base sm:text-lg font-black text-white shadow-lg hover:bg-coral-600/90 focus:outline-none focus-visible:ring-4 focus-visible:ring-coral-600/50 transition-transform active:scale-95"
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
                                className="flex-1 min-h-[54px] inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-800 px-4 py-3 text-base font-extrabold text-white shadow-md hover:bg-teal-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500 transition-colors"
                            >
                                <span aria-hidden="true">⏸</span>
                                <span>Jeda Suara</span>
                            </button>
                            <button
                                type="button"
                                onClick={stop}
                                title="Berhenti"
                                aria-label="Berhenti membacakan pesan"
                                className="min-h-[54px] px-5 rounded-2xl bg-slate-200 text-ink-900 font-bold hover:bg-slate-300 transition-colors"
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
                                className="flex-1 min-h-[54px] inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-800 px-4 py-3 text-base font-extrabold text-white shadow-md hover:bg-teal-700 transition-colors"
                            >
                                <span aria-hidden="true">▶</span>
                                <span>Lanjutkan</span>
                            </button>
                            <button
                                type="button"
                                onClick={stop}
                                title="Berhenti"
                                aria-label="Berhenti membacakan pesan"
                                className="min-h-[54px] px-5 rounded-2xl bg-slate-200 text-ink-900 font-bold hover:bg-slate-300 transition-colors"
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
                            className="min-h-[54px] inline-flex items-center justify-center gap-2.5 rounded-2xl bg-navy-900 px-6 py-3 text-base sm:text-lg font-extrabold text-white shadow-md hover:bg-navy-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500 disabled:opacity-50 transition-colors"
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
                        className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 border border-slate-300 px-4 py-2.5 text-sm sm:text-base font-bold text-navy-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 transition-colors active:scale-95"
                    >
                        <span aria-hidden="true">📋</span>
                        <span>{isCopying ? 'Tersalin!' : 'Salin Teks'}</span>
                    </button>

                    {/* Action 4: Tampilkan Teks Besar */}
                    <button
                        type="button"
                        onClick={() => setIsLargeTextOpen(true)}
                        aria-label="Tampilkan pesan darurat dalam mode layar penuh teks besar"
                        className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 border border-slate-300 px-4 py-2.5 text-sm sm:text-base font-bold text-navy-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-900 transition-colors"
                    >
                        <span aria-hidden="true">🔍</span>
                        <span>Teks Besar</span>
                    </button>

                    {/* Action 5: Kontak Darurat Resmi / 112 */}
                    <a
                        href="/#emergency-contacts"
                        aria-label="Lihat Kontak Darurat Resmi Nasional 112, 119, dan aparat terkait"
                        className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-teal-50 border border-teal-600/30 px-4 py-2.5 text-sm sm:text-base font-extrabold text-teal-800 hover:bg-teal-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 transition-colors text-center"
                    >
                        <span aria-hidden="true">📞</span>
                        <span>Kontak Darurat 112</span>
                    </a>
                </div>
            </div>

            <div className="mt-6 pt-5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={handleEditClick}
                    className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center rounded-xl border-2 border-navy-900 bg-transparent px-6 py-2 text-sm sm:text-base font-bold text-navy-900 hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500"
                >
                    ✏️ Ubah Informasi
                </button>

                <button
                    type="button"
                    onClick={handleResetClick}
                    className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center rounded-xl border border-slate-300 bg-slate-100 px-6 py-2 text-sm sm:text-base font-bold text-ink-600 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-coral-600"
                >
                    🔄 Mulai Ulang (Reset Form)
                </button>
            </div>

            <div className="mt-6 text-center text-xs text-ink-600">
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
