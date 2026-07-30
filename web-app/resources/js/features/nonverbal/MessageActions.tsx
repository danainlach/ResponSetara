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
                    className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl bg-navy-900 text-white font-extrabold text-sm sm:text-base shadow-xs hover:bg-navy-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500 disabled:bg-slate-300 disabled:text-slate-500 disabled:shadow-none transition-colors"
                >
                    <span>🔍</span>
                    <span>Teks Besar</span>
                </button>

                <button
                    type="button"
                    onClick={onCopy}
                    disabled={isTextEmpty || isCopying}
                    aria-label="Salin isi pesan ke clipboard"
                    className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl border-2 border-navy-900 bg-white text-navy-900 font-extrabold text-sm sm:text-base shadow-xs hover:bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500 disabled:border-slate-300 disabled:text-slate-400 disabled:bg-slate-50 disabled:shadow-none transition-colors"
                >
                    <span>📋</span>
                    <span>{isCopying ? 'Menyalin...' : 'Salin Teks'}</span>
                </button>

                <button
                    type="button"
                    onClick={onClear}
                    disabled={isTextEmpty}
                    aria-label="Hapus semua isi teks"
                    className="min-h-[48px] inline-flex items-center justify-center gap-2 rounded-xl border-2 border-rose-600 bg-rose-50 text-rose-800 font-bold text-sm sm:text-base hover:bg-rose-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-rose-500 disabled:border-slate-300 disabled:text-slate-400 disabled:bg-slate-50 transition-colors"
                >
                    <span>🗑️</span>
                    <span>Hapus Semua</span>
                </button>
            </div>

            {copyFeedback && (
                <div
                    role="status"
                    aria-live="polite"
                    className="p-3 rounded-xl bg-teal-800 text-white text-xs sm:text-sm font-extrabold text-center animate-in fade-in motion-reduce:animate-none"
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
