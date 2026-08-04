import React from 'react';
import type { QuickPhraseItem } from './types';

interface QuickPhraseButtonProps {
    phrase: QuickPhraseItem;
    onSelect: (phraseText: string, speechText?: string | null) => void;
}

export default function QuickPhraseButton({
    phrase,
    onSelect,
}: QuickPhraseButtonProps) {
    const isGeneral = phrase.category_id === null || phrase.category_id === undefined;

    return (
        <button
            type="button"
            onClick={() => onSelect(phrase.phrase_text, phrase.speech_text)}
            aria-label={`Tambahkan frasa darurat: ${phrase.phrase_text}`}
            className="w-full min-h-[48px] rounded-xl border border-public-border-strong bg-[var(--surface)] p-3.5 text-left flex items-center justify-between gap-3 shadow-2xs hover:border-[var(--focus)] hover:bg-public-selected focus:outline-none focus-visible:ring-[3px] focus-visible:ring-[var(--focus-ring)] transition-all group active:scale-[0.99]"
        >
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <span aria-hidden="true" className="text-base font-black text-teal-primary shrink-0 group-hover:scale-110 transition-transform">
                    ➕
                </span>
                <span className="text-sm sm:text-base font-extrabold text-text-primary leading-snug break-words">
                    {phrase.phrase_text}
                </span>
            </div>

            {isGeneral && (
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-public-surface-muted text-text-secondary border border-public-border shrink-0">
                    Umum
                </span>
            )}
        </button>
    );
}
