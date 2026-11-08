import { test, expect } from '@playwright/test';
import { mockBackend } from '../helpers/mocks';
import { seedSession } from '../helpers/session';

test.describe('Admin area', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
    await seedSession(page, 'admin');
  });

  test('lists doctors, searches, and redirects availability to the list', async ({ page }) => {
    await page.goto('/admin/doctors');
    await expect(page.getByRole('heading', { name: 'Doctors' })).toBeVisible();
    await expect(page.getByText('Dr. Meera Shah')).toBeVisible();

    await page.getByPlaceholder('Search by name or specialty').fill('cardiology');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText('No doctors found.')).toBeVisible();

    await page.getByPlaceholder('Search by name or specialty').fill('pedia');
    await page.getByRole('button', { name: 'Search' }).click();
    await expect(page.getByText('Dr. Meera Shah')).toBeVisible();

    await page.getByRole('link', { name: 'Set availability' }).click();
    await expect(page).toHaveURL(/\/admin\/doctors$/);
  });

  test('creates a doctor and shows staff ID', async ({ page }) => {
    await page.goto('/admin/doctors/new');
    await expect(page.getByRole('heading', { name: 'Add a doctor' })).toBeVisible();
    await page.getByRole('button', { name: 'Create doctor' }).click();
    await expect(page.getByText('Please fix the highlighted fields.')).toBeVisible();

    await page.getByLabel('First name').fill('Ravi');
    await page.getByLabel('Last name').fill('Iyer');
    await page.getByLabel('Registration number').fill('MCI-999');
    await page.getByLabel('Qualification (e.g. MBBS, MD)').fill('MBBS');
    await page.getByLabel('Specialty').fill('Pediatrics');
    await page.getByLabel('Experience (years)').fill('8');
    await page.getByLabel('Consultation fee (₹)').fill('500');
    await page.getByLabel('Temporary password (minimum 8 characters)').fill('TempPass1');
    await page.getByRole('button', { name: 'Create doctor' }).click();

    await expect(page.getByRole('heading', { name: 'Doctor created' })).toBeVisible();
    await expect(page.getByText('DOC099')).toBeVisible();
  });

  test('lists patients and assigns a doctor', async ({ page }) => {
    await page.goto('/admin/patients');
    await expect(page.getByRole('heading', { name: 'Patients' })).toBeVisible();
    await expect(page.getByText('Aarav Patel')).toBeVisible();
    await page.getByRole('button', { name: 'Assign doctor' }).first().click();
    await page.locator('.assign select').selectOption('21');
    await page.getByRole('button', { name: 'Assign', exact: true }).click({ force: true });
    await expect(page.getByText('Aarav Patel is now assigned to Dr. Meera Shah.')).toBeVisible();
  });

  test('creates a user and resets a password', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'admin' })).toBeVisible();

    await page.getByRole('button', { name: '+ Add user' }).click();
    await page.getByLabel('Username').fill('staff.one');
    await page.getByLabel('Password (min 8)').fill('StaffPass1');
    await page.getByLabel('Type').selectOption('Staff');
    await page.getByLabel('First name').fill('Nisha');
    await page.getByRole('button', { name: 'Create user' }).click();
    await expect(page.getByText('User staff.one created.')).toBeVisible();

    await page.getByRole('button', { name: 'Reset password' }).click();
    await page.getByPlaceholder('New password (min 8)').fill('NewAdmin1');
    // added for debugging 
    page.on('response', async (response) => {
   page.on('response', async (response) => {
  console.log('URL:', response.url());
  console.log('STATUS:', response.status());
  console.log('METHOD:', response.request().method());

  try {
    console.log('BODY:', await response.text());
  } catch (error) {
    console.log('Could not read response body');
  }
});
});
    await page.getByRole('button', { name: 'Reset', exact: true }).click({ force: true });
    await expect(page.getByText('Password reset for admin.')).toBeVisible();
  });
});
