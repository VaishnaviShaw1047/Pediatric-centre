import { test, expect } from '@playwright/test';
import { mockBackend } from '../helpers/mocks';
import { seedSession } from '../helpers/session';

test.describe('Parent / guardian area', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
    await seedSession(page, 'guardian');
  });

  test('find a doctor lists results and can reset filters', async ({ page }) => {
    await page.goto('/guardian/find-doctor');
    await expect(page.getByRole('heading', { name: 'Find a doctor' })).toBeVisible();
    await expect(page.getByText('1 doctor(s) found')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dr. Meera Shah' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Book appointment' })).toBeVisible();

    await page.getByPlaceholder('e.g. Bengali').fill('Tamil');
    await page.getByLabel('Max fee (₹)').fill('100');
    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(page.getByPlaceholder('e.g. Bengali')).toHaveValue('');
    await expect(page.getByText('1 doctor(s) found')).toBeVisible();
  });

  test('books an appointment for a child', async ({ page }) => {
    await page.goto('/guardian/book/21');
    await expect(page.getByRole('heading', { name: 'Book an appointment' })).toBeVisible();
    await expect(page.getByText('Dr. Meera Shah')).toBeVisible();

    await page.getByLabel('Child').selectOption('101');
    const date = new Date();
    date.setDate(date.getDate() + 7);
    const iso = date.toISOString().slice(0, 10);
    await page.locator('input[type="date"]').fill(iso);
    await expect(page.getByRole('button', { name: '10:00' })).toBeVisible();
    await page.getByRole('button', { name: '10:00' }).click();
    await page.getByPlaceholder('e.g. Fever for two days').fill('Fever');
    await page.getByRole('button', { name: 'Confirm booking' }).click();

    await expect(page.getByRole('heading', { name: 'Appointment booked' })).toBeVisible();
    await expect(page.getByText('APT-501')).toBeVisible();
    await page.getByRole('link', { name: 'View my appointments' }).click();
    await expect(page).toHaveURL(/\/guardian\/my-appointments/);
  });

  test('lists appointments and can cancel one', async ({ page }) => {
    await page.goto('/guardian/my-appointments');
    await expect(page.getByRole('heading', { name: 'My appointments' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dr. Meera Shah' })).toBeVisible();
    await expect(page.getByText('confirmed')).toBeVisible();

    await page.getByRole('button', { name: 'All' }).click();
    await page.getByRole('button', { name: 'Cancel' }).click();
    await expect(page.getByText('Cancel this appointment?')).toBeVisible();
    await page.getByRole('button', { name: 'Yes, cancel' }).click();
    await expect(page.getByText('cancelled')).toBeVisible();
  });

  test('shows treatment history for a selected child', async ({ page }) => {
    await page.goto('/guardian/treatment-history');
    await expect(page.getByRole('heading', { name: 'Treatment history' })).toBeVisible();
    await page.getByLabel('Child').selectOption('101');
    await expect(page.getByText('Viral fever')).toBeVisible();
    await expect(page.getByText('Paracetamol')).toBeVisible();
  });
});
