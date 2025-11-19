/**
 * Permissions Configuration
 * Role-based access control and permissions mapping
 */

// User Roles
export const ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  NURSE: 'NURSE',
  PATIENT: 'PATIENT',
  RECEPTIONIST: 'RECEPTIONIST',
  PHARMACIST: 'PHARMACIST',
};

// Role Hierarchy (higher number = more permissions)
export const ROLE_HIERARCHY = {
  [ROLES.ADMIN]: 100,
  [ROLES.DOCTOR]: 80,
  [ROLES.NURSE]: 60,
  [ROLES.RECEPTIONIST]: 50,
  [ROLES.PHARMACIST]: 50,
  [ROLES.PATIENT]: 20,
};

// Permission Actions
export const ACTIONS = {
  CREATE: 'create',
  READ: 'read',
  UPDATE: 'update',
  DELETE: 'delete',
  MANAGE: 'manage', // Full CRUD access
  VIEW: 'view', // Read-only
  EXPORT: 'export',
  IMPORT: 'import',
};

// Resource Types
export const RESOURCES = {
  USERS: 'users',
  PATIENTS: 'patients',
  DOCTORS: 'doctors',
  NURSES: 'nurses',
  APPOINTMENTS: 'appointments',
  PRESCRIPTIONS: 'prescriptions',
  BILLING: 'billing',
  DEPARTMENTS: 'departments',
  INVENTORY: 'inventory',
  REPORTS: 'reports',
  SETTINGS: 'settings',
  NOTIFICATIONS: 'notifications',
  MEDICAL_RECORDS: 'medical_records',
  STAFF: 'staff',
  AUDIT_LOGS: 'audit_logs',
};

// Role-Based Permissions Matrix
export const PERMISSIONS = {
  // ADMIN - Full access to everything
  [ROLES.ADMIN]: {
    [RESOURCES.USERS]: [ACTIONS.MANAGE],
    [RESOURCES.PATIENTS]: [ACTIONS.MANAGE],
    [RESOURCES.DOCTORS]: [ACTIONS.MANAGE],
    [RESOURCES.NURSES]: [ACTIONS.MANAGE],
    [RESOURCES.APPOINTMENTS]: [ACTIONS.MANAGE],
    [RESOURCES.PRESCRIPTIONS]: [ACTIONS.MANAGE],
    [RESOURCES.BILLING]: [ACTIONS.MANAGE],
    [RESOURCES.DEPARTMENTS]: [ACTIONS.MANAGE],
    [RESOURCES.INVENTORY]: [ACTIONS.MANAGE],
    [RESOURCES.REPORTS]: [ACTIONS.MANAGE, ACTIONS.EXPORT],
    [RESOURCES.SETTINGS]: [ACTIONS.MANAGE],
    [RESOURCES.STAFF]: [ACTIONS.MANAGE],
    [RESOURCES.AUDIT_LOGS]: [ACTIONS.READ],
    [RESOURCES.NOTIFICATIONS]: [ACTIONS.MANAGE],
    [RESOURCES.MEDICAL_RECORDS]: [ACTIONS.MANAGE],
  },

  // DOCTOR - Access to patients, appointments, prescriptions
  [ROLES.DOCTOR]: {
    [RESOURCES.PATIENTS]: [ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.APPOINTMENTS]: [ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.PRESCRIPTIONS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.MEDICAL_RECORDS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.REPORTS]: [ACTIONS.READ, ACTIONS.EXPORT],
    [RESOURCES.DEPARTMENTS]: [ACTIONS.READ],
    [RESOURCES.NOTIFICATIONS]: [ACTIONS.READ],
    [RESOURCES.SETTINGS]: [ACTIONS.READ, ACTIONS.UPDATE], // Own settings only
  },

  // NURSE - Patient care, tasks, ward management
  [ROLES.NURSE]: {
    [RESOURCES.PATIENTS]: [ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.APPOINTMENTS]: [ACTIONS.READ],
    [RESOURCES.PRESCRIPTIONS]: [ACTIONS.READ],
    [RESOURCES.MEDICAL_RECORDS]: [ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.DEPARTMENTS]: [ACTIONS.READ],
    [RESOURCES.NOTIFICATIONS]: [ACTIONS.READ],
    [RESOURCES.SETTINGS]: [ACTIONS.READ, ACTIONS.UPDATE], // Own settings only
  },

  // PATIENT - Own data only
  [ROLES.PATIENT]: {
    [RESOURCES.APPOINTMENTS]: [ACTIONS.CREATE, ACTIONS.READ],
    [RESOURCES.PRESCRIPTIONS]: [ACTIONS.READ],
    [RESOURCES.BILLING]: [ACTIONS.READ],
    [RESOURCES.MEDICAL_RECORDS]: [ACTIONS.READ],
    [RESOURCES.DOCTORS]: [ACTIONS.READ],
    [RESOURCES.DEPARTMENTS]: [ACTIONS.READ],
    [RESOURCES.NOTIFICATIONS]: [ACTIONS.READ],
    [RESOURCES.SETTINGS]: [ACTIONS.READ, ACTIONS.UPDATE], // Own settings only
  },

  // RECEPTIONIST - Appointments, patient registration, check-in
  [ROLES.RECEPTIONIST]: {
    [RESOURCES.PATIENTS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.APPOINTMENTS]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.DOCTORS]: [ACTIONS.READ],
    [RESOURCES.DEPARTMENTS]: [ACTIONS.READ],
    [RESOURCES.BILLING]: [ACTIONS.READ],
    [RESOURCES.NOTIFICATIONS]: [ACTIONS.READ],
    [RESOURCES.SETTINGS]: [ACTIONS.READ, ACTIONS.UPDATE], // Own settings only
  },

  // PHARMACIST - Prescriptions, inventory, dispensing
  [ROLES.PHARMACIST]: {
    [RESOURCES.PRESCRIPTIONS]: [ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.INVENTORY]: [ACTIONS.CREATE, ACTIONS.READ, ACTIONS.UPDATE],
    [RESOURCES.PATIENTS]: [ACTIONS.READ],
    [RESOURCES.REPORTS]: [ACTIONS.READ],
    [RESOURCES.NOTIFICATIONS]: [ACTIONS.READ],
    [RESOURCES.SETTINGS]: [ACTIONS.READ, ACTIONS.UPDATE], // Own settings only
  },
};

