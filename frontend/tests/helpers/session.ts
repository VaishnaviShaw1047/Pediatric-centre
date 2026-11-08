import { Page } from '@playwright/test';
import { fakeJwt } from './jwt';

export type TestRole = 'guardian' | 'doctor' | 'admin';

export const TEST_USERS = {
  guardian: { identifier: '9876543210', password: 'Parent@123', userId: 11 },
  doctor: { identifier: 'DOC001', password: 'Doctor@123', userId: 21, name: 'Meera Shah' },
  admin: { identifier: 'admin', password: 'Admin@123', userId: 1 },
} as const;

export function sessionPayload(
  role: TestRole,
  extras: { mustChangePassword?: boolean; name?: string } = {},
) {
  const user = TEST_USERS[role];
  return {
    token: fakeJwt(user.userId),
    role,
    userId: user.userId,
    name: extras.name ?? ('name' in user ? user.name : undefined),
    mustChangePassword: extras.mustChangePassword ?? false,
  };
}

export async function seedSession(
  page: Page,
  role: TestRole,
  extras: { mustChangePassword?: boolean; name?: string } = {},
) {
  const session = sessionPayload(role, extras);
  await page.goto('/login');
  await page.evaluate((value) => {
    localStorage.setItem('pc_session', JSON.stringify(value));
  }, session);
}
