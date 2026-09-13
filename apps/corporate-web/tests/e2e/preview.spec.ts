import { expect, test } from 'playwright/test';

test('corporate preview presents the launch state', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/BudiMind/i);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /sign in|login/i })).toHaveCount(0);
});

test('corporate shell remains usable at required viewports and fallback states', async ({
  page,
}) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeAttached();
    expect(await page.evaluate('document.documentElement.scrollWidth')).toBeLessThanOrEqual(width);
  }
  await page.goto('/maintenance');
  await expect(page.getByRole('heading', { name: /temporarily paused/i })).toBeVisible();
  await page.goto('/session-expired');
  await expect(page.getByRole('heading', { name: /session has ended/i })).toBeVisible();
});
