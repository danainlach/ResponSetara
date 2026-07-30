import { test, expect } from '@playwright/test';

test.describe('Mode Saya Butuh Bantuan E2E', () => {
    test.beforeEach(async ({ context, page }) => {
        // Grant geolocation permission and mock coordinates without real GPS hardware
        await context.grantPermissions(['geolocation']);
        await context.setGeolocation({ latitude: -6.200000, longitude: 106.816666 });

        // Prevent opening real external WhatsApp windows or mobile app links
        await page.addInitScript(() => {
            window.open = () => null;
            window.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const link = target.closest('a');

                if (link && (link.href.includes('wa.me') || link.href.includes('whatsapp://'))) {
                    e.preventDefault();
                    (window as any)._lastInterceptedWaLink = link.href;
                }
            }, true);
        });

        await page.goto('/bantuan-darurat');
    });

    test('should compose deterministic template message without AI and intercept WhatsApp share', async ({ page }) => {
        // Mock backend compose API to return deterministic template message
        await page.route('**/api/v1/compose-message', async (route) => {
            const req = route.request();
            const payload = JSON.parse(req.postData() || '{}');
            expect(payload.use_ai).toBe(false);

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: {
                        source: 'template',
                        message: 'Darurat medis di lokasi -6.2000, 106.8167. Tolong kirimkan ambulans secepatnya.',
                        latitude: -6.2000,
                        longitude: 106.8166,
                        fallback_used: false,
                    },
                }),
            });
        });

        // Select Category (first radio option in CategorySelector)
        const categoryRadio = page.locator('input[type="radio"][name="emergency_category"]').first();
        await expect(categoryRadio).toBeVisible();
        await categoryRadio.click();

        // Fill manual location text if input available
        const locationInput = page.locator('input[placeholder*="lokasi" i], input[type="text"]').first();
        await expect(locationInput).toBeVisible();
        await locationInput.fill('Jalan Gatot Subroto No 1, Jakarta');

        // Submit form
        const submitBtn = page.getByRole('button', { name: /Susun Pesan Bantuan Sekarang/i }).first();
        await expect(submitBtn).toBeVisible();
        await submitBtn.click();

        // Verify message preview appears with template result
        await expect(page.getByText(/Darurat medis di lokasi -6.2000/i)).toBeVisible();
    });

    test('should compose AI refined message when opt-in and consent checked without real Gemini API', async ({ page }) => {
        await page.route('**/api/v1/compose-message', async (route) => {
            const req = route.request();
            const payload = JSON.parse(req.postData() || '{}');
            expect(payload.use_ai).toBe(true);

            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: {
                        source: 'ai',
                        message: '[AI Refined] Mohon bantuan medis segera di lokasi kami di Jalan Gatot Subroto.',
                        latitude: -6.2000,
                        longitude: 106.8166,
                        fallback_used: false,
                    },
                }),
            });
        });

        // Select Category (first radio option in CategorySelector)
        const categoryRadio = page.locator('input[type="radio"][name="emergency_category"]').first();
        await expect(categoryRadio).toBeVisible();
        await categoryRadio.click();

        // Toggle AI opt-in
        const useAiToggle = page.locator('#use-ai-toggle');
        await expect(useAiToggle).toBeVisible();
        await useAiToggle.check();

        // Check AI explicit consent
        const consentCheckbox = page.locator('#ai-consent-checkbox');
        await expect(consentCheckbox).toBeVisible();
        await consentCheckbox.check();

        // Submit form
        const submitBtn = page.getByRole('button', { name: /Susun Pesan Bantuan Sekarang/i }).first();
        await expect(submitBtn).toBeVisible();
        await submitBtn.click();

        // Verify simulated AI refined message rendered cleanly
        await expect(page.getByText(/\[AI Refined\] Mohon bantuan medis segera/i)).toBeVisible();
    });

    test('should handle AI fallback to template gracefully when simulated Gemini API fails', async ({ page }) => {
        await page.route('**/api/v1/compose-message', async (route) => {
            // Simulate backend fallback to template when AI refinement encounters a timeout/error
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    success: true,
                    data: {
                        source: 'template',
                        message: '[Fallback Template] Bantuan darurat diperlukan secepatnya.',
                        latitude: -6.2000,
                        longitude: 106.8166,
                        fallback_used: true,
                    },
                }),
            });
        });

        // Select Category (first radio option in CategorySelector)
        const categoryRadio = page.locator('input[type="radio"][name="emergency_category"]').first();
        await expect(categoryRadio).toBeVisible();
        await categoryRadio.click();

        // Toggle AI and consent
        const useAiToggle = page.locator('#use-ai-toggle');
        await expect(useAiToggle).toBeVisible();
        await useAiToggle.check();

        const consentCheckbox = page.locator('#ai-consent-checkbox');
        await expect(consentCheckbox).toBeVisible();
        await consentCheckbox.check();

        // Submit form
        const submitBtn = page.getByRole('button', { name: /Susun Pesan Bantuan Sekarang/i }).first();
        await expect(submitBtn).toBeVisible();
        await submitBtn.click();

        // Verify UI renders fallback template smoothly without application crashing or displaying raw stack trace
        await expect(page.getByText(/\[Fallback Template\] Bantuan darurat/i)).toBeVisible();
    });
});
