 
// TypeScript manual declarations for browser Web Speech API without using 'any'

interface SpeechRecognitionErrorEvent extends Event {
    readonly error: 'not-allowed' | 'service-not-allowed' | 'audio-capture' | 'no-speech' | 'network' | 'aborted' | 'language-not-supported' | 'bad-grammar' | 'unknown' | 'permission-denied' | string;
    readonly message: string;
}

interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
}

interface SpeechRecognitionResult extends Array<SpeechRecognitionAlternative> {
    readonly isFinal: boolean;
    readonly item: (index: number) => SpeechRecognitionAlternative;
}

interface SpeechRecognitionResultList extends Array<SpeechRecognitionResult> {
    readonly item: (index: number) => SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
}

interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    continuous: boolean;
    maxAlternatives: number;
    onstart: ((this: SpeechRecognition, ev: Event) => unknown) | null;
    onend: ((this: SpeechRecognition, ev: Event) => unknown) | null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => unknown) | null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => unknown) | null;
    start(): void;
    stop(): void;
    abort(): void;
}

interface SpeechRecognitionConstructor {
    prototype: SpeechRecognition;
    new (): SpeechRecognition;
}

declare interface Window {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
}
