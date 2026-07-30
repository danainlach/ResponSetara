export type RecognitionStateStatus = 
    | 'idle'
    | 'requesting-permission'
    | 'listening'
    | 'processing'
    | 'stopped'
    | 'unsupported'
    | 'error';

export interface HelperGuideItem {
    id: number;
    title: string;
    body: string;
    audience: string;
    is_active?: boolean;
    sort_order?: number;
}

export interface SpeechToTextState {
    isSupported: boolean;
    status: RecognitionStateStatus;
    isListening: boolean;
    interimTranscript: string;
    finalTranscript: string;
    manualText: string;
    displayCompositeText: string;
    language: string;
    errorMessage: string | null;
    characterCount: number;
    characterLimit: number;
    isLimitReached: boolean;
    isCopying: boolean;
    copyFeedback: string | null;
}

export interface SpeechToTextActions {
    startListening: () => void;
    stopListening: () => void;
    abortListening: () => void;
    clearTranscript: () => void;
    copyTranscript: () => Promise<void>;
    handleManualTextChange: (text: string) => void;
    appendManualText: () => void;
    setFinalText: (text: string) => void;
    setLanguage: (lang: string) => void;
}
