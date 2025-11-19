 /**
 * Application Configuration - Updated for HMS Business Logic
 */

// Application Information
export const APP_INFO = {
  NAME: 'Hospital Management System',
  SHORT_NAME: 'HMS',
  VERSION: '1.0.0',
  DESCRIPTION: 'Comprehensive Hospital Management Solution',
  AUTHOR: 'HMS Development Team',
  COPYRIGHT: '© 2025 Hospital Management System. All rights reserved.',
};

// Environment
export const ENVIRONMENT = {
  MODE: import.meta.env.MODE || 'development',
  IS_DEV: import.meta.env.DEV || false,
  IS_PROD: import.meta.env.PROD || false,
};

// ==================== FEATURE FLAGS ====================
export const FEATURES = {
  // Authentication Features
  AUTHENTICATION: {
    ENABLED: true,
    
    // Patient Registration - ENABLED (Anyone can register as patient)
    PATIENT_REGISTRATION: {
      ENABLED: true,
      SELF_REGISTRATION: true,
      AUTO_ROLE: 'PATIENT',
      REQUIRES_APPROVAL: false,
    },
    
    // Staff Registration - DISABLED (Only admin can create staff)
    STAFF_REGISTRATION: {
      ENABLED: false, // Staff CANNOT self-register
      CREATED_BY: 'ADMIN',
      ROLES: ['DOCTOR', 'NURSE', 'RECEPTIONIST', 'PHARMACIST'],
      CREDENTIALS_MODE: 'OFFLINE', // Admin provides credentials offline
    },
    
    // Login - Available for all roles
    LOGIN: {
      ENABLED: true,
      ALL_ROLES: true,
      REMEMBER_ME: true,
      PASSWORD_RESET: true,
    },
    
    // Future Features
    TWO_FACTOR_AUTH: false,
    SOCIAL_LOGIN: false,
    EMAIL_VERIFICATION: false,
  },

  // Other features remain the same...
  APPOINTMENTS: {
    ENABLED: true,
    ONLINE_BOOKING: true,
    VIDEO_CONSULTATION: false,
    APPOINTMENT_REMINDERS: true,
    RECURRING_APPOINTMENTS: false,
  },
  
  BILLING: {
    ENABLED: true,
    ONLINE_PAYMENT: false,
    INSURANCE_INTEGRATION: false,
    PAYMENT_PLANS: false,
  },
  
  INVENTORY: {
    ENABLED: true,
    AUTO_REORDER: false,
    BARCODE_SCANNING: false,
  },
  
  REPORTS: {
    ENABLED: true,
    EXPORT_PDF: true,
    EXPORT_EXCEL: true,
    CUSTOM_REPORTS: true,
  },
  
  NOTIFICATIONS: {
    ENABLED: true,
    PUSH_NOTIFICATIONS: false,
    EMAIL_NOTIFICATIONS: true,
    SMS_NOTIFICATIONS: false,
  },
  
  REAL_TIME: {
    ENABLED: true,
    SOCKET_CONNECTION: true,
    LIVE_UPDATES: true,
  },
};

// ==================== USER ROLES ====================
export const USER_ROLES = {
  // Admin - Full system access (created during system setup)
  ADMIN: {
    CODE: 'ADMIN',
    NAME: 'Administrator',
    CAN_SELF_REGISTER: false, // Created during system initialization
    CREATED_BY: 'SYSTEM',
    DESCRIPTION: 'Full system access',
  },
  
  // Hospital Staff - Created by ADMIN only
  DOCTOR: {
    CODE: 'DOCTOR',
    NAME: 'Doctor',
    CAN_SELF_REGISTER: false, // Admin creates doctors
    CREATED_BY: 'ADMIN',
    CREDENTIALS_PROVIDED: 'OFFLINE',
    DESCRIPTION: 'Medical professional',
  },
  
  NURSE: {
    CODE: 'NURSE',
    NAME: 'Nurse',
    CAN_SELF_REGISTER: false, // Admin creates nurses
    CREATED_BY: 'ADMIN',
    CREDENTIALS_PROVIDED: 'OFFLINE',
    DESCRIPTION: 'Nursing staff',
  },
  
  RECEPTIONIST: {
    CODE: 'RECEPTIONIST',
    NAME: 'Receptionist',
    CAN_SELF_REGISTER: false, // Admin creates receptionists
    CREATED_BY: 'ADMIN',
    CREDENTIALS_PROVIDED: 'OFFLINE',
    DESCRIPTION: 'Front desk staff',
  },
  
  PHARMACIST: {
    CODE: 'PHARMACIST',
    NAME: 'Pharmacist',
    CAN_SELF_REGISTER: false, // Admin creates pharmacists
    CREATED_BY: 'ADMIN',
    CREDENTIALS_PROVIDED: 'OFFLINE',
    DESCRIPTION: 'Pharmacy staff',
  },
  
  // Patient - Can self-register
  PATIENT: {
    CODE: 'PATIENT',
    NAME: 'Patient',
    CAN_SELF_REGISTER: true, // Patients can register themselves
    CREATED_BY: 'SELF',
    CREDENTIALS_PROVIDED: 'SELF',
    DESCRIPTION: 'Hospital patient',
  },
};

