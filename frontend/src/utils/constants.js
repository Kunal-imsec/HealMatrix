// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  SOCKET_URL: process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3
};

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  PATIENT: 'PATIENT',
  RECEPTIONIST: 'RECEPTIONIST',
  PHARMACIST: 'PHARMACIST'
};

// Appointment Status
export const APPOINTMENT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  CONFIRMED: 'CONFIRMED',
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  NO_SHOW: 'NO_SHOW',
  RESCHEDULED: 'RESCHEDULED'
};

// Appointment Types
export const APPOINTMENT_TYPES = {
  CONSULTATION: 'CONSULTATION',
  FOLLOW_UP: 'FOLLOW_UP',
  EMERGENCY: 'EMERGENCY',
  CHECKUP: 'CHECKUP',
  SURGERY: 'SURGERY',
  THERAPY: 'THERAPY'
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  PARTIAL: 'PARTIAL',
  OVERDUE: 'OVERDUE',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED'
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'CASH',
  CREDIT_CARD: 'CREDIT_CARD',
  DEBIT_CARD: 'DEBIT_CARD',
  INSURANCE: 'INSURANCE',
  MOBILE_PAYMENT: 'MOBILE_PAYMENT',
  BANK_TRANSFER: 'BANK_TRANSFER'
};

// Prescription Status
export const PRESCRIPTION_STATUS = {
  ACTIVE: 'ACTIVE',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED'
};

// Medication Frequency
export const MEDICATION_FREQUENCY = {
  ONCE_DAILY: 'ONCE_DAILY',
  TWICE_DAILY: 'TWICE_DAILY',
  THREE_TIMES_DAILY: 'THREE_TIMES_DAILY',
  FOUR_TIMES_DAILY: 'FOUR_TIMES_DAILY',
  AS_NEEDED: 'AS_NEEDED'
};

// Blood Types
export const BLOOD_TYPES = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
];

// Gender Options
export const GENDER_OPTIONS = {
  MALE: 'MALE',
  FEMALE: 'FEMALE',
  OTHER: 'OTHER'
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  LOADING: 'loading'
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  TIME: 'hh:mm A',
  DATETIME: 'MMM DD, YYYY hh:mm A',
  FULL: 'dddd, MMMM DD, YYYY',
  SHORT: 'MM/DD/YYYY'
};

// Time Slots
export const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00'
];

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10485760, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 
                  'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx']
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
};

// Priority Levels
export const PRIORITY_LEVELS = {
  LOW: 'LOW',
  NORMAL: 'NORMAL',
  HIGH: 'HIGH',
  URGENT: 'URGENT',
  CRITICAL: 'CRITICAL'
};

// Document Types
export const DOCUMENT_TYPES = {
  ID_PROOF: 'ID_PROOF',
  INSURANCE_CARD: 'INSURANCE_CARD',
  MEDICAL_REPORT: 'MEDICAL_REPORT',
  PRESCRIPTION: 'PRESCRIPTION',
  LAB_REPORT: 'LAB_REPORT',
  XRAY: 'XRAY',
  MRI: 'MRI',
  CT_SCAN: 'CT_SCAN'
};

// Department Types
export const DEPARTMENT_TYPES = {
  CARDIOLOGY: 'CARDIOLOGY',
  NEUROLOGY: 'NEUROLOGY',
  ORTHOPEDICS: 'ORTHOPEDICS',
  PEDIATRICS: 'PEDIATRICS',
  GYNECOLOGY: 'GYNECOLOGY',
  EMERGENCY: 'EMERGENCY',
  GENERAL: 'GENERAL',
  ICU: 'ICU'
};

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  ZIP_CODE: /^\d{5}(-\d{4})?$/,
  SSN: /^\d{3}-\d{2}-\d{4}$/
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  NETWORK_ERROR: 'Network error. Please check your connection',
  SERVER_ERROR: 'Server error. Please try again later',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  SESSION_EXPIRED: 'Your session has expired. Please login again'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  CREATED: 'Created successfully',
  UPDATED: 'Updated successfully',
  DELETED: 'Deleted successfully',
  SAVED: 'Saved successfully',
  SENT: 'Sent successfully'
};

// Chart Colors
export const CHART_COLORS = {
  PRIMARY: '#3B82F6',
  SUCCESS: '#10B981',
  WARNING: '#F59E0B',
  DANGER: '#EF4444',
  INFO: '#6366F1',
  SECONDARY: '#8B5CF6',
  GRADIENT: ['#3B82F6', '#8B5CF6', '#EC4899']
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  LANGUAGE: 'language',
  PREFERENCES: 'preferences',
  RECENT_SEARCHES: 'recent_searches'
};

export default {
  API_CONFIG,
  USER_ROLES,
  APPOINTMENT_STATUS,
  APPOINTMENT_TYPES,
  PAYMENT_STATUS,
  PAYMENT_METHODS,
  PRESCRIPTION_STATUS,
  MEDICATION_FREQUENCY,
  BLOOD_TYPES,
  GENDER_OPTIONS,
  NOTIFICATION_TYPES,
  DATE_FORMATS,
  TIME_SLOTS,
  FILE_UPLOAD,
  PAGINATION,
  PRIORITY_LEVELS,
  DOCUMENT_TYPES,
  DEPARTMENT_TYPES,
  REGEX_PATTERNS,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  CHART_COLORS,
  STORAGE_KEYS
};
