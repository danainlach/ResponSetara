import { test, expect } from '@playwright/test';

test.describe('Landing Page E2E', () => {
    test('should load landing page, display primary elements without foreign text, and toggle text size', async ({ page }) => {
        await page.goto('/');

        // Verify page content does not contain foreign text 'বিজ্ঞান'
        const bodyText = await page.textContent('body');
        expect(bodyText).not.toContain('বিজ্ঞান');

        // Verify presence of primary heading (h1)
        const h1 = page.locator('h1').first();
        await expect(h1).toBeVisible();

        // Verify navigation links to the 3 main emergency communication modes
        const assistanceLink = page.locator('a[href*="/bantuan-darurat"]').first();
        await expect(assistanceLink).toBeVisible();

        const nonverbalLink = page.locator('a[href*="/tidak-dapat-berbicara"]').first();
        await expect(nonverbalLink).toBeVisible();

        const deafLink = page.locator('a[href*="/tidak-dapat-mendengar"]').first();
        await expect(deafLink).toBeVisible();

        // Verify Emergency Contacts section is rendered
        const emergencyContactsSection = page.locator('#emergency-contacts, [aria-labelledby="emergency-contacts-heading"]').first();
        await expect(emergencyContactsSection).toBeVisible();

        // Verify Text Size toggle works correctly
        const textSizeBtn = page.getByRole('button', { name: /Teks Besar|Perbesar ukuran teks/i }).filter({ visible: true }).first();
        await expect(textSizeBtn).toBeVisible();
        await textSizeBtn.click();

        // After click, label dynamically changes to 'Teks Normal' and aria-pressed becomes true
        const normalSizeBtn = page.getByRole('button', { name: /Teks Normal|Kembalikan/i }).filter({ visible: true }).first();
        await expect(normalSizeBtn).toHaveAttribute('aria-pressed', 'true');

        // Re-toggle back to normal
        await normalSizeBtn.click();
        const revertedBtn = page.getByRole('button', { name: /Teks Besar|Perbesar ukuran teks/i }).filter({ visible: true }).first();
        await expect(revertedBtn).toHaveAttribute('aria-pressed', 'false');
    });
});
