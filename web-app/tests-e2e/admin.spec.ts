import { test, expect } from '@playwright/test';

test.describe('Admin Dashboard, Auth & CMS E2E', () => {
    test('should redirect unauthenticated users from admin dashboard to login', async ({ page }) => {
        await page.goto('/admin/dashboard');
        await expect(page).toHaveURL(/.*\/login/);
    });

    test('should authenticate admin user, verify no-store cache headers, inspect CMS menus, and prevent key leakage', async ({ page }) => {
        // Listen for responses on sensitive routes to verify no-store policy enforcement
        let loginHasNoStore = false;
        let adminHasNoStore = false;

        page.on('response', (response) => {
            const url = response.url();
            const cacheControl = response.headers()['cache-control'] || '';

            if (url.includes('/login') && response.status() === 200) {
                if (cacheControl.includes('no-store')) {
                    loginHasNoStore = true;
                }
            }

            if (url.includes('/admin') && response.status() === 200) {
                if (cacheControl.includes('no-store')) {
                    adminHasNoStore = true;
                }
            }
        });

        // Visit login page
        await page.goto('/login');

        // Fill test E2E credentials
        await page.locator('input[name="email"], input[type="email"]').fill('e2e-admin@example.test');
        await page.locator('input[name="password"], input[type="password"]').fill('E2E-only-password-not-for-production');

        // Click login submit
        await page.getByRole('button', { name: /Log in|Masuk|Login/i }).click();

        // Verify navigation to Admin Dashboard or main Dashboard
        await expect(page).toHaveURL(/.*\/(admin\/dashboard|dashboard)/, { timeout: 10000 });

        // Go explicitly to admin dashboard if on standard dashboard
        await page.goto('/admin/dashboard');
        await expect(page).toHaveURL(/.*\/admin\/dashboard/);

        // Verify presence of CMS management menu items
        const menuContent = await page.textContent('body');
        expect(menuContent).toMatch(/Kategori|Kondisi|Prompt AI|Assistance|Darurat/i);

        // Check AI Prompt CMS section
        const aiPromptLink = page.locator('a[href*="ai-prompts"], a:has-text("Prompt"), a:has-text("AI Prompt")').first();

        if (await aiPromptLink.isVisible()) {
            await aiPromptLink.click();
            await expect(page).toHaveURL(/.*\/admin\/ai-prompts/);
        } else {
            await page.goto('/admin/ai-prompts');
        }

        // Verify zero leakage of sensitive system keys or GEMINI_API_KEY value
        const promptPageText = await page.textContent('body');
        expect(promptPageText).not.toContain('AIza');
        expect(promptPageText).not.toContain('GEMINI_API_KEY');

        // Verify no-store cache control headers were successfully encountered
        expect(loginHasNoStore).toBe(true);
        expect(adminHasNoStore).toBe(true);

        // Verify logout functionality
        const userMenuOrLogoutBtn = page.locator('button:has-text("Logout"), a:has-text("Logout"), button:has-text("Keluar"), a:has-text("Keluar"), [aria-label*="Logout"]').first();

        if (await userMenuOrLogoutBtn.isVisible()) {
            await userMenuOrLogoutBtn.click();
        } else {
            // Some designs nest logout under an avatar or profile dropdown
            const dropdownTrigger = page.locator('button:has(span), .rounded-full').first();

            if (await dropdownTrigger.isVisible()) {
                await dropdownTrigger.click();
                const logoutLink = page.locator('button:has-text("Log Out"), a:has-text("Log Out"), button:has-text("Keluar")').first();

                if (await logoutLink.isVisible()) {
                    await logoutLink.click();
                }
            }
        }
    });
});
