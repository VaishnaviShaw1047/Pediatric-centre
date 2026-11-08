import { test, expect } from '@playwright/test';
import { mockBackend } from '../helpers/mocks';

test.describe('Parent registration', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
  });

  test('login links to register and back', async ({ page }) => {
    await page.goto('/login');
    await page.getByRole('link', { name: 'Create an account' }).click();
    await expect(page).toHaveURL(/\/register/);
    await expect(page.getByRole('heading', { name: 'Create your account' })).toBeVisible();
    await page.getByRole('link', { name: 'Sign in' }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test('shows validation when submitting an empty form', async ({ page }) => {
    await page.goto('/register');
    await page.getByRole('button', { name: 'Create account' }).click();
    await expect(page.getByText('Please fix the highlighted fields.')).toBeVisible();
    await expect(page.getByText('This is required').first()).toBeVisible();
  });

  test('can add and remove a second child', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: 'Child 1' })).toBeVisible();
    await page.getByRole('button', { name: '+ Add another child' }).click();
    await expect(page.getByRole('heading', { name: 'Child 2' })).toBeVisible();
    await page.getByRole('button', { name: 'Remove' }).last().click();
    await expect(page.getByRole('heading', { name: 'Child 2' })).toHaveCount(0);
  });

  test('creates an account and shows MRN', async ({ page }) => {
    await page.goto('/register');

    await page.getByLabel('First name').first().fill('Priya');
    await page.getByLabel('Last name').first().fill('Patel');
    await page.getByLabel('Relationship to child').selectOption('Mother');
    await page.getByLabel('Mobile number (10 digits, starts with 6-9)').fill('9876543210');
    await page.getByLabel('Password (minimum 8 characters)').fill('Parent@123');
    await page.getByLabel('Confirm password').fill('Parent@123');
    await page.getByLabel('Address line 1').fill('12 Lake Road');
    await page.getByLabel('City').fill('Kolkata');
    await page.getByLabel('State').fill('West Bengal');
    await page.getByLabel('Pincode (6 digits)').fill('700001');

    const child = page.locator('.child').first();
    await child.getByLabel('First name').fill('Aarav');
    await child.getByLabel('Last name').fill('Patel');
    await child.getByLabel('Date of birth').fill('2018-04-12');
    await child.getByLabel('Gender').selectOption('Male');

    await page.getByLabel('I accept the terms and conditions').check();
    await page.getByLabel("I consent to the use of my child's health data").check();
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page.getByRole('heading', { name: 'Registration successful' })).toBeVisible();
    await expect(page.getByText('MRN-101')).toBeVisible();
    await page.getByRole('link', { name: 'Go to sign in' }).click();
    await expect(page).toHaveURL(/\/login/);
  });
});
