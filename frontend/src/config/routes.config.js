/**
 * Routes Configuration
 * Central configuration for all application routes
 */

// Route Paths
export const ROUTES = {
  // Public Routes
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  VERIFY_EMAIL: '/verify-email',

  // Dashboard Routes
  DASHBOARD: '/dashboard',

  // Admin Routes
  ADMIN: {
    BASE: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    USER_DETAILS: (id) => `/admin/users/${id}`,
    STAFF: '/admin/staff',
    STAFF_REGISTRATION: '/admin/staff/register',
    DOCTORS: '/admin/doctors',
    DOCTOR_DETAILS: (id) => `/admin/doctors/${id}`,
    SETTINGS: '/admin/settings',
    AUDIT_LOGS: '/admin/audit-logs',
    SYSTEM_MONITORING: '/admin/monitoring',
  },

  // Doctor Routes
  DOCTOR: {
    BASE: '/doctor',
    DASHBOARD: '/doctor/dashboard',
    PATIENTS: '/doctor/patients',
    PATIENT_DETAILS: (id) => `/doctor/patients/${id}`,
    APPOINTMENTS: '/doctor/appointments',
    SCHEDULE: '/doctor/schedule',
    PRESCRIPTIONS: '/doctor/prescriptions',
    REPORTS: '/doctor/reports',
  },

  // Nurse Routes
  NURSE: {
    BASE: '/nurse',
    DASHBOARD: '/nurse/dashboard',
    PATIENTS: '/nurse/patients',
    PATIENT_CARE: (id) => `/nurse/patients/${id}/care`,
    TASKS: '/nurse/tasks',
    SCHEDULE: '/nurse/schedule',
    WARDS: '/nurse/wards',
    HANDOVER: '/nurse/handover',
  },

  // Patient Routes
  PATIENT: {
    BASE: '/patient',
    DASHBOARD: '/patient/dashboard',
    PROFILE: '/patient/profile',
    BOOK_APPOINTMENT: '/patient/appointments/book',
    APPOINTMENTS: '/patient/appointments',
    MEDICAL_RECORDS: '/patient/medical-records',
    PRESCRIPTIONS: '/patient/prescriptions',
    BILLS: '/patient/bills',
    DOCUMENTS: '/patient/documents',
  },

  // Receptionist Routes
  RECEPTIONIST: {
    BASE: '/receptionist',
    DASHBOARD: '/receptionist/dashboard',
    APPOINTMENTS: '/receptionist/appointments',
    PATIENT_REGISTRATION: '/receptionist/patients/register',
    PATIENTS: '/receptionist/patients',
    CHECK_IN: '/receptionist/check-in',
  },

  // Pharmacist Routes
  PHARMACIST: {
    BASE: '/pharmacist',
    DASHBOARD: '/pharmacist/dashboard',
    PRESCRIPTIONS: '/pharmacist/prescriptions',
    INVENTORY: '/pharmacist/inventory',
    DISPENSE: '/pharmacist/dispense',
  },

  // Common Feature Routes
  PATIENTS: '/patients',
  PATIENT_DETAILS: (id) => `/patients/${id}`,
  DOCTORS: '/doctors',
  DOCTOR_DETAILS: (id) => `/doctors/${id}`,
  APPOINTMENTS: '/appointments',
  APPOINTMENT_DETAILS: (id) => `/appointments/${id}`,
  BILLING: '/billing',
  BILL_DETAILS: (id) => `/billing/${id}`,
  DEPARTMENTS: '/departments',
  DEPARTMENT_DETAILS: (id) => `/departments/${id}`,
  PRESCRIPTIONS: '/prescriptions',
  PRESCRIPTION_DETAILS: (id) => `/prescriptions/${id}`,

  // Inventory Routes
  INVENTORY: {
    BASE: '/inventory',
    ITEMS: '/inventory/items',
    ITEM_DETAILS: (id) => `/inventory/items/${id}`,
    LOW_STOCK: '/inventory/low-stock',
    SUPPLIERS: '/inventory/suppliers',
    ORDERS: '/inventory/orders',
  },

  // Reports Routes
  REPORTS: {
    BASE: '/reports',
    DASHBOARD: '/reports/dashboard',
    PATIENT: '/reports/patient',
    DOCTOR: '/reports/doctor',
    FINANCIAL: '/reports/financial',
    INVENTORY: '/reports/inventory',
    CUSTOM: '/reports/custom',
  },

  // Settings Routes
  SETTINGS: {
    BASE: '/settings',
    PROFILE: '/settings/profile',
    ACCOUNT: '/settings/account',
    SECURITY: '/settings/security',
    NOTIFICATIONS: '/settings/notifications',
    PREFERENCES: '/settings/preferences',
    SYSTEM: '/settings/system',
  },

  // Utility Routes
  PROFILE: '/profile',
  NOTIFICATIONS: '/notifications',
  HELP: '/help',
  ABOUT: '/about',
  CONTACT: '/contact',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  NOT_FOUND: '/404',
  UNAUTHORIZED: '/401',
  MAINTENANCE: '/maintenance',
};

