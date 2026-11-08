import { test, expect } from '@playwright/test';
import { mockBackend } from '../helpers/mocks';
import { seedSession } from '../helpers/session';

test.describe('Doctor area', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
    await seedSession(page, 'doctor', { name: 'Meera Shah' });
  });

  test('schedule shows appointments and navigates to history', async ({ page }) => {
    await page.goto('/doctor/schedule');
    await expect(page.getByRole('heading', { name: 'My schedule' })).toBeVisible();
    await expect(page.getByText('Aarav Patel')).toBeVisible();
    await page.getByRole('button', { name: 'All' }).click();
    await page.getByRole('link', { name: 'History' }).click();
    await expect(page).toHaveURL(/\/doctor\/patients\/101/);
    await expect(page.getByRole('heading', { name: 'Treatment history' })).toBeVisible();
    await expect(page.getByText('Viral fever')).toBeVisible();
  });

  test('patients list can be searched', async ({ page }) => {
    await page.goto('/doctor/patients');
    await expect(page.getByText('2 patient(s)')).toBeVisible();
    await page.getByPlaceholder('Search by name, MRN or guardian mobile').fill('Anaya');
    await expect(page.getByText('1 patient(s)')).toBeVisible();
    await expect(page.getByRole('heading', { name: /Anaya Patel/ })).toBeVisible();
    await expect(page.getByRole('heading', { name: /Aarav Patel/ })).toHaveCount(0);
  });

  test('adds a treatment record', async ({ page }) => {
    await page.goto('/doctor/patients/101/add-record');
    await expect(page.getByRole('heading', { name: 'Add treatment record' })).toBeVisible();
    await expect(page.getByText(/Aarav Patel/)).toBeVisible();
    await page.getByLabel('Diagnosis').fill('Mild cold');
    await page.getByLabel('Name').fill('Cetirizine');
    await page.getByRole('button', { name: '+ Add medicine' }).click();
    await expect(page.locator('.med')).toHaveCount(2);
    await page.getByRole('button', { name: 'Remove' }).first().click();
    await page.getByRole('button', { name: 'Save record' }).click();
    await expect(page).toHaveURL(/\/doctor\/patients\/101$/);
    await expect(page.getByRole('heading', { name: 'Treatment history' })).toBeVisible();
  });

  test('can update password from the change-password screen', async ({ page }) => {
    await page.goto('/doctor/change-password');
    await page.getByLabel('Current password').fill('Doctor@123');
    await page.getByLabel('New password (minimum 8 characters)').fill('Doctor@456');
    await page.getByLabel('Confirm new password').fill('Doctor@456');
    await page.getByRole('button', { name: 'Update password' }).click();
    await expect(page).toHaveURL(/\/doctor\/schedule/);
  });

  test('forced password change hides clinical navigation', async ({ page }) => {
    await seedSession(page, 'doctor', { name: 'New Doctor', mustChangePassword: true });
    await page.goto('/doctor/schedule');
    await expect(page).toHaveURL(/\/doctor\/change-password/);
    await expect(page.getByRole('link', { name: 'My schedule' })).toHaveCount(0);
    await expect(page.getByRole('link', { name: 'My patients' })).toHaveCount(0);
  });
});
