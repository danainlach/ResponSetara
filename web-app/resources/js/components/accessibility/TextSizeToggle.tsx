import React from 'react';

interface TextSizeToggleProps {
    isLargeText: boolean;
    onToggle: () => void;
}

export default function TextSizeToggle({ isLargeText, onToggle }: TextSizeToggleProps) {
    return (
        <button
            type="button"
            onClick={onToggle}
            aria-pressed={isLargeText}
            aria-label={isLargeText ? "Kembalikan ke ukuran teks normal" : "Perbesar ukuran teks"}
            title={isLargeText ? "Kembalikan ke ukuran teks normal" : "Perbesar ukuran teks"}
            className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-xl border border-navy-800/30 bg-white/10 px-3.5 py-2 text-sm font-bold text-white transition-colors hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-teal-500 active:scale-95 motion-reduce:transition-none motion-reduce:active:scale-100"
        >
            <span aria-hidden="true" className="font-extrabold text-base mr-1.5">A</span>
            <span>{isLargeText ? "Teks Normal" : "Teks Besar"}</span>
        </button>
    );
}