// Registration Configuration
export const REGISTRATION_CONFIG = {
  // Public registration creates PATIENT role ONLY
  PUBLIC_REGISTRATION: {
    ENABLED: true,
    DEFAULT_ROLE: 'PATIENT',
    ALLOWED_ROLES: ['PATIENT'], // Only patients can self-register
  },
  
  // Admin creates all staff accounts
  ADMIN_REGISTRATION: {
    ENABLED: true,
    ALLOWED_ROLES: ['DOCTOR', 'NURSE', 'RECEPTIONIST', 'PHARMACIST'],
    REQUIRES_ADMIN: true,
    PASSWORD_GENERATION: 'ADMIN_PROVIDED', // Admin sets initial password
  },
};

// Rest of the config remains the same...
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
  MAX_PAGE_SIZE: 100,
};

export const DATE_TIME = {
  DATE_FORMAT: 'MMM DD, YYYY',
  TIME_FORMAT: 'hh:mm A',
  DATETIME_FORMAT: 'MMM DD, YYYY hh:mm A',
  DATE_PICKER_FORMAT: 'yyyy-MM-dd',
  API_DATE_FORMAT: 'YYYY-MM-DD',
  API_DATETIME_FORMAT: 'YYYY-MM-DDTHH:mm:ss',
  TIMEZONE: 'Asia/Kolkata',
};

export const FILE_UPLOAD = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    DOCUMENTS: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    ALL: ['image/*', 'application/pdf', '.doc', '.docx', '.txt'],
  },
  MAX_FILES: 5,
};

export const SESSION = {
  TIMEOUT: 8 * 60 * 60 * 1000, // 8 hours
  WARNING_TIME: 5 * 60 * 1000, // 5 minutes
  AUTO_REFRESH: true,
  REFRESH_INTERVAL: 10 * 60 * 1000, // 10 minutes
};

export const VALIDATION = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[6-9]\d{9}$/,
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
    REQUIRE_UPPERCASE: true,
    REQUIRE_LOWERCASE: true,
    REQUIRE_NUMBER: true,
    REQUIRE_SPECIAL_CHAR: true,
    PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  },
  USERNAME: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 30,
    PATTERN: /^[a-zA-Z0-9_]+$/,
  },
};

export const UI = {
  TOAST_DURATION: 3000,
  MODAL_ANIMATION_DURATION: 300,
  DEBOUNCE_DELAY: 300,
  LOADING_DELAY: 200,
  ANIMATION_DURATION: 300,
};

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  LOGIN_TIME: 'loginTime',
  THEME: 'hospital_theme',
  PRIMARY_COLOR: 'hospital_primary_color',
  COLOR_SCHEME: 'hospital_color_scheme',
  FONT_SIZE: 'hospital_font_size',
  HIGH_CONTRAST: 'hospital_high_contrast',
  REDUCED_MOTION: 'hospital_reduced_motion',
  PREFERENCES: 'preferences',
  LANGUAGE: 'language',
  SIDEBAR_STATE: 'sidebarState',
  TABLE_PREFERENCES: 'tablePreferences',
};

export const SOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  ERROR: 'error',
  NOTIFICATION: 'notification',
  APPOINTMENT_UPDATE: 'appointment:update',
  PATIENT_UPDATE: 'patient:update',
  USER_ONLINE: 'user:online',
  USER_OFFLINE: 'user:offline',
};

export const DEFAULTS = {
  AVATAR: '/assets/images/default-avatar.png',
  HOSPITAL_LOGO: '/assets/images/logo.png',
  NO_IMAGE: '/assets/images/no-image.png',
};

export const EXTERNAL_LINKS = {
  SUPPORT_EMAIL: 'support@hospital.com',
  HELP_CENTER: 'https://help.hospital.com',
  PRIVACY_POLICY: '/privacy-policy',
  TERMS_OF_SERVICE: '/terms-of-service',
  DOCUMENTATION: 'https://docs.hospital.com',
};

export const ERROR_TRACKING = {
  ENABLED: ENVIRONMENT.IS_PROD,
  SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN || '',
};

export default {
  APP_INFO,
  ENVIRONMENT,
  FEATURES,
  USER_ROLES,
  REGISTRATION_CONFIG,
  PAGINATION,
  DATE_TIME,
  FILE_UPLOAD,
  SESSION,
  VALIDATION,
  UI,
  STORAGE_KEYS,
  SOCKET_EVENTS,
  DEFAULTS,
  EXTERNAL_LINKS,
  ERROR_TRACKING,
};
