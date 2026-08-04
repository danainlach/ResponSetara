import { test, expect } from '@playwright/test';

test.describe('Theme Isolation E2E Tests', () => {
    test('1. Landing page does not have .admin-shell or .dark global class', async ({ page }) => {
        await page.goto('/');
        
        // Assert absence of admin shell
        const adminShell = page.locator('.admin-shell');
        await expect(adminShell).not.toBeVisible();
        
        // Assert absence of global .dark class on html and body
        const isHtmlDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
        const isBodyDark = await page.evaluate(() => document.body.classList.contains('dark'));
        expect(isHtmlDark).toBe(false);
        expect(isBodyDark).toBe(false);

        // Screenshot landing
        await page.screenshot({ path: 'test-results/landing-desktop.png' });
    });

    test('2. Login page does not have .admin-shell or .dark global class', async ({ page }) => {
        await page.goto('/login');
        
        // Assert absence of admin shell
        const adminShell = page.locator('.admin-shell');
        await expect(adminShell).not.toBeVisible();
        
        // Assert absence of global .dark class on html and body
        const isHtmlDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
        const isBodyDark = await page.evaluate(() => document.body.classList.contains('dark'));
        expect(isHtmlDark).toBe(false);
        expect(isBodyDark).toBe(false);

        // Screenshot login
        await page.screenshot({ path: 'test-results/login-desktop.png' });
    });

    test('3. Admin panel defaults to dark and contains .admin-shell', async ({ page }) => {
        // Authenticate
        await page.goto('/login');
        await page.locator('input[name="email"]').fill('e2e-admin@example.test');
        await page.locator('input[name="password"]').fill('E2E-only-password-not-for-production');
        await page.getByRole('button', { name: /Log in|Masuk|Login/i }).click();
        await expect(page).toHaveURL(/.*\/(admin\/dashboard|dashboard)/, { timeout: 10000 });
        
        if (!page.url().endsWith('/admin/dashboard')) {
            await page.goto('/admin/dashboard');
        }

        await page.waitForLoadState('networkidle');

        // Assert presence of admin shell
        const adminShell = page.locator('.admin-shell');
        await expect(adminShell).toBeVisible();
        
        // Check if resolves to dark
        const hasDarkClass = await adminShell.first().evaluate((el) => el.classList.contains('dark'));
        expect(hasDarkClass).toBe(true);

        // Screenshot dashboard
        await page.screenshot({ path: 'test-results/dashboard-admin-dark.png' });
    });

    test('4. Settings page is under .admin-shell', async ({ page }) => {
        // Authenticate
        await page.goto('/login');
        await page.locator('input[name="email"]').fill('e2e-admin@example.test');
        await page.locator('input[name="password"]').fill('E2E-only-password-not-for-production');
        await page.getByRole('button', { name: /Log in|Masuk|Login/i }).click();
        await expect(page).toHaveURL(/.*\/(admin\/dashboard|dashboard)/, { timeout: 10000 });

        // Visit profile settings
        await page.goto('/settings/profile');
        await page.waitForLoadState('networkidle');
        const profileShell = page.locator('.admin-shell');
        await expect(profileShell).toBeVisible();
        await page.screenshot({ path: 'test-results/settings-profile-dark.png' });

        // Visit appearance settings
        await page.goto('/settings/appearance');
        await page.waitForLoadState('networkidle');
        const appearanceShell = page.locator('.admin-shell');
        await expect(appearanceShell).toBeVisible();
        await page.screenshot({ path: 'test-results/settings-appearance-dark.png' });
    });

    test('5. Theme changes are isolated and do not poison landing or login', async ({ page }) => {
        // Authenticate
        await page.goto('/login');
        await page.locator('input[name="email"]').fill('e2e-admin@example.test');
        await page.locator('input[name="password"]').fill('E2E-only-password-not-for-production');
        await page.getByRole('button', { name: /Log in|Masuk|Login/i }).click();
        await expect(page).toHaveURL(/.*\/(admin\/dashboard|dashboard)/, { timeout: 10000 });

        // Go to settings and switch to light
        await page.goto('/settings/appearance');
        await page.waitForLoadState('networkidle');
        
        // Select 'Terang' tab
        const lightTab = page.getByRole('button', { name: /Terang/i }).first();
        await expect(lightTab).toBeVisible();
        await lightTab.click();
        
        // Assert admin shell no longer has .dark
        const adminShell = page.locator('.admin-shell');
        const hasDarkClass = await adminShell.first().evaluate((el) => el.classList.contains('dark'));
        expect(hasDarkClass).toBe(false);

        // Go back to landing page and check if it is still light and classless
        await page.goto('/');
        const isHtmlDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
        expect(isHtmlDark).toBe(false);

        // Go to login page and check if it is still light and classless
        await page.goto('/login');
        const isLoginHtmlDark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
        expect(isLoginHtmlDark).toBe(false);
    });
});
