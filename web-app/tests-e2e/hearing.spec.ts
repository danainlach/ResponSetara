import { test, expect } from '@playwright/test';

test.describe('Mode Tidak Dapat Mendengar (STT) E2E', () => {
    test.beforeEach(async ({ page }) => {
        // Inject SpeechRecognition mock to prevent real microphone recording and simulate audio transcription
        await page.addInitScript(() => {
            class MockSpeechRecognition extends EventTarget {
                continuous = true;
                interimResults = true;
                lang = 'id-ID';
                onstart?: (e: Event) => void;
                onresult?: (e: any) => void;
                onerror?: (e: any) => void;
                onend?: (e: Event) => void;

                start() {
                    if (this.onstart) {
                        this.onstart(new Event('start'));
                    }

                    // Simulate speech transcription delivery after brief delay
                    setTimeout(() => {
                        if (this.onresult) {
                            this.onresult({
                                resultIndex: 0,
                                results: [
                                    Object.assign(
                                        [
                                            {
                                                transcript: 'Tolong kirimkan ambulans sekarang, ini transkrip E2E.',
                                                confidence: 0.98,
                                            },
                                        ],
                                        { isFinal: true }
                                    ),
                                ],
                            });
                        }
                    }, 200);
                }

                stop() {
                    if (this.onend) {
                        this.onend(new Event('end'));
                    }
                }

                abort() {
                    if (this.onend) {
                        this.onend(new Event('end'));
                    }
                }
            }

            Object.defineProperty(window, 'SpeechRecognition', { value: MockSpeechRecognition, writable: true, configurable: true });
            Object.defineProperty(window, 'webkitSpeechRecognition', { value: MockSpeechRecognition, writable: true, configurable: true });
        });

        await page.goto('/tidak-dapat-mendengar');
    });

    test('should start mock recognition and render transcription text cleanly without real hardware microphone', async ({ page }) => {
        // Locate start listening toggle / button
        const listenBtn = page.getByRole('button', { name: /Mulai Mendengarkan/i }).first();
        await expect(listenBtn).toBeVisible();
        await expect(listenBtn).toBeEnabled();
        await listenBtn.click();

        // Assert that simulated transcription text appears on screen
        await expect(page.getByText(/Tolong kirimkan ambulans sekarang, ini transkrip E2E/i)).toBeVisible({ timeout: 5000 });

        // Stop listening (button name switches to Berhenti)
        const stopBtn = page.getByRole('button', { name: /Berhenti/i }).first();

        if (await stopBtn.isVisible()) {
            await stopBtn.click();
        }
    });
});
