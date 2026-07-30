import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import type { RecognitionStateStatus, SpeechToTextState, SpeechToTextActions } from './types';

const MAX_CHAR_LIMIT = 3000;

const getSpeechConstructor = (): SpeechRecognitionConstructor | undefined => {
    if (typeof window !== 'undefined') {
        return window.SpeechRecognition || window.webkitSpeechRecognition;
    }

    return undefined;
};

const mapErrorCodeToIndonesian = (error: string): string => {
    switch (error) {
        case 'not-allowed':
        case 'permission-denied':
            return 'Izin mikrofon ditolak oleh browser atau sistem. Gunakan input teks manual di bawah atau ubah izin mikrofon pada browser Anda.';
        case 'service-not-allowed':
            return 'Layanan pengenalan suara tidak diizinkan oleh kebijakan peramban atau perangkat ini. Silakan gunakan input teks manual.';
        case 'audio-capture':
            return 'Mikrofon tidak ditemukan atau sedang digunakan oleh aplikasi lain di perangkat ini.';
        case 'no-speech':
            return 'Belum ada ucapan yang terdeteksi oleh sistem. Silakan coba kembali.';
        case 'network':
            return 'Layanan pengenalan suara mengalami gangguan jaringan. Silakan beralih gunakan input teks manual.';
        case 'aborted':
            return 'Sesi pendengaran suara dihentikan atau dibatalkan.';
        case 'language-not-supported':
            return 'Dialek Bahasa Indonesia (id-ID) belum didukung pada mesin peramban Anda. Silakan ketik pesan secara manual.';
        case 'bad-grammar':
            return 'Terjadi kendala dalam pengenalan struktur tata bahasa pada audio yang ditangkap.';
        case 'unknown':
        default:
            return 'Terjadi kendala teknis pada pembuka suara browser. Silakan lanjutkan melalui ketikan manual.';
    }
};

