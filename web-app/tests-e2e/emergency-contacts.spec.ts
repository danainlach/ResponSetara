import { test, expect } from '@playwright/test';

test.describe('Kontak Darurat Resmi E2E', () => {
    test.beforeEach(async ({ page }) => {
        // Intercept tel: link clicks to ensure zero real mobile telephone dialing
        await page.addInitScript(() => {
            window.addEventListener('click', (e) => {
                const target = e.target as HTMLElement;
                const link = target.closest('a');

                if (link && link.href.startsWith('tel:')) {
                    e.preventDefault();
                    (window as any)._interceptedTelLink = link.href;
                }
            }, true);
        });

        await page.goto('/');
    });

    test('should open confirmation modal for emergency call, verify tel link attribute, and close cleanly', async ({ page }) => {
        // Locate trigger button for an official emergency contact (labeled 'Siapkan Panggilan ➔' or matching aria-label)
        const contactBtn = page.getByRole('button', { name: /Siapkan Panggilan/i }).first();
        await expect(contactBtn).toBeVisible();

        // Click trigger to open modal
        await contactBtn.click();

        // Verify modal dialogue is displayed
        const modalDialog = page.locator('[role="dialog"], [role="alertdialog"], .fixed').filter({ hasText: /Hubungi/i }).first();
        await expect(modalDialog).toBeVisible();

        // Verify official call button presence in the modal
        const callLink = modalDialog.locator('a[href^="tel:"]').first();
        await expect(callLink).toBeVisible();

        // Verify target href attribute matches protocol exactly without initiating hardware dialing
        const hrefAttr = await callLink.getAttribute('href');
        expect(hrefAttr).toMatch(/^tel:\d+/);

        // Click call link to test interception
        await callLink.click();
        const intercepted = await page.evaluate(() => (window as any)._interceptedTelLink);
        expect(intercepted).toBe(hrefAttr);

        // Close modal via Batal button
        const closeBtn = modalDialog.getByRole('button', { name: /Batal|Tutup|Kembali/i }).first();

        if (await closeBtn.isVisible()) {
            await closeBtn.click();
        } else {
            await page.keyboard.press('Escape');
        }

        // Verify modal disappears cleanly
        await expect(modalDialog).toBeHidden({ timeout: 5000 });
    });
});
