/**
 * API Configuration - Updated for HMS Business Logic
 * Supports both /api/auth and /api/v1/auth endpoints
 */

// Base API URLs - Support both versioned and non-versioned
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
export const API_BASE_URL_V1 = import.meta.env.VITE_API_BASE_URL_V1 || 'http://localhost:8080/api/v1';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// API Version Preference (set to 'v1' or 'none')
export const API_VERSION_PREFERENCE = 'none'; // Use /api/auth instead of /api/v1/auth

// Get the active base URL based on preference
export const ACTIVE_API_BASE = API_VERSION_PREFERENCE === 'v1' ? API_BASE_URL_V1 : API_BASE_URL;

// API Timeout Settings
export const API_TIMEOUT = 30000; // 30 seconds
export const UPLOAD_TIMEOUT = 120000; // 2 minutes

// API Endpoints Configuration
export const API_ENDPOINTS = {
  // ==================== AUTHENTICATION ====================
  // Note: Registration is ONLY for patients
  // Staff (Doctor, Nurse, Receptionist, Pharmacist) are created by ADMIN
  AUTH: {
    BASE: '/auth',
    LOGIN: '/auth/login',                    // All roles can login
    REGISTER: '/auth/register',              // PATIENT registration ONLY
    LOGOUT: '/auth/logout',
    REFRESH_TOKEN: '/auth/refresh-token',
    VERIFY_TOKEN: '/auth/verify',
    PROFILE: '/auth/profile',
    CHANGE_PASSWORD: '/auth/change-password',
    FORGOT_PASSWORD: '/auth/forgot-password', // All users
    RESET_PASSWORD: '/auth/reset-password',   // All users
    VERIFY_EMAIL: '/auth/verify-email',
    RESEND_VERIFICATION: '/auth/resend-verification',
  },

  // ==================== ADMIN ====================
  // Admin manages all staff
  ADMIN: {
    BASE: '/admin',
    DASHBOARD: '/admin/dashboard',
    
    // User Management
    USERS: '/admin/users',
    USER_BY_ID: (id) => `/admin/users/${id}`,
    
    // Staff Management (Admin creates these accounts)
    STAFF: '/admin/staff',
    CREATE_DOCTOR: '/admin/staff/doctor',      // Admin creates doctor
    CREATE_NURSE: '/admin/staff/nurse',        // Admin creates nurse
    CREATE_RECEPTIONIST: '/admin/staff/receptionist', // Admin creates receptionist
    CREATE_PHARMACIST: '/admin/staff/pharmacist',    // Admin creates pharmacist
    STAFF_BY_ID: (id) => `/admin/staff/${id}`,
    STAFF_BY_ROLE: (role) => `/admin/staff/${role}`,
    RESET_STAFF_PASSWORD: (id) => `/admin/staff/${id}/reset-password`,
    DELETE_STAFF: (id) => `/admin/staff/${id}`,
    
    // Doctors Management
    DOCTORS: '/admin/doctors',
    DOCTOR_BY_ID: (id) => `/admin/doctors/${id}`,
    
    // System Settings
    SYSTEM_SETTINGS: '/admin/settings',
    AUDIT_LOGS: '/admin/audit-logs',
  },

  // ==================== DOCTORS ====================
  DOCTORS: {
    BASE: '/doctors',
    BY_ID: (id) => `/doctors/${id}`,
    SCHEDULE: (id) => `/doctors/${id}/schedule`,
    AVAILABILITY: (id) => `/doctors/${id}/availability`,
    APPOINTMENTS: (id) => `/doctors/${id}/appointments`,
    PATIENTS: (id) => `/doctors/${id}/patients`,
    REVIEWS: (id) => `/doctors/${id}/reviews`,
    SPECIALIZATIONS: '/doctors/specializations',
  },

  // ==================== PATIENTS ====================
  // Note: Patients can self-register via /auth/register
  PATIENTS: {
    BASE: '/patients',
    BY_ID: (id) => `/patients/${id}`,
    REGISTER: '/auth/register',                // Public patient registration
    MEDICAL_HISTORY: (id) => `/patients/${id}/medical-history`,
    VITALS: (id) => `/patients/${id}/vitals`,
    APPOINTMENTS: (id) => `/patients/${id}/appointments`,
    PRESCRIPTIONS: (id) => `/patients/${id}/prescriptions`,
    BILLS: (id) => `/patients/${id}/bills`,
    DOCUMENTS: (id) => `/patients/${id}/documents`,
    EMERGENCY_CONTACT: (id) => `/patients/${id}/emergency-contact`,
  },

  // ==================== NURSES ====================
  NURSES: {
    BASE: '/nurses',
    BY_ID: (id) => `/nurses/${id}`,
    SCHEDULE: (id) => `/nurses/${id}/schedule`,
    ASSIGNED_PATIENTS: (id) => `/nurses/${id}/patients`,
    TASKS: (id) => `/nurses/${id}/tasks`,
    HANDOVER: (id) => `/nurses/${id}/handover`,
    WARDS: '/nurses/wards',
  },

  // ==================== APPOINTMENTS ====================
  APPOINTMENTS: {
    BASE: '/appointments',
    BY_ID: (id) => `/appointments/${id}`,
    BOOK: '/appointments/book',
    RESCHEDULE: (id) => `/appointments/${id}/reschedule`,
    CANCEL: (id) => `/appointments/${id}/cancel`,
    CHECK_IN: (id) => `/appointments/${id}/check-in`,
    CHECK_OUT: (id) => `/appointments/${id}/check-out`,
    AVAILABLE_SLOTS: '/appointments/available-slots',
    CALENDAR: '/appointments/calendar',
  },

  // ==================== PRESCRIPTIONS ====================
  PRESCRIPTIONS: {
    BASE: '/prescriptions',
    BY_ID: (id) => `/prescriptions/${id}`,
    CREATE: '/prescriptions',
    BY_PATIENT: (patientId) => `/prescriptions/patient/${patientId}`,
    MEDICATIONS: '/prescriptions/medications',
    DRUG_INTERACTIONS: '/prescriptions/drug-interactions',
    DISPENSE: (id) => `/prescriptions/${id}/dispense`,
  },

  // ==================== BILLING ====================
  BILLING: {
    BASE: '/billing',
    BY_ID: (id) => `/billing/${id}`,
    CREATE: '/billing',
    PAY: (id) => `/billing/${id}/pay`,
    INVOICE: (id) => `/billing/${id}/invoice`,
    RECEIPT: (id) => `/billing/${id}/receipt`,
    PAYMENT_HISTORY: (id) => `/billing/${id}/payments`,
    INSURANCE: '/billing/insurance',
  },

  // ==================== DEPARTMENTS ====================
  DEPARTMENTS: {
    BASE: '/departments',
    BY_ID: (id) => `/departments/${id}`,
    STAFF: (id) => `/departments/${id}/staff`,
    STATISTICS: (id) => `/departments/${id}/statistics`,
  },

  // ==================== INVENTORY ====================
  INVENTORY: {
    BASE: '/inventory',
    BY_ID: (id) => `/inventory/${id}`,
    LOW_STOCK: '/inventory/low-stock',
    SUPPLIERS: '/inventory/suppliers',
    ORDERS: '/inventory/orders',
    UPDATE_STOCK: (id) => `/inventory/${id}/stock`,
  },

  // ==================== REPORTS ====================
  REPORTS: {
    BASE: '/reports',
    PATIENT: '/reports/patient',
    DOCTOR: '/reports/doctor',
    FINANCIAL: '/reports/financial',
    INVENTORY: '/reports/inventory',
    CUSTOM: '/reports/custom',
    EXPORT: '/reports/export',
  },

  // ==================== SETTINGS ====================
  SETTINGS: {
    BASE: '/settings',
    USER: '/settings/user',
    SYSTEM: '/settings/system',
    NOTIFICATIONS: '/settings/notifications',
    SECURITY: '/settings/security',
    BACKUP: '/settings/backup',
    RESTORE: '/settings/restore',
  },

  // ==================== NOTIFICATIONS ====================
  NOTIFICATIONS: {
    BASE: '/notifications',
    BY_ID: (id) => `/notifications/${id}`,
    MARK_READ: (id) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    DELETE: (id) => `/notifications/${id}`,
    PREFERENCES: '/notifications/preferences',
  },

  // ==================== FILES ====================
  FILES: {
    UPLOAD: '/files/upload',
    DOWNLOAD: (id) => `/files/${id}/download`,
    DELETE: (id) => `/files/${id}`,
  },
};

