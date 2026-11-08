import { Page, Route } from '@playwright/test';
import { fakeJwt } from './jwt';
import {
  appointment,
  cancelledAppointment,
  children,
  doctors,
  patientsPage,
  specialties,
  treatmentRecord,
  usersPage,
} from './fixtures';
import { TEST_USERS } from './session';

const json = (route: Route, status: number, body: unknown) =>
  route.fulfill({
    status,
    contentType: 'application/json',
    body: JSON.stringify(body),
  });

export async function mockBackend(page: Page) {
  await page.route('**/api/v1/**', async (route) => {
    const request = route.request();
    const method = request.method();
    const url = new URL(request.url());
    const path = url.pathname.replace(/\/$/, '').replace(/^.*\/api\/v1/, '');
    const body = () => {
      try {
        return request.postDataJSON() as Record<string, unknown>;
      } catch {
        return {};
      }
    };

    if (method === 'POST' && path.endsWith('/auth/login')) {
      const { mobile_number, password } = body();
      if (mobile_number === TEST_USERS.guardian.identifier && password === TEST_USERS.guardian.password) {
        return json(route, 200, {
          access_token: fakeJwt(TEST_USERS.guardian.userId),
          token_type: 'bearer',
        });
      }
      return json(route, 401, { detail: 'Invalid credentials' });
    }

    if (method === 'POST' && path.endsWith('/auth/doctor-login')) {
      const { staff_id, password } = body();
      if (staff_id === TEST_USERS.doctor.identifier && password === TEST_USERS.doctor.password) {
        return json(route, 200, {
          access_token: fakeJwt(TEST_USERS.doctor.userId),
          token_type: 'bearer',
          must_change_password: false,
          doctor_name: TEST_USERS.doctor.name,
        });
      }
      if (staff_id === 'DOC-TEMP' && password === 'Temp@1234') {
        return json(route, 200, {
          access_token: fakeJwt(22),
          token_type: 'bearer',
          must_change_password: true,
          doctor_name: 'New Doctor',
        });
      }
      return json(route, 401, { detail: 'Invalid credentials' });
    }

    if (method === 'POST' && path.endsWith('/auth/admin-login')) {
      const { username, password } = body();
      if (username === TEST_USERS.admin.identifier && password === TEST_USERS.admin.password) {
        return json(route, 200, {
          access_token: fakeJwt(TEST_USERS.admin.userId),
          token_type: 'bearer',
        });
      }
      return json(route, 401, { detail: 'Invalid credentials' });
    }

    if (method === 'POST' && path.endsWith('/registration')) {
      return json(route, 201, {
        guardian_id: 11,
        patients: [{ patient_id: 101, mrn: 'MRN-101', first_name: 'Aarav' }],
        message: 'Account created',
      });
    }

    if (method === 'POST' && path.endsWith('/auth/doctor/change-password')) {
      return json(route, 200, { message: 'Password updated' });
    }

    if (method === 'GET' && path.endsWith('/doctors/specialties')) {
      return json(route, 200, specialties);
    }

    if (method === 'GET' && path.endsWith('/doctors/available')) {
      const specialty = url.searchParams.get('specialty');
      const rows = specialty && specialty !== 'Pediatrics' ? [] : doctors;
      return json(route, 200, rows);
    }

    if (method === 'GET' && /\/doctors\/\d+\/slots$/.test(path)) {
      return json(route, 200, {
        doctor_id: 21,
        doctor_name: 'Dr. Meera Shah',
        date: url.searchParams.get('date'),
        day_of_week: 1,
        slots: ['10:00', '10:15', '11:00'],
      });
    }

    if (method === 'GET' && /\/doctors\/\d+\/availability$/.test(path)) {
      return json(route, 200, []);
    }

    if (method === 'GET' && /\/doctors\/\d+$/.test(path)) {
      return json(route, 200, doctors[0]);
    }

    if (method === 'GET' && path.endsWith('/doctors')) {
      const search = (url.searchParams.get('search') ?? '').toLowerCase();
      const rows = search && !'meera shah pediatrics'.includes(search) ? [] : doctors;
      return json(route, 200, rows);
    }

    if (method === 'POST' && path.endsWith('/doctors')) {
      return json(route, 201, {
        doctor_id: 99,
        staff_id: 'DOC099',
        first_name: body().first_name,
        last_name: body().last_name,
        specialty: body().specialty,
        message: 'Doctor created',
      });
    }

    if (method === 'GET' && path === '/patients/mine') {
      return json(route, 200, children);
    }

    if (method === 'GET' && /\/patients\/\d+\/treatment-history$/.test(path)) {
      return json(route, 200, [treatmentRecord]);
    }

    if (method === 'GET' && path === '/doctor/patients') {
      return json(route, 200, children);
    }

    if (method === 'GET' && path === '/patients') {
      return json(route, 200, patientsPage);
    }

    if (method === 'GET' && path === '/doctor/appointments') {
      return json(route, 200, [appointment]);
    }

    if (method === 'GET' && path === '/appointments') {
      return json(route, 200, [appointment]);
    }

    if (method === 'POST' && path === '/appointments') {
      return json(route, 201, appointment);
    }

    if (method === 'PATCH' && /\/appointments\/.+\/cancel$/.test(path)) {
      return json(route, 200, cancelledAppointment);
    }

    if (method === 'GET' && /\/treatment-records\/\d+$/.test(path)) {
      return json(route, 200, [treatmentRecord]);
    }

    if (method === 'POST' && path.endsWith('/treatment-records')) {
      return json(route, 201, treatmentRecord);
    }

    if (method === 'POST' && path.includes('doctor-assignments')) {
      return json(route, 200, {
        message: 'Assigned',
        patient_id: 101,
        patient_name: 'Aarav Patel',
        doctor_id: 21,
        doctor_name: 'Meera Shah',
        assignment_date: '2026-01-10',
      });
    }

    if (method === 'GET' && path.endsWith('/users')) {
      return json(route, 200, usersPage);
    }

    if (method === 'POST' && path.endsWith('/users')) {
      return json(route, 201, {
        user_id: 2,
        username: body().username,
        user_type: body().user_type,
        first_name: body().first_name,
        last_name: body().last_name,
      });
    }

    if (method === 'POST' && /\/users\/\d+\/reset-password$/.test(path)) {
      return json(route, 200, { message: 'Password reset' });
    }

    return json(route, 404, { detail: `Unmocked ${method} ${path}` });
  });
}