// Route Metadata
export const ROUTE_META = {
  [ROUTES.LOGIN]: {
    title: 'Login',
    requiresAuth: false,
    roles: [],
  },
  [ROUTES.REGISTER]: {
    title: 'Register',
    requiresAuth: false,
    roles: [],
  },
  [ROUTES.DASHBOARD]: {
    title: 'Dashboard',
    requiresAuth: true,
    roles: ['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT', 'RECEPTIONIST', 'PHARMACIST'],
  },
  [ROUTES.ADMIN.DASHBOARD]: {
    title: 'Admin Dashboard',
    requiresAuth: true,
    roles: ['ADMIN'],
  },
  [ROUTES.DOCTOR.DASHBOARD]: {
    title: 'Doctor Dashboard',
    requiresAuth: true,
    roles: ['DOCTOR', 'ADMIN'],
  },
  [ROUTES.NURSE.DASHBOARD]: {
    title: 'Nurse Dashboard',
    requiresAuth: true,
    roles: ['NURSE', 'ADMIN'],
  },
  [ROUTES.PATIENT.DASHBOARD]: {
    title: 'Patient Dashboard',
    requiresAuth: true,
    roles: ['PATIENT', 'ADMIN'],
  },
  [ROUTES.RECEPTIONIST.DASHBOARD]: {
    title: 'Receptionist Dashboard',
    requiresAuth: true,
    roles: ['RECEPTIONIST', 'ADMIN'],
  },
  [ROUTES.PHARMACIST.DASHBOARD]: {
    title: 'Pharmacist Dashboard',
    requiresAuth: true,
    roles: ['PHARMACIST', 'ADMIN'],
  },
};

// Breadcrumb Configuration
export const BREADCRUMBS = {
  [ROUTES.DASHBOARD]: [{ label: 'Dashboard', path: ROUTES.DASHBOARD }],
  [ROUTES.PATIENTS]: [
    { label: 'Dashboard', path: ROUTES.DASHBOARD },
    { label: 'Patients', path: ROUTES.PATIENTS },
  ],
  [ROUTES.DOCTORS]: [
    { label: 'Dashboard', path: ROUTES.DASHBOARD },
    { label: 'Doctors', path: ROUTES.DOCTORS },
  ],
  [ROUTES.APPOINTMENTS]: [
    { label: 'Dashboard', path: ROUTES.DASHBOARD },
    { label: 'Appointments', path: ROUTES.APPOINTMENTS },
  ],
};

