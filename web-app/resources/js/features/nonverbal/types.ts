export interface QuickPhraseItem {
    id: number;
    category_id?: number | null;
    mode?: 'nonverbal' | 'deaf' | 'general' | string;
    phrase_text: string;
    speech_text?: string | null;
    simplified_text?: string | null;
    priority?: string | number;
    sort_order?: number;
}

export interface EmergencyCategoryItem {
    id: number;
    name: string;
    slug: string;
    description?: string | null;
    icon?: string | null;
}

export type SpeechStatus = 
    | 'ready' 
    | 'speaking' 
    | 'paused' 
    | 'finished' 
    | 'unsupported' 
    | 'error';

export type SpeechRate = 0.75 | 1.0 | 1.25 | 1.5;

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