export function useSpeechToText(onLimitReached?: () => void): SpeechToTextState & SpeechToTextActions {
    const [isSupported, setIsSupported] = useState<boolean>(() => getSpeechConstructor() !== undefined);
    const [status, setStatus] = useState<RecognitionStateStatus>(() => (getSpeechConstructor() !== undefined ? 'idle' : 'unsupported'));
    const [isListening, setIsListening] = useState<boolean>(false);
    const [interimTranscript, setInterimTranscript] = useState<string>('');
    const [finalTranscript, setFinalTranscript] = useState<string>('');
    const [manualText, setManualText] = useState<string>('');
    const [language, setLanguageState] = useState<string>('id-ID');
    const [errorMessage, setErrorMessage] = useState<string | null>(() => (getSpeechConstructor() !== undefined ? null : 'Browser Anda tidak memiliki dukungan antarmuka Web Speech API. Silakan gunakan input teks manual di bawah ini.'));
    
    const [isCopying, setIsCopying] = useState<boolean>(false);
    const [copyFeedback, setCopyFeedback] = useState<string | null>(null);

    const recognitionRef = useRef<SpeechRecognition | null>(null);
    const isManuallyStoppedRef = useRef<boolean>(false);
    const latestFinalRef = useRef<string>('');

    useEffect(() => {
        const ctor = getSpeechConstructor();

        if (ctor && !isSupported) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setIsSupported(true);
             
            setStatus((s) => (s === 'unsupported' ? 'idle' : s));
             
            setErrorMessage((e) => (e?.includes('Web Speech API') ? null : e));
        }
    }, [isSupported]);

    // Keep ref in sync with finalTranscript for event callback evaluation without closure stale bugs
    useEffect(() => {
        latestFinalRef.current = finalTranscript;
    }, [finalTranscript]);

    // Cleanup when component unmounts or navigating away
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.abort();
                } catch {
                    // Safe abort on unmount
                }
            }
        };
    }, []);

    const initRecognition = useCallback(() => {
        const Constructor = getSpeechConstructor();

        if (!Constructor) {
            setStatus('unsupported');

            return null;
        }

        const recognition = new Constructor();
        recognition.lang = language;
        recognition.interimResults = true;
        recognition.continuous = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setStatus('listening');
            setIsListening(true);
            setErrorMessage(null);
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            setIsListening(false);
            const friendlyMessage = mapErrorCodeToIndonesian(event.error);
            setErrorMessage(friendlyMessage);

            if (event.error === 'not-allowed' || event.error === 'permission-denied' || event.error === 'audio-capture' || event.error === 'service-not-allowed') {
                setStatus('error');
            } else if (event.error === 'aborted') {
                setStatus('stopped');
            } else {
                setStatus('error');
            }
        };

        recognition.onend = () => {
            setIsListening(false);

            // Strict rule: No infinite auto-restart loops! When browser halts continuous recognition, drop to stopped state
            if (!isManuallyStoppedRef.current && status !== 'error' && status !== 'unsupported') {
                setStatus('stopped');
            } else if (isManuallyStoppedRef.current) {
                setStatus('stopped');
            }

            setInterimTranscript('');
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            let currentInterim = '';
            let newFinalChunk = '';

            for (let i = event.resultIndex; i < event.results.length; ++i) {
                const result = event.results[i];

                if (result.isFinal) {
                    newFinalChunk += result[0].transcript.trim() + '. ';
                } else {
                    currentInterim += result[0].transcript;
                }
            }

            setStatus('processing');

            if (newFinalChunk) {
                const currentLength = latestFinalRef.current.length;

                if (currentLength >= MAX_CHAR_LIMIT) {
                    // Limit reached: abort listening cleanly without adding extra text
                    try {
                        recognition.stop();
                    } catch {
                        // ignore
                    }

                    if (onLimitReached) {
                        onLimitReached();
                    }

                    setStatus('stopped');
                    setIsListening(false);
                    setInterimTranscript('');

                    return;
                }

                const combined = (latestFinalRef.current + ' ' + newFinalChunk).trim();
                const truncated = combined.slice(0, MAX_CHAR_LIMIT);
                setFinalTranscript(truncated);
                latestFinalRef.current = truncated;

                if (truncated.length >= MAX_CHAR_LIMIT) {
                    try {
                        recognition.stop();
                    } catch {
                        // ignore
                    }

                    if (onLimitReached) {
                        onLimitReached();
                    }
                }
            }

            setInterimTranscript(currentInterim);

            if (isListening) {
                setStatus('listening');
            }
        };

        return recognition;
    }, [language, status, isListening, onLimitReached]);

    const startListening = useCallback(() => {
        if (!isSupported) {
            return;
        }

        if (latestFinalRef.current.length >= MAX_CHAR_LIMIT) {
            setErrorMessage('Batas kuota memori 3.000 karakter telah tercapai. Silakan salin atau hapus teks sebelum mendengarkan kembali.');

            return;
        }

        isManuallyStoppedRef.current = false;
        setErrorMessage(null);
        setStatus('requesting-permission');

        try {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }

            const recognition = initRecognition();

            if (recognition) {
                recognitionRef.current = recognition;
                recognition.start();
            }
        } catch {
            setStatus('error');
            setErrorMessage('Gagal mengaktifkan sensor pembaca suara. Pastikan mikrofon berfungsi dengan baik.');
        }
    }, [isSupported, initRecognition]);

    const stopListening = useCallback(() => {
        isManuallyStoppedRef.current = true;
        setIsListening(false);
        setStatus('stopped');
        setInterimTranscript('');

        if (recognitionRef.current) {
            try {
                recognitionRef.current.stop();
            } catch {
                // ignore stop error
            }
        }
    }, []);

    const abortListening = useCallback(() => {
        isManuallyStoppedRef.current = true;
        setIsListening(false);
        setStatus('stopped');
        setInterimTranscript('');

        if (recognitionRef.current) {
            try {
                recognitionRef.current.abort();
            } catch {
                // ignore abort error
            }
        }
    }, []);

    const clearTranscript = useCallback(() => {
        abortListening();
        setFinalTranscript('');
        latestFinalRef.current = '';
        setInterimTranscript('');
        setManualText('');
        setErrorMessage(null);

        if (isSupported) {
            setStatus('idle');
        }
    }, [abortListening, isSupported]);

    const handleManualTextChange = useCallback((text: string) => {
        const sliced = text.slice(0, MAX_CHAR_LIMIT);
        setManualText(sliced);
    }, []);

    const appendManualText = useCallback(() => {
        if (!manualText.trim()) {
            return;
        }

        const currentLength = finalTranscript.length;

        if (currentLength >= MAX_CHAR_LIMIT) {
            setErrorMessage('Batas kuota memori 3.000 karakter telah tercapai.');

            return;
        }

        const sentence = manualText.trim().endsWith('.') || manualText.trim().endsWith('?') || manualText.trim().endsWith('!')
            ? manualText.trim()
            : manualText.trim() + '. ';

        const combined = (finalTranscript + ' ' + sentence).trim();
        const truncated = combined.slice(0, MAX_CHAR_LIMIT);
        setFinalTranscript(truncated);
        latestFinalRef.current = truncated;
        setManualText('');
    }, [manualText, finalTranscript]);

    const displayCompositeText = useMemo(() => {
        if (finalTranscript.trim() && manualText.trim()) {
            return `${finalTranscript.trim()}\n\n[Input Manual Tambahan]: ${manualText.trim()}`;
        }

        return finalTranscript.trim() || manualText.trim() || '';
    }, [finalTranscript, manualText]);

    const characterCount = finalTranscript.length;
    const isLimitReached = characterCount >= MAX_CHAR_LIMIT;

    const copyTranscript = useCallback(async () => {
        const targetText = displayCompositeText.trim();

        if (!targetText) {
            return;
        }

        setIsCopying(true);
        setCopyFeedback('Menyalin...');

        try {
            if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(targetText);
                setCopyFeedback('Teks berhasil disalin!');
            } else {
                const textArea = document.createElement('textarea');
                textArea.value = targetText;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                setCopyFeedback('Teks berhasil disalin!');
            }
        } catch {
            setCopyFeedback('Gagal menyalin. Silakan salin secara manual.');
        } finally {
            setIsCopying(false);
            setTimeout(() => {
                setCopyFeedback(null);
            }, 3000);
        }
    }, [displayCompositeText]);

    const setFinalText = useCallback((text: string) => {
        const sliced = text.slice(0, MAX_CHAR_LIMIT);
        setFinalTranscript(sliced);
        latestFinalRef.current = sliced;
    }, []);

    const setLanguage = useCallback((lang: string) => {
        setLanguageState(lang);

        if (recognitionRef.current) {
            recognitionRef.current.lang = lang;
        }
    }, []);

    return {
        isSupported,
        status,
        isListening,
        interimTranscript,
        finalTranscript,
        manualText,
        displayCompositeText,
        language,
        errorMessage,
        characterCount,
        characterLimit: MAX_CHAR_LIMIT,
        isLimitReached,
        isCopying,
        copyFeedback,
        startListening,
        stopListening,
        abortListening,
        clearTranscript,
        copyTranscript,
        handleManualTextChange,
        appendManualText,
        setFinalText,
        setLanguage,
    };
}
