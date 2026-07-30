import { test, expect } from '@playwright/test';

test.describe('Mode Tidak Dapat Berbicara (TTS) E2E', () => {
    test.beforeEach(async ({ page }) => {
        // Inject SpeechSynthesis browser API mock to avoid hardware speaker audio and test offline capability
        await page.addInitScript(() => {
            (window as any)._spokenTexts = [] as string[];
            const mockSpeechSynthesis = {
                speak: (utterance: any) => {
                    (window as any)._spokenTexts.push(utterance.text);
                    mockSpeechSynthesis.speaking = true;

                    if (utterance.onstart) {
setTimeout(() => utterance.onstart(new Event('start')), 10);
}

                    if (utterance.onend) {
setTimeout(() => {
                        mockSpeechSynthesis.speaking = false;
                        utterance.onend(new Event('end'));
                    }, 200);
}
                },
                cancel: () => {
                    mockSpeechSynthesis.speaking = false;
                },
                pause: () => {},
                resume: () => {},
                getVoices: () => [{ name: 'Bahasa Indonesia E2E Voice', lang: 'id-ID', default: true, voiceURI: 'id-ID-E2E' }],
                speaking: false,
                pending: false,
                paused: false,
                addEventListener: () => {},
                removeEventListener: () => {},
                dispatchEvent: () => true,
            };
            Object.defineProperty(window, 'speechSynthesis', { value: mockSpeechSynthesis, writable: true, configurable: true });

            class MockUtterance {
                text: string;
                lang: string;
                voice?: any;
                rate?: number;
                onstart?: (event: Event) => void;
                onend?: (event: Event) => void;
                onerror?: (event: Event) => void;
                constructor(text?: string) {
                    this.text = text || '';
                    this.lang = 'id-ID';
                }
            }
            Object.defineProperty(window, 'SpeechSynthesisUtterance', { value: MockUtterance, writable: true, configurable: true });
        });

        await page.goto('/tidak-dapat-berbicara');
    });

    test('should load nonverbal TTS interface, verify Indonesian label normalisation (Berhenti vs Setop), and simulate speaking', async ({ page }) => {
        // Verify absence of incorrect label 'Setop'
        const bodyText = await page.textContent('body');
        expect(bodyText).not.toContain('Setop');
        expect(bodyText).not.toContain('setop');

        // Fill text input/textarea directly
        const textArea = page.locator('textarea, input[type="text"]').first();
        await expect(textArea).toBeVisible();
        await textArea.fill('Saya butuh pertolongan medis segera.');

        // Locate and trigger the Bacakan Suara button
        const speakBtn = page.getByRole('button', { name: /Bacakan teks dengan suara/i }).first();
        await expect(speakBtn).toBeVisible();
        await speakBtn.click();

        // Verify spoken text recorded by mock
        await page.waitForFunction(() => (window as any)._spokenTexts && (window as any)._spokenTexts.length > 0, null, { timeout: 5000 });
        const spokenTexts: string[] = await page.evaluate(() => (window as any)._spokenTexts);
        expect(spokenTexts.length).toBeGreaterThan(0);
        expect(spokenTexts[0]).toContain('Saya butuh pertolongan medis segera');

        // Double check normalisation: 'Berhenti' should be the only stop text in controls
        const remainingContent = await page.textContent('body');
        expect(remainingContent).not.toContain('Setop');
    });
});
