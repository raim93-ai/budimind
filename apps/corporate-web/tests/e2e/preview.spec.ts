import { expect, test } from 'playwright/test';

test('corporate preview presents the launch state', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/BudiMind/i);
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /sign in|login/i })).toHaveCount(0);
});
