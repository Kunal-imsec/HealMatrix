import { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const usePermissions = () => {
  const { user } = useAuth();

  // Check if user has specific permission
  const hasPermission = useMemo(() => {
    return (permission) => {
      if (!user || !user.permissions) return false;
      return user.permissions.includes(permission);
    };
  }, [user]);

  // Check if user has any of the permissions
  const hasAnyPermission = useMemo(() => {
    return (permissions) => {
      if (!user || !user.permissions) return false;
      return permissions.some(permission => user.permissions.includes(permission));
    };
  }, [user]);

  // Check if user has all permissions
  const hasAllPermissions = useMemo(() => {
    return (permissions) => {
      if (!user || !user.permissions) return false;
      return permissions.every(permission => user.permissions.includes(permission));
    };
  }, [user]);

  // Check if user has specific role
  const hasRole = useMemo(() => {
    return (role) => {
      if (!user) return false;
      return user.role === role;
    };
  }, [user]);

  // Check if user has any of the roles
  const hasAnyRole = useMemo(() => {
    return (roles) => {
      if (!user) return false;
      return roles.includes(user.role);
    };
  }, [user]);

  // Check if user is admin
  const isAdmin = useMemo(() => {
    return user?.role === 'ADMIN';
  }, [user]);

  // Check if user is doctor
  const isDoctor = useMemo(() => {
    return user?.role === 'DOCTOR';
  }, [user]);

  // Check if user is nurse
  const isNurse = useMemo(() => {
    return user?.role === 'NURSE';
  }, [user]);

  // Check if user is patient
  const isPatient = useMemo(() => {
    return user?.role === 'PATIENT';
  }, [user]);

  // Check if user is receptionist
  const isReceptionist = useMemo(() => {
    return user?.role === 'RECEPTIONIST';
  }, [user]);

  // Check if user is pharmacist
  const isPharmacist = useMemo(() => {
    return user?.role === 'PHARMACIST';
  }, [user]);

  // Check if user can access resource
  const canAccess = useMemo(() => {
    return (resource, action = 'view') => {
      const permissionString = `${resource}.${action}`;
      return hasPermission(permissionString);
    };
  }, [hasPermission]);

  // Check if user can view
  const canView = useMemo(() => {
    return (resource) => canAccess(resource, 'view');
  }, [canAccess]);

  // Check if user can create
  const canCreate = useMemo(() => {
    return (resource) => canAccess(resource, 'create');
  }, [canAccess]);

  // Check if user can edit
  const canEdit = useMemo(() => {
    return (resource) => canAccess(resource, 'edit');
  }, [canAccess]);

  // Check if user can delete
  const canDelete = useMemo(() => {
    return (resource) => canAccess(resource, 'delete');
  }, [canAccess]);

  // Get all user permissions
  const permissions = useMemo(() => {
    return user?.permissions || [];
  }, [user]);

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
    isAdmin,
    isDoctor,
    isNurse,
    isPatient,
    isReceptionist,
    isPharmacist,
    canAccess,
    canView,
    canCreate,
    canEdit,
    canDelete,
    permissions,
    userRole: user?.role
  };
};

export default usePermissions;
