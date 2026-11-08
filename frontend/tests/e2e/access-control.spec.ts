import { test, expect } from '@playwright/test';
import { mockBackend } from '../helpers/mocks';
import { seedSession } from '../helpers/session';

test.describe('Role guards', () => {
  test('unauthenticated users cannot open role areas', async ({ page }) => {
    await mockBackend(page);
    for (const path of ['/guardian/find-doctor', '/doctor/schedule', '/admin/doctors']) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test('a parent cannot open doctor or admin pages', async ({ page }) => {
    await mockBackend(page);
    await seedSession(page, 'guardian');
    await page.goto('/doctor/schedule');
    await expect(page).toHaveURL(/\/login/);
    await page.goto('/admin/doctors');
    await expect(page).toHaveURL(/\/login/);
  });

  test('a doctor cannot open parent or admin pages', async ({ page }) => {
    await mockBackend(page);
    await seedSession(page, 'doctor', { name: 'Meera Shah' });
    await page.goto('/guardian/find-doctor');
    await expect(page).toHaveURL(/\/login/);
    await page.goto('/admin/users');
    await expect(page).toHaveURL(/\/login/);
  });

  test('log out returns to login and blocks the previous area', async ({ page }) => {
    await mockBackend(page);
    await seedSession(page, 'guardian');
    await page.goto('/guardian/find-doctor');
    await page.getByRole('button', { name: 'Log out' }).click();
    await expect(page).toHaveURL(/\/login/);
    await page.goto('/guardian/my-appointments');
    await expect(page).toHaveURL(/\/login/);
  });
});
