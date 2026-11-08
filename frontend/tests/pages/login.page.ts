import { Page, expect } from '@playwright/test';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
    await expect(this.page.getByRole('heading', { name: 'Pedia Centre' })).toBeVisible();
  }

  async chooseRole(role: 'Parent' | 'Doctor' | 'Admin') {
    await this.page.getByRole('button', { name: role, exact: true }).click();
  }

  async fillCredentials(identifier: string, password: string) {
    await this.page.locator('input[formcontrolname="identifier"]').fill(identifier);
    await this.page.locator('input[formcontrolname="password"]').fill(password);
  }

  async submit() {
    await this.page.getByRole('button', { name: 'Sign in' }).click();
  }

  async login(role: 'Parent' | 'Doctor' | 'Admin', identifier: string, password: string) {
    await this.chooseRole(role);
    await this.fillCredentials(identifier, password);
    await this.submit();
  }
}
