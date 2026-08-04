import React, { useState } from 'react';
import LiveAnnouncer from '../../components/accessibility/LiveAnnouncer';
import LargeTextDialog from '../../components/shared/LargeTextDialog';
import type { HelperGuideItem } from './types';
import { useSpeechToText } from './useSpeechToText';
import BrowserCompatibilityNotice from './BrowserCompatibilityNotice';
import RecognitionStatus from './RecognitionStatus';
import RecognitionControls from './RecognitionControls';
import TranscriptDisplay from './TranscriptDisplay';
import ManualTextInput from './ManualTextInput';
import HelperGuidePanel from './HelperGuidePanel';

interface DeafModeProps {
    initialHelperGuides?: HelperGuideItem[];
    hasError?: boolean;
}

export default function DeafMode({
    initialHelperGuides = [],
    hasError = false,
}: DeafModeProps) {
    const [announcement, setAnnouncement] = useState<string>('');
    const [isLargeTextOpen, setIsLargeTextOpen] = useState<boolean>(false);

    const stt = useSpeechToText(() => {
        setAnnouncement('Batas kuota transkripsi 3.000 karakter telah tercapai. Pengenalan suara dihentikan sementara.');
    });

    const handleStart = () => {
        setAnnouncement('Meminta izin mikrofon dan memulai pemantauan pengenalan suara');
        stt.startListening();
    };

    const handleStop = () => {
        setAnnouncement('Pengenalan suara dihentikan oleh pengguna');
        stt.stopListening();
    };

    const handleClear = () => {
        setAnnouncement('Seluruh hasil transkripsi dan teks masukan manual telah dihapus dari layar');
        stt.clearTranscript();
    };

    const handleCopy = () => {
        setAnnouncement('Menyalin hasil pesan ke clipboard');
        stt.copyTranscript();
    };

    const handleShowLargeText = () => {
        if (!stt.displayCompositeText.trim()) {
            return;
        }

        setAnnouncement('Membuka tampilan modal teks besar kontras tinggi');
        setIsLargeTextOpen(true);
    };

    const hasAnyText = Boolean(stt.displayCompositeText.trim() || stt.interimTranscript.trim());

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <LiveAnnouncer message={announcement} />

            <header className="border-b border-public-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
                        Mode Komunikasi: Saya Tidak Dapat Mendengar (Tuli)
                    </h1>
                    <p className="text-sm sm:text-base text-text-secondary font-semibold mt-1 leading-relaxed">
                        Fasilitas pengenalan ucapan penolong menjadi teks interaktif untuk situasi darurat dan gangguan pendengaran.
                    </p>
                </div>

                <a
                    href="/"
                    aria-label="Kembali ke halaman utama Beranda ResponSetara"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-public-border-strong bg-[var(--surface)] text-text-primary font-extrabold text-xs sm:text-sm hover:bg-public-selected hover:border-[var(--focus)] focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--focus-ring)] transition-all shrink-0 min-h-[44px]"
                >
                    <span aria-hidden="true">←</span>
                    <span>Kembali ke Beranda</span>
                </a>
            </header>

            <BrowserCompatibilityNotice isSupported={stt.isSupported} />

            {/* 2-Column Responsive Layout for Desktop / 1-Column for Mobile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column (7 cols on lg): Transcription & Controls */}
                <div className="lg:col-span-7 space-y-6">
                    <RecognitionStatus
                        status={stt.status}
                        isListening={stt.isListening}
                        errorMessage={stt.errorMessage}
                    />

                    <TranscriptDisplay
                        finalTranscript={stt.displayCompositeText}
                        interimTranscript={stt.interimTranscript}
                        characterCount={stt.displayCompositeText.length}
                        characterLimit={stt.characterLimit}
                        isLimitReached={stt.isLimitReached}
                        onEditFinalTranscript={stt.setFinalText}
                    />

                    <RecognitionControls
                        status={stt.status}
                        isSupported={stt.isSupported}
                        isListening={stt.isListening}
                        isLimitReached={stt.isLimitReached}
                        hasText={hasAnyText}
                        isCopying={stt.isCopying}
                        copyFeedback={stt.copyFeedback}
                        onStart={handleStart}
                        onStop={handleStop}
                        onClear={handleClear}
                        onCopy={handleCopy}
                        onShowLargeText={handleShowLargeText}
                    />

                    <ManualTextInput
                        value={stt.manualText}
                        onChange={stt.handleManualTextChange}
                        onSubmit={stt.appendManualText}
                        isLimitReached={stt.isLimitReached}
                        characterLimit={stt.characterLimit}
                    />
                </div>

                {/* Right Column (5 cols on lg): Helper Guides Directory */}
                <div className="lg:col-span-5">
                    <HelperGuidePanel
                        initialGuides={initialHelperGuides}
                        hasError={hasError}
                    />
                </div>
            </div>

            {/* Shared High-Contrast Large Text Dialog with Focus Trap */}
            <LargeTextDialog
                isOpen={isLargeTextOpen}
                onClose={() => setIsLargeTextOpen(false)}
                message={stt.displayCompositeText || 'Belum ada kalimat.'}
            />
        </div>
    );
}