// Registration Rules
export const REGISTRATION_RULES = {
  // Only patients can self-register
  PATIENT_REGISTRATION: {
    ENABLED: true,
    ENDPOINT: API_ENDPOINTS.AUTH.REGISTER,
    DEFAULT_ROLE: 'PATIENT',
    REQUIRES_EMAIL_VERIFICATION: false, // Set to true when email service is ready
  },
  
  // Staff cannot self-register - only admin can create
  STAFF_REGISTRATION: {
    ENABLED: false,
    CREATED_BY: 'ADMIN',
    ROLES: ['DOCTOR', 'NURSE', 'RECEPTIONIST', 'PHARMACIST'],
    ADMIN_ENDPOINT: API_ENDPOINTS.ADMIN.STAFF,
    CREDENTIALS_PROVIDED: 'OFFLINE', // Staff receive credentials from admin
  },
};

// Login Rules
export const LOGIN_RULES = {
  ALL_ROLES_CAN_LOGIN: true,
  SUPPORTED_ROLES: ['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT', 'RECEPTIONIST', 'PHARMACIST'],
  ENDPOINT: API_ENDPOINTS.AUTH.LOGIN,
  REMEMBER_ME: true,
  PASSWORD_RESET: true,
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

// Content Types
export const CONTENT_TYPES = {
  JSON: 'application/json',
  FORM_DATA: 'multipart/form-data',
  URL_ENCODED: 'application/x-www-form-urlencoded',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Messages
export const API_ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'Session expired. Please login again.',
  FORBIDDEN: 'Access denied. You don\'t have permission.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Validation failed. Please check your input.',
  UNKNOWN_ERROR: 'An unexpected error occurred. Please try again.',
  STAFF_REGISTRATION_DISABLED: 'Staff registration is not allowed. Please contact your administrator.',
};

// Request Headers
export const DEFAULT_HEADERS = {
  'Content-Type': CONTENT_TYPES.JSON,
  'Accept': CONTENT_TYPES.JSON,
};

// Cache Configuration
export const CACHE_CONFIG = {
  ENABLED: true,
  TTL: 5 * 60 * 1000, // 5 minutes
  MAX_SIZE: 100,
};

// Retry Configuration
export const RETRY_CONFIG = {
  ENABLED: true,
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000,
  RETRY_ON_STATUS: [408, 429, 500, 502, 503, 504],
};

export default {
  API_BASE_URL,
  API_BASE_URL_V1,
  ACTIVE_API_BASE,
  SOCKET_URL,
  API_TIMEOUT,
  UPLOAD_TIMEOUT,
  API_VERSION_PREFERENCE,
  API_ENDPOINTS,
  REGISTRATION_RULES,
  LOGIN_RULES,
  HTTP_METHODS,
  CONTENT_TYPES,
  HTTP_STATUS,
  API_ERROR_MESSAGES,
  DEFAULT_HEADERS,
  CACHE_CONFIG,
  RETRY_CONFIG,
};