// Feature Access by Role
export const FEATURE_ACCESS = {
  [ROLES.ADMIN]: {
    dashboard: true,
    userManagement: true,
    staffManagement: true,
    patientManagement: true,
    doctorManagement: true,
    nurseManagement: true,
    appointmentManagement: true,
    prescriptionManagement: true,
    billingManagement: true,
    departmentManagement: true,
    inventoryManagement: true,
    reports: true,
    systemSettings: true,
    auditLogs: true,
    notifications: true,
  },

  [ROLES.DOCTOR]: {
    dashboard: true,
    patientManagement: true,
    appointmentManagement: true,
    prescriptionManagement: true,
    medicalRecords: true,
    schedule: true,
    reports: true,
    notifications: true,
    profile: true,
  },

  [ROLES.NURSE]: {
    dashboard: true,
    patientCare: true,
    taskManagement: true,
    wardManagement: true,
    schedule: true,
    handoverNotes: true,
    medicalRecords: true,
    notifications: true,
    profile: true,
  },

  [ROLES.PATIENT]: {
    dashboard: true,
    bookAppointment: true,
    viewAppointments: true,
    medicalRecords: true,
    prescriptions: true,
    billing: true,
    findDoctors: true,
    notifications: true,
    profile: true,
  },

  [ROLES.RECEPTIONIST]: {
    dashboard: true,
    patientRegistration: true,
    appointmentManagement: true,
    checkIn: true,
    patientSearch: true,
    notifications: true,
    profile: true,
  },

  [ROLES.PHARMACIST]: {
    dashboard: true,
    prescriptionQueue: true,
    dispenseMedication: true,
    inventoryManagement: true,
    stockManagement: true,
    reports: true,
    notifications: true,
    profile: true,
  },
};

