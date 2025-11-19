import { useAuth as useAuthContext } from '../context/AuthContext';

const useAuth = () => {
  const auth = useAuthContext();
  
  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!auth.user && !!auth.token;
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return auth.user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    if (!auth.user) return false;
    return roles.includes(auth.user.role);
  };

  // Check if user is admin
  const isAdmin = () => {
    return auth.user?.role === 'ADMIN';
  };

  // Check if user is doctor
  const isDoctor = () => {
    return auth.user?.role === 'DOCTOR';
  };

  // Check if user is nurse
  const isNurse = () => {
    return auth.user?.role === 'NURSE';
  };

  // Check if user is patient
  const isPatient = () => {
    return auth.user?.role === 'PATIENT';
  };

  // Check if user is receptionist
  const isReceptionist = () => {
    return auth.user?.role === 'RECEPTIONIST';
  };

  // Check if user is pharmacist
  const isPharmacist = () => {
    return auth.user?.role === 'PHARMACIST';
  };

  return {
    ...auth,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    isAdmin,
    isDoctor,
    isNurse,
    isPatient,
    isReceptionist,
    isPharmacist
  };
};

// Named export
export { useAuth };

// Default export
export default useAuth;
