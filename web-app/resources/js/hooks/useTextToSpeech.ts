import { useState, useEffect, useCallback, useRef } from 'react';

export type SpeechRate = 0.75 | 1.0 | 1.25 | 1.5;
export type SpeechStatus = 'unsupported' | 'ready' | 'speaking' | 'paused' | 'error' | 'finished';

export interface VoiceOption {
    uri: string;
    name: string;
    lang: string;
    isDefault: boolean;
    isIndonesian: boolean;
    nativeVoice: SpeechSynthesisVoice | null;
}

export interface TTSState {
    isSupported: boolean;
    status: SpeechStatus;
    selectedVoice: VoiceOption | null;
    availableVoices: VoiceOption[];
    hasIndonesianVoice: boolean;
    rate: SpeechRate;
    errorMessage: string | null;
}

const isSpeechSupported = () => typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

export function useTextToSpeech() {
    const [isSupported] = useState<boolean>(isSpeechSupported);
    const [status, setStatus] = useState<SpeechStatus>(() => (isSpeechSupported() ? 'ready' : 'unsupported'));
    const [availableVoices, setAvailableVoices] = useState<VoiceOption[]>([]);
    const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);
    const [hasIndonesianVoice, setHasIndonesianVoice] = useState<boolean>(false);
    const [rate, setRateState] = useState<SpeechRate>(1.0);
    const [errorMessage, setErrorMessage] = useState<string | null>(() => (isSpeechSupported() ? null : 'Browser Anda tidak mendukung layanan pemutaran suara Web Speech API.'));

    const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const updateVoices = useCallback(() => {
        if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
            return;
        }

        const voices = window.speechSynthesis.getVoices();

        if (!voices || voices.length === 0) {
            return;
        }

        const formattedVoices: VoiceOption[] = voices.map((v, idx) => ({
            uri: v.voiceURI || `${v.name}-${idx}`,
            name: v.name,
            lang: v.lang,
            isDefault: v.default,
            isIndonesian: v.lang.toLowerCase().includes('id-id') || v.lang.toLowerCase() === 'id' || v.name.toLowerCase().includes('indonesian') || v.name.toLowerCase().includes('indonesia'),
            nativeVoice: v,
        }));

        setAvailableVoices(formattedVoices);

        const indonesianVoices = formattedVoices.filter(v => v.isIndonesian);
        const hasId = indonesianVoices.length > 0;
        setHasIndonesianVoice(hasId);

        if (!selectedVoice) {
            const prioritized = indonesianVoices[0] || formattedVoices.find(v => v.isDefault) || formattedVoices[0];
            setSelectedVoice(prioritized || null);
        }
    }, [selectedVoice]);

    useEffect(() => {
        if (!isSupported) {
            return;
        }

        const timer = setTimeout(() => {
            updateVoices();
        }, 10);

        const synth = window.speechSynthesis;

        if (synth && 'onvoiceschanged' in synth) {
            synth.onvoiceschanged = () => {
                updateVoices();
            };
        }

        return () => {
            clearTimeout(timer);

            if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
            }
        };
    }, [isSupported, updateVoices]);

    const cancelQueue = useCallback(() => {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }, []);

    const speak = useCallback((text: string) => {
        if (!isSupported || !text.trim()) {
            return;
        }

        cancelQueue();

        try {
            const utterance = new window.SpeechSynthesisUtterance(text);
            activeUtteranceRef.current = utterance;

            if (selectedVoice?.nativeVoice) {
                utterance.voice = selectedVoice.nativeVoice;
            }

            utterance.rate = rate;

            utterance.onstart = () => {
                setStatus('speaking');
                setErrorMessage(null);
            };

            utterance.onend = () => {
                setStatus('finished');
                activeUtteranceRef.current = null;
            };

            utterance.onpause = () => {
                setStatus('paused');
            };

            utterance.onresume = () => {
                setStatus('speaking');
            };

            utterance.onerror = (e) => {
                if (e.error === 'canceled' || e.error === 'interrupted') {
                    return;
                }

                setStatus('error');
                setErrorMessage('Terjadi kendala saat membacakan suara.');
            };

            window.speechSynthesis.speak(utterance);
        } catch {
            setStatus('error');
            setErrorMessage('Gagal memproses pengucapan suara sistem.');
        }
    }, [isSupported, selectedVoice, rate, cancelQueue]);

    const pause = useCallback(() => {
        if (isSupported && typeof window !== 'undefined' && 'speechSynthesis' in window) {
            if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
                window.speechSynthesis.pause();
                setStatus('paused');
            }
        }
    }, [isSupported]);

    const resume = useCallback(() => {
        if (isSupported && typeof window !== 'undefined' && 'speechSynthesis' in window) {
            if (window.speechSynthesis.paused) {
                window.speechSynthesis.resume();
                setStatus('speaking');
            }
        }
    }, [isSupported]);

    const stop = useCallback(() => {
        if (isSupported) {
            cancelQueue();
            setStatus('ready');
            activeUtteranceRef.current = null;
        }
    }, [isSupported, cancelQueue]);

    const repeat = useCallback((text: string) => {
        stop();
        setTimeout(() => {
            speak(text);
        }, 50);
    }, [stop, speak]);

    const setVoice = useCallback((uri: string) => {
        const voice = availableVoices.find(v => v.uri === uri) || null;

        if (voice) {
            setSelectedVoice(voice);
        }
    }, [availableVoices]);

    const setRate = useCallback((newRate: SpeechRate) => {
        setRateState(newRate);
    }, []);

    const state: TTSState = {
        isSupported,
        status,
        selectedVoice,
        availableVoices,
        hasIndonesianVoice,
        rate,
        errorMessage,
    };

    return {
        state,
        speak,
        pause,
        resume,
        stop,
        repeat,
        setVoice,
        setRate,
        cancelQueue
    };
}