// Route Access by Role
export const ROUTE_ACCESS = {
  '/admin': [ROLES.ADMIN],
  '/admin/*': [ROLES.ADMIN],
  '/doctor': [ROLES.DOCTOR, ROLES.ADMIN],
  '/doctor/*': [ROLES.DOCTOR, ROLES.ADMIN],
  '/nurse': [ROLES.NURSE, ROLES.ADMIN],
  '/nurse/*': [ROLES.NURSE, ROLES.ADMIN],
  '/patient': [ROLES.PATIENT, ROLES.ADMIN],
  '/patient/*': [ROLES.PATIENT, ROLES.ADMIN],
  '/receptionist': [ROLES.RECEPTIONIST, ROLES.ADMIN],
  '/receptionist/*': [ROLES.RECEPTIONIST, ROLES.ADMIN],
  '/pharmacist': [ROLES.PHARMACIST, ROLES.ADMIN],
  '/pharmacist/*': [ROLES.PHARMACIST, ROLES.ADMIN],
  '/patients': [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.RECEPTIONIST],
  '/doctors': [ROLES.ADMIN, ROLES.PATIENT, ROLES.RECEPTIONIST],
  '/appointments': [ROLES.ADMIN, ROLES.DOCTOR, ROLES.NURSE, ROLES.PATIENT, ROLES.RECEPTIONIST],
  '/billing': [ROLES.ADMIN, ROLES.PATIENT, ROLES.RECEPTIONIST],
  '/prescriptions': [ROLES.ADMIN, ROLES.DOCTOR, ROLES.PATIENT, ROLES.PHARMACIST],
  '/inventory': [ROLES.ADMIN, ROLES.PHARMACIST],
  '/reports': [ROLES.ADMIN, ROLES.DOCTOR],
  '/settings': [ROLES.ADMIN],
};

// Permission Helper Functions
export const permissionHelpers = {
  /**
   * Check if role has permission for action on resource
   */
  hasPermission: (role, resource, action) => {
    const rolePermissions = PERMISSIONS[role];
    if (!rolePermissions) return false;
    
    const resourcePermissions = rolePermissions[resource];
    if (!resourcePermissions) return false;
    
    return resourcePermissions.includes(action) || resourcePermissions.includes(ACTIONS.MANAGE);
  },

  /**
   * Check if role can access a route
   */
  canAccessRoute: (role, route) => {
    // Check exact match first
    if (ROUTE_ACCESS[route]) {
      return ROUTE_ACCESS[route].includes(role);
    }
    
    // Check wildcard patterns
    const wildcardRoute = Object.keys(ROUTE_ACCESS).find(key => {
      if (key.endsWith('/*')) {
        const baseRoute = key.slice(0, -2);
        return route.startsWith(baseRoute);
      }
      return false;
    });
    
    if (wildcardRoute) {
      return ROUTE_ACCESS[wildcardRoute].includes(role);
    }
    
    return false;
  },

  /**
   * Check if role has access to a feature
   */
  hasFeatureAccess: (role, feature) => {
    const roleFeatures = FEATURE_ACCESS[role];
    return roleFeatures ? roleFeatures[feature] === true : false;
  },

  /**
   * Get all permissions for a role
   */
  getRolePermissions: (role) => {
    return PERMISSIONS[role] || {};
  },

  /**
   * Check if role is higher in hierarchy
   */
  isHigherRole: (role1, role2) => {
    return ROLE_HIERARCHY[role1] > ROLE_HIERARCHY[role2];
  },

  /**
   * Get accessible routes for role
   */
  getAccessibleRoutes: (role) => {
    return Object.keys(ROUTE_ACCESS).filter(route => 
      ROUTE_ACCESS[route].includes(role)
    );
  },
};

export default {
  ROLES,
  ROLE_HIERARCHY,
  ACTIONS,
  RESOURCES,
  PERMISSIONS,
  FEATURE_ACCESS,
  ROUTE_ACCESS,
  permissionHelpers,
};
