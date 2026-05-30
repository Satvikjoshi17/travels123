import { test, expect } from '@playwright/test';

test('homepage loads correctly', async ({ page }) => {
  await page.goto('/');
  // Checking if the page body is visible
  await expect(page.locator('body')).toBeVisible();
});
