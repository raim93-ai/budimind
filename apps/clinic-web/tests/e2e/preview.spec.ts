import { expect, test } from 'playwright/test';

test('clinic preview presents the honest launch state', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Psychology care/i);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('psychological care');
  await expect(page.getByText('Bookings are not yet open.')).toBeVisible();
});
