import { defineConfig, devices } from '@playwright/test';

declare const process: { env: Record<string, string | undefined> };

/**
 * Playwright configuration for ResponSetara E2E testing.
 * Enforces resource-efficient execution, isolated environment, and comprehensive cross-browser testing.
 */
export default defineConfig({
    testDir: './tests-e2e',
    fullyParallel: false,
    workers: 1,
    timeout: 30000,
    expect: {
        timeout: 5000,
    },
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: process.env.CI ? 'dot' : 'html',
    use: {
        baseURL: process.env.APP_URL || 'http://127.0.0.1:8010',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
    },
    projects: [
        {
            name: 'Desktop Chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'Desktop Firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'Desktop WebKit',
            use: { ...devices['Desktop Safari'] },
        },
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
    ],
    webServer: {
        command: 'php artisan serve --host=127.0.0.1 --port=8010 --env=e2e',
        url: 'http://127.0.0.1:8010',
        reuseExistingServer: !process.env.CI,
        timeout: 120 * 1000,
    },
});