// Navigation Items per Role
export const NAVIGATION_BY_ROLE = {
  ADMIN: [
    { label: 'Dashboard', path: ROUTES.ADMIN.DASHBOARD, icon: 'LayoutDashboard' },
    { label: 'Users', path: ROUTES.ADMIN.USERS, icon: 'Users' },
    { label: 'Doctors', path: ROUTES.ADMIN.DOCTORS, icon: 'Stethoscope' },
    { label: 'Patients', path: ROUTES.PATIENTS, icon: 'User' },
    { label: 'Appointments', path: ROUTES.APPOINTMENTS, icon: 'Calendar' },
    { label: 'Departments', path: ROUTES.DEPARTMENTS, icon: 'Building' },
    { label: 'Billing', path: ROUTES.BILLING, icon: 'Receipt' },
    { label: 'Reports', path: ROUTES.REPORTS.BASE, icon: 'BarChart' },
    { label: 'Settings', path: ROUTES.ADMIN.SETTINGS, icon: 'Settings' },
  ],
  DOCTOR: [
    { label: 'Dashboard', path: ROUTES.DOCTOR.DASHBOARD, icon: 'LayoutDashboard' },
    { label: 'Patients', path: ROUTES.DOCTOR.PATIENTS, icon: 'Users' },
    { label: 'Appointments', path: ROUTES.DOCTOR.APPOINTMENTS, icon: 'Calendar' },
    { label: 'Schedule', path: ROUTES.DOCTOR.SCHEDULE, icon: 'Clock' },
    { label: 'Prescriptions', path: ROUTES.DOCTOR.PRESCRIPTIONS, icon: 'FileText' },
    { label: 'Reports', path: ROUTES.DOCTOR.REPORTS, icon: 'BarChart' },
  ],
  NURSE: [
    { label: 'Dashboard', path: ROUTES.NURSE.DASHBOARD, icon: 'LayoutDashboard' },
    { label: 'Patients', path: ROUTES.NURSE.PATIENTS, icon: 'Users' },
    { label: 'Tasks', path: ROUTES.NURSE.TASKS, icon: 'CheckSquare' },
    { label: 'Schedule', path: ROUTES.NURSE.SCHEDULE, icon: 'Clock' },
    { label: 'Wards', path: ROUTES.NURSE.WARDS, icon: 'Building' },
  ],
  PATIENT: [
    { label: 'Dashboard', path: ROUTES.PATIENT.DASHBOARD, icon: 'LayoutDashboard' },
    { label: 'Book Appointment', path: ROUTES.PATIENT.BOOK_APPOINTMENT, icon: 'Calendar' },
    { label: 'My Appointments', path: ROUTES.PATIENT.APPOINTMENTS, icon: 'Clock' },
    { label: 'Medical Records', path: ROUTES.PATIENT.MEDICAL_RECORDS, icon: 'FileText' },
    { label: 'Prescriptions', path: ROUTES.PATIENT.PRESCRIPTIONS, icon: 'Pill' },
    { label: 'Bills', path: ROUTES.PATIENT.BILLS, icon: 'Receipt' },
  ],
  RECEPTIONIST: [
    { label: 'Dashboard', path: ROUTES.RECEPTIONIST.DASHBOARD, icon: 'LayoutDashboard' },
    { label: 'Appointments', path: ROUTES.RECEPTIONIST.APPOINTMENTS, icon: 'Calendar' },
    { label: 'Patient Registration', path: ROUTES.RECEPTIONIST.PATIENT_REGISTRATION, icon: 'UserPlus' },
    { label: 'Check-In', path: ROUTES.RECEPTIONIST.CHECK_IN, icon: 'CheckCircle' },
    { label: 'Patients', path: ROUTES.RECEPTIONIST.PATIENTS, icon: 'Users' },
  ],
  PHARMACIST: [
    { label: 'Dashboard', path: ROUTES.PHARMACIST.DASHBOARD, icon: 'LayoutDashboard' },
    { label: 'Prescriptions', path: ROUTES.PHARMACIST.PRESCRIPTIONS, icon: 'FileText' },
    { label: 'Dispense', path: ROUTES.PHARMACIST.DISPENSE, icon: 'Pill' },
    { label: 'Inventory', path: ROUTES.PHARMACIST.INVENTORY, icon: 'Package' },
  ],
};

export default {
  ROUTES,
  ROUTE_META,
  BREADCRUMBS,
  NAVIGATION_BY_ROLE,
};
