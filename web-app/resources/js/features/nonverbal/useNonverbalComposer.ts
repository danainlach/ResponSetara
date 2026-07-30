import { useState, useCallback } from 'react';

const MAX_CHARACTER_LIMIT = 500;

export function useNonverbalComposer(onStopSpeech?: () => void) {
    const [text, setText] = useState<string>('');
    const [isCopying, setIsCopying] = useState<boolean>(false);
    const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

    const handleTextChange = useCallback((rawText: string) => {
        // Enforce max 500 characters limit within transient runtime state only
        const sliced = rawText.slice(0, MAX_CHARACTER_LIMIT);
        setText(sliced);
    }, []);

    const appendPhrase = useCallback((phraseText: string, speechText?: string | null) => {
        const targetText = (speechText || phraseText).trim();

        if (!targetText) {
            return;
        }

        setText((prevText) => {
            const current = prevText.trim();

            if (!current) {
                return targetText.slice(0, MAX_CHARACTER_LIMIT);
            }

            // Prevent unintended accidental duplication at the very end
            if (current.toLowerCase().endsWith(targetText.toLowerCase())) {
                return prevText;
            }

            // Ensure proper punctuation and sentence spacing between concatenated phrases
            const endsWithPunctuation = /[.!?]$/.test(current);
            const separator = endsWithPunctuation ? ' ' : '. ';
            const combined = `${current}${separator}${targetText}`;

            return combined.slice(0, MAX_CHARACTER_LIMIT);
        });
    }, []);

    const clearText = useCallback(() => {
        setText('');
        setCopyFeedback(null);

        if (onStopSpeech) {
            onStopSpeech();
        }
    }, [onStopSpeech]);

    const copyText = useCallback(async () => {
        if (!text.trim()) {
            return;
        }

        setIsCopying(true);
        setCopyFeedback('Menyalint...');

        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                setCopyFeedback('Teks berhasil disalin!');
            } else {
                // Fallback for legacy browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setCopyFeedback('Teks berhasil disalin!');
            }
        } catch {
            setCopyFeedback('Gagal menyalin teks. Silakan salin secara manual.');
        } finally {
            setIsCopying(false);
            setTimeout(() => {
                setCopyFeedback(null);
            }, 3000);
        }
    }, [text]);

    const isTextEmptyOrWhitespace = !text.trim();
    const characterCount = text.length;

    return {
        text,
        characterCount,
        maxLimit: MAX_CHARACTER_LIMIT,
        isTextEmptyOrWhitespace,
        isCopying,
        copyFeedback,
        handleTextChange,
        appendPhrase,
        clearText,
        copyText
    };
}
