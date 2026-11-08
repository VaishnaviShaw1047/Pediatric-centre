export const specialties = [{ specialty: 'Pediatrics', doctor_count: 1 }];

export const doctors = [
  {
    doctor_id: 21,
    staff_id: 'DOC001',
    first_name: 'Meera',
    last_name: 'Shah',
    qualification: 'MBBS, MD',
    specialty: 'Pediatrics',
    experience_years: 12,
    languages: 'English, Hindi',
    consultation_fee: 600,
    available_days: 'Mon,Tue,Wed',
    registration_no: 'MCI-123',
  },
];

export const children = [
  {
    patient_id: 101,
    mrn: 'MRN-101',
    first_name: 'Aarav',
    last_name: 'Patel',
    date_of_birth: '2018-04-12',
    gender: 'Male',
    blood_group: 'O+',
    guardian_name: 'Priya Patel',
    guardian_mobile: '9876543210',
  },
  {
    patient_id: 102,
    mrn: 'MRN-102',
    first_name: 'Anaya',
    last_name: 'Patel',
    date_of_birth: '2021-09-01',
    gender: 'Female',
    blood_group: 'A+',
    guardian_name: 'Priya Patel',
    guardian_mobile: '9876543210',
  },
];

export const appointment = {
  appointment_id: 501,
  appointment_ref: 'APT-501',
  doctor_id: 21,
  doctor_name: 'Dr. Meera Shah',
  patient_id: 101,
  patient_name: 'Aarav Patel',
  mrn: 'MRN-101',
  scheduled_at: '2099-06-15T10:00:00',
  duration_minutes: 15,
  status: 'confirmed',
  reason_for_visit: 'Fever',
};

export const cancelledAppointment = { ...appointment, status: 'cancelled' };

export const treatmentRecord = {
  treatment_record_id: 801,
  patient_id: 101,
  patient_name: 'Aarav Patel',
  doctor_id: 21,
  doctor_name: 'Dr. Meera Shah',
  appointment_id: 501,
  visit_date: '2026-01-10T10:00:00',
  diagnosis: 'Viral fever',
  medications: [
    {
      medication_name: 'Paracetamol',
      dosage: '5 ml',
      frequency: 'Twice a day',
      duration: '3 days',
      instructions: 'After food',
    },
  ],
  treatment_plan: 'Rest and fluids',
  follow_up_date: '2026-01-17T00:00:00',
  clinical_notes: 'Monitor temperature',
  record_status: 'final',
  created_at: '2026-01-10T10:20:00',
};

export const usersPage = {
  total: 1,
  page: 1,
  page_size: 10,
  items: [
    {
      user_id: 1,
      username: 'admin',
      user_type: 'Admin',
      first_name: 'Clinic',
      last_name: 'Admin',
    },
  ],
};

export const patientsPage = {
  total: 2,
  page: 1,
  page_size: 10,
  items: children,
};
