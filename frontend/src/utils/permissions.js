import { USER_ROLES } from './constants';

// Define permissions for each role
const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    // User management
    'users.view', 'users.create', 'users.edit', 'users.delete',
    
    // Patient management
    'patients.view', 'patients.create', 'patients.edit', 'patients.delete',
    
    // Doctor management
    'doctors.view', 'doctors.create', 'doctors.edit', 'doctors.delete',
    
    // Appointments
    'appointments.view', 'appointments.create', 'appointments.edit', 
    'appointments.delete', 'appointments.approve', 'appointments.cancel',
    
    // Billing
    'billing.view', 'billing.create', 'billing.edit', 'billing.delete',
    'billing.refund', 'billing.reports',
    
    // Prescriptions
    'prescriptions.view', 'prescriptions.create', 'prescriptions.edit',
    'prescriptions.delete',
    
    // Inventory
    'inventory.view', 'inventory.create', 'inventory.edit', 'inventory.delete',
    
    // Reports
    'reports.view', 'reports.create', 'reports.export', 'reports.schedule',
    
    // Settings
    'settings.view', 'settings.edit', 'system.manage',
    
    // Departments
    'departments.view', 'departments.create', 'departments.edit', 'departments.delete',
    
    // Full admin access
    'admin.full_access'
  ],
  
  [USER_ROLES.DOCTOR]: [
    'patients.view', 'patients.create', 'patients.edit',
    'appointments.view', 'appointments.create', 'appointments.edit', 'appointments.cancel',
    'prescriptions.view', 'prescriptions.create', 'prescriptions.edit',
    'billing.view',
    'reports.view', 'reports.create',
    'departments.view',
    'settings.view'
  ],
  
  [USER_ROLES.NURSE]: [
    'patients.view', 'patients.edit',
    'appointments.view', 'appointments.edit',
    'prescriptions.view',
    'billing.view',
    'departments.view',
    'settings.view'
  ],
  
  [USER_ROLES.RECEPTIONIST]: [
    'patients.view', 'patients.create', 'patients.edit',
    'appointments.view', 'appointments.create', 'appointments.edit', 'appointments.cancel',
    'billing.view', 'billing.create',
    'departments.view',
    'settings.view'
  ],
  
  [USER_ROLES.PHARMACIST]: [
    'patients.view',
    'prescriptions.view', 'prescriptions.edit',
    'inventory.view', 'inventory.create', 'inventory.edit',
    'billing.view',
    'settings.view'
  ],
  
  [USER_ROLES.PATIENT]: [
    'appointments.view', 'appointments.create',
    'prescriptions.view',
    'billing.view',
    'settings.view'
  ]
};

// Get permissions for a role
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

// Check if role has permission
export const hasPermission = (userRole, permission) => {
  const permissions = getRolePermissions(userRole);
  return permissions.includes(permission) || permissions.includes('admin.full_access');
};

// Check if role has any of the permissions
export const hasAnyPermission = (userRole, permissions) => {
  return permissions.some(permission => hasPermission(userRole, permission));
};

// Check if role has all permissions
export const hasAllPermissions = (userRole, permissions) => {
  return permissions.every(permission => hasPermission(userRole, permission));
};

// Check resource access
export const canAccessResource = (userRole, resource, action = 'view') => {
  const permission = `${resource}.${action}`;
  return hasPermission(userRole, permission);
};

// Get accessible routes for role
export const getAccessibleRoutes = (userRole) => {
  const routes = {
    dashboard: hasPermission(userRole, 'admin.full_access') || true, // All can access dashboard
    patients: hasAnyPermission(userRole, ['patients.view', 'patients.create']),
    doctors: hasAnyPermission(userRole, ['doctors.view', 'doctors.create']),
    appointments: hasAnyPermission(userRole, ['appointments.view', 'appointments.create']),
    billing: hasAnyPermission(userRole, ['billing.view', 'billing.create']),
    prescriptions: hasAnyPermission(userRole, ['prescriptions.view', 'prescriptions.create']),
    inventory: hasAnyPermission(userRole, ['inventory.view', 'inventory.create']),
    reports: hasAnyPermission(userRole, ['reports.view', 'reports.create']),
    departments: hasPermission(userRole, 'departments.view'),
    settings: hasPermission(userRole, 'settings.view'),
    admin: hasPermission(userRole, 'admin.full_access')
  };
  
  return Object.keys(routes).filter(route => routes[route]);
};

// Check if user can perform action on own resource
export const canAccessOwnResource = (userRole, userId, resourceOwnerId) => {
  // Admin can access all
  if (hasPermission(userRole, 'admin.full_access')) return true;
  
  // Patients can only access their own resources
  if (userRole === USER_ROLES.PATIENT) {
    return userId === resourceOwnerId;
  }
  
  // Medical staff can access their assigned resources
  return true;
};

// Get permission groups
export const getPermissionGroups = () => {
  return {
    'User Management': ['users.view', 'users.create', 'users.edit', 'users.delete'],
    'Patient Management': ['patients.view', 'patients.create', 'patients.edit', 'patients.delete'],
    'Appointments': ['appointments.view', 'appointments.create', 'appointments.edit', 'appointments.delete'],
    'Billing': ['billing.view', 'billing.create', 'billing.edit', 'billing.delete'],
    'Prescriptions': ['prescriptions.view', 'prescriptions.create', 'prescriptions.edit', 'prescriptions.delete'],
    'Inventory': ['inventory.view', 'inventory.create', 'inventory.edit', 'inventory.delete'],
    'Reports': ['reports.view', 'reports.create', 'reports.export'],
    'System': ['settings.view', 'settings.edit', 'system.manage']
  };
};

// Format permission name for display
export const formatPermissionName = (permission) => {
  const [resource, action] = permission.split('.');
  return `${action.charAt(0).toUpperCase() + action.slice(1)} ${resource.charAt(0).toUpperCase() + resource.slice(1)}`;
};

export default {
  ROLE_PERMISSIONS,
  getRolePermissions,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessResource,
  getAccessibleRoutes,
  canAccessOwnResource,
  getPermissionGroups,
  formatPermissionName
};
