// Mock implementations for SpeechRecognition and Clipboard to enable automated testing without real microphones or data retention

export class MockSpeechRecognitionErrorEvent extends Event implements SpeechRecognitionErrorEvent {
    readonly error: string;
    readonly message: string;

    constructor(type: string, error: string, message = '') {
        super(type);
        this.error = error;
        this.message = message;
    }
}

export class MockSpeechRecognitionAlternative implements SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;

    constructor(transcript: string, confidence = 1.0) {
        this.transcript = transcript;
        this.confidence = confidence;
    }
}

export class MockSpeechRecognitionResult extends Array<SpeechRecognitionAlternative> implements SpeechRecognitionResult {
    readonly isFinal: boolean;

    constructor(alternatives: SpeechRecognitionAlternative[], isFinal = true) {
        super(...alternatives);
        this.isFinal = isFinal;
        Object.setPrototypeOf(this, MockSpeechRecognitionResult.prototype);
    }

    item(index: number): SpeechRecognitionAlternative {
        return this[index];
    }
}

export class MockSpeechRecognitionResultList extends Array<SpeechRecognitionResult> implements SpeechRecognitionResultList {
    constructor(results: SpeechRecognitionResult[]) {
        super(...results);
        Object.setPrototypeOf(this, MockSpeechRecognitionResultList.prototype);
    }

    item(index: number): SpeechRecognitionResult {
        return this[index];
    }
}

export class MockSpeechRecognitionEvent extends Event implements SpeechRecognitionEvent {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;

    constructor(type: string, results: SpeechRecognitionResult[], resultIndex = 0) {
        super(type);
        this.resultIndex = resultIndex;
        this.results = new MockSpeechRecognitionResultList(results);
    }
}

export class MockSpeechRecognition extends EventTarget implements SpeechRecognition {
    lang = 'id-ID';
    interimResults = true;
    continuous = true;
    maxAlternatives = 1;
    onstart: ((this: SpeechRecognition, ev: Event) => unknown) | null = null;
    onend: ((this: SpeechRecognition, ev: Event) => unknown) | null = null;
    onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => unknown) | null = null;
    onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => unknown) | null = null;
    
    private isRunning = false;

    start(): void {
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;

        if (this.onstart) {
            this.onstart.call(this, new Event('start'));
        }
    }

    stop(): void {
        if (!this.isRunning) {
            return;
        }

        this.isRunning = false;

        if (this.onend) {
            this.onend.call(this, new Event('end'));
        }
    }

    abort(): void {
        this.isRunning = false;

        if (this.onend) {
            this.onend.call(this, new Event('end'));
        }
    }

    simulateSpeech(transcript: string, isFinal: boolean): void {
        if (!this.isRunning || !this.onresult) {
            return;
        }

        const alt = new MockSpeechRecognitionAlternative(transcript, 0.95);
        const res = new MockSpeechRecognitionResult([alt], isFinal);
        const evt = new MockSpeechRecognitionEvent('result', [res], 0);
        this.onresult.call(this, evt);
    }

    simulateError(errorCode: string, message = ''): void {
        if (!this.onerror) {
            return;
        }

        const evt = new MockSpeechRecognitionErrorEvent('error', errorCode, message);
        this.onerror.call(this, evt);
    }
}

export function setupSpeechRecognitionMock(mode: 'supported' | 'webkitOnly' | 'unsupported' = 'supported'): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (mode === 'supported') {
        window.SpeechRecognition = MockSpeechRecognition as unknown as SpeechRecognitionConstructor;
        delete window.webkitSpeechRecognition;
    } else if (mode === 'webkitOnly') {
        delete window.SpeechRecognition;
        window.webkitSpeechRecognition = MockSpeechRecognition as unknown as SpeechRecognitionConstructor;
    } else {
        delete window.SpeechRecognition;
        delete window.webkitSpeechRecognition;
    }
}
