import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Automated Accessibility (A11y) Audit E2E', () => {
    const pagesToTest = [
        { name: 'Landing Page', path: '/' },
        { name: 'Mode Saya Butuh Bantuan', path: '/bantuan-darurat' },
        { name: 'Mode Tidak Dapat Berbicara', path: '/tidak-dapat-berbicara' },
        { name: 'Mode Tidak Dapat Mendengar', path: '/tidak-dapat-mendengar' },
    ];

    for (const pageInfo of pagesToTest) {
        test(`should have zero critical or serious WCAG accessibility violations on ${pageInfo.name} (${pageInfo.path})`, async ({ page }) => {
            await page.goto(pageInfo.path);

            const accessibilityScanResults = await new AxeBuilder({ page })
                .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
                .analyze();

            const criticalOrSeriousViolations = accessibilityScanResults.violations.filter(
                (violation) => violation.impact === 'critical' || violation.impact === 'serious'
            );

            expect(
                criticalOrSeriousViolations,
                `Critical/Serious accessibility violations discovered on ${pageInfo.name}: ${JSON.stringify(criticalOrSeriousViolations, null, 2)}`
            ).toEqual([]);
        });
    }
});
