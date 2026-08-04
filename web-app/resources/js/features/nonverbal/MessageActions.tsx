import React, { useState } from 'react';
import LargeTextDialog from '../../components/shared/LargeTextDialog';

interface MessageActionsProps {
    messageText: string;
    isTextEmpty: boolean;
    isCopying: boolean;
    copyFeedback: string | null;
    onCopy: () => void;
    onClear: () => void;
}

export default function MessageActions({
    messageText,
    isTextEmpty,
    isCopying,
    copyFeedback,
    onCopy,
    onClear,
}: MessageActionsProps) {
    const [isLargeTextOpen, setIsLargeTextOpen] = useState<boolean>(false);

    return (
        <div className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                    type="button"
                    onClick={() => setIsLargeTextOpen(true)}
                    disabled={isTextEmpty}
                    aria-label="Tampilkan teks dalam modus ukuran besar kontras tinggi"
                    className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-teal-primary text-white font-extrabold text-sm sm:text-base shadow-xs hover:bg-teal-hover focus:outline-none focus-visible:ring-[3px] focus-visible:ring-teal-primary/30 disabled:bg-[var(--surface-soft)] disabled:text-[var(--text-muted)] disabled:shadow-none disabled:opacity-100 transition-all"
                >
                    <span>🔍</span>
                    <span>Teks Besar</span>
                </button>

                <button
                    type="button"
                    onClick={onCopy}
                    disabled={isTextEmpty || isCopying}
                    aria-label="Salin isi pesan ke clipboard"
                    className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl border border-public-border-strong bg-[var(--surface)] text-text-primary font-extrabold text-sm sm:text-base shadow-xs hover:bg-public-selected hover:border-[var(--focus)] focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--focus-ring)] disabled:border-[var(--border)] disabled:text-[var(--text-muted)] disabled:bg-[var(--surface-soft)] disabled:shadow-none disabled:opacity-100 transition-all"
                >
                    <span>📋</span>
                    <span>{isCopying ? 'Menyalin...' : 'Salin Teks'}</span>
                </button>

                <button
                    type="button"
                    onClick={onClear}
                    disabled={isTextEmpty}
                    aria-label="Hapus semua isi teks"
                    className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl border border-coral-emergency bg-coral-emergency/10 text-coral-emergency font-extrabold text-sm sm:text-base hover:bg-coral-emergency/20 focus:outline-none focus-visible:ring-[3px] focus-visible:ring-coral-emergency/30 disabled:border-[var(--border)] disabled:text-[var(--text-muted)] disabled:bg-[var(--surface-soft)] disabled:opacity-100 transition-all"
                >
                    <span>🗑️</span>
                    <span>Hapus Semua</span>
                </button>
            </div>

            {copyFeedback && (
                <div
                    role="status"
                    aria-live="polite"
                    className="p-3 rounded-xl bg-teal-primary/10 border border-teal-primary/20 text-teal-primary text-xs sm:text-sm font-extrabold text-center animate-in fade-in"
                >
                    ✓ {copyFeedback}
                </div>
            )}

            <LargeTextDialog
                isOpen={isLargeTextOpen}
                onClose={() => setIsLargeTextOpen(false)}
                message={messageText}
            />
        </div>
    );
}
