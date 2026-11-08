import { test, expect } from '@playwright/test';
import { mockBackend } from '../helpers/mocks';

test.describe('Smoke', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
  });

  test('root redirects to login and the app is not blank', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/login/);
    await expect(page.getByRole('heading', { name: 'Pedia Centre' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Parent' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Doctor' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Admin' })).toBeVisible();
  });

  test('unknown routes redirect to login', async ({ page }) => {
    await page.goto('/this-page-does-not-exist');
    await expect(page).toHaveURL(/\/login/);
  });
});
