import { test, expect } from '@playwright/test';
import { mockBackend } from '../helpers/mocks';
import { TEST_USERS } from '../helpers/session';
import { LoginPage } from '../pages/login.page';

test.describe('Login', () => {
  test.beforeEach(async ({ page }) => {
    await mockBackend(page);
  });

  test('shows parent-specific identifier validation', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.chooseRole('Parent');
    await login.fillCredentials('123', 'secret');
    await page.locator('input[formcontrolname="identifier"]').blur();
    await expect(page.getByText('Enter a valid 10-digit mobile number')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Sign in' })).toBeDisabled();
  });

  test('rejects invalid parent credentials', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('Parent', TEST_USERS.guardian.identifier, 'WrongPass1');
    await expect(page.getByText('Invalid credentials')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('parent can sign in and reach find-a-doctor', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await expect(page.getByRole('link', { name: 'Create an account' })).toBeVisible();
    await login.login('Parent', TEST_USERS.guardian.identifier, TEST_USERS.guardian.password);
    await expect(page).toHaveURL(/\/guardian\/find-doctor/);
    await expect(page.getByRole('heading', { name: 'Find a doctor' })).toBeVisible();
  });

  test('doctor can sign in and reach schedule', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('Doctor', TEST_USERS.doctor.identifier, TEST_USERS.doctor.password);
    await expect(page).toHaveURL(/\/doctor\/schedule/);
    await expect(page.getByRole('heading', { name: 'My schedule' })).toBeVisible();
    await expect(page.getByText('Dr. Meera Shah')).toBeVisible();
  });

  test('doctor with a temporary password is sent to change-password', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.login('Doctor', 'DOC-TEMP', 'Temp@1234');
    await expect(page).toHaveURL(/\/doctor\/change-password/);
    await expect(page.getByText('You are using a temporary password')).toBeVisible();
  });

  test('admin can sign in and is sent to /admin', async ({ page }) => {
    const login = new LoginPage(page);
    await login.goto();
    await login.chooseRole('Admin');
    await expect(page.getByText('Username')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Create an account' })).toHaveCount(0);
    await login.fillCredentials(TEST_USERS.admin.identifier, TEST_USERS.admin.password);
    await login.submit();
    await expect(page).toHaveURL(/\/admin\/doctors/);
    await expect(page.getByRole('heading', { name: 'Doctors' })).toBeVisible();
  });
});
