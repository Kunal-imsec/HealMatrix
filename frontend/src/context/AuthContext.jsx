import React, { createContext, useContext, useReducer, useEffect, useState, useCallback, useMemo } from 'react';
import { authService } from '../services/authService';
import userService from '../services/userService';
import socketService from '../services/socketService';

// ------------------------------------------------------
// Context + Initial State
// ------------------------------------------------------
const AuthContext = createContext();

const initialState = {
  user: null,
  token: null,
  loading: true,
  error: null,
};

// ------------------------------------------------------
// Reducer
// ------------------------------------------------------
function authReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, loading: false, error: null };
    case 'SET_TOKEN':
      return { ...state, token: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'LOGOUT':
      return { ...initialState, loading: false };
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    default:
      return state;
  }
}

// ------------------------------------------------------
// Role-based Dashboard Paths
// ------------------------------------------------------
const getRoleDashboardPath = (role) => {
  const paths = {
    ADMIN: '/admin/dashboard',
    DOCTOR: '/doctor/dashboard',
    NURSE: '/nurse/dashboard',
    PATIENT: '/patient/dashboard',
    RECEPTIONIST: '/receptionist/dashboard',
  };
  return paths[role] || '/patient/dashboard';
};

// ------------------------------------------------------
// Auth Provider
// ------------------------------------------------------
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [preferences, setPreferences] = useState({});

  // ------------------------------------------------------
  // Session Check (on mount)
  // ------------------------------------------------------
  useEffect(() => {
    const checkExistingSession = async () => {
      console.log('🔵 AuthContext: Checking existing session...');
      try {
        const token = localStorage.getItem('authToken');
        const userStr = localStorage.getItem('user');
        const savedPreferences = localStorage.getItem('preferences');

        // Load preferences
        if (savedPreferences && savedPreferences !== 'undefined' && savedPreferences !== 'null') {
          try {
            const parsed = JSON.parse(savedPreferences);
            if (parsed && typeof parsed === 'object') {
              setPreferences(parsed);
              console.log('🟢 Preferences loaded');
            }
          } catch (e) {
            console.warn('⚠️ Invalid preferences format');
            localStorage.removeItem('preferences');
          }
        }

        if (token && userStr && userStr !== 'undefined' && userStr !== 'null') {
          const user = JSON.parse(userStr);
          if (user && typeof user === 'object' && user.email) {
            try {
              const verification = await authService.verifyToken();
              if (verification && verification.valid) {
                console.log('🟢 Token verified');
                dispatch({ type: 'SET_TOKEN', payload: token });
                dispatch({ type: 'SET_USER', payload: verification.user || user });
              } else {
                throw new Error('Invalid session');
              }
            } catch (err) {
              console.error('🔴 Token verification failed:', err.message);
              authService.clearAuthData();
              dispatch({ type: 'SET_LOADING', payload: false });
            }
          } else {
            authService.clearAuthData();
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          console.log('🟡 No existing session');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('🔴 Session check error:', error);
        authService.clearAuthData();
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkExistingSession();
  }, []);

  // ------------------------------------------------------
  // Login (Role-based redirect + validation)
  // ------------------------------------------------------
  const login = useCallback(async (credentials) => {
    try {
      console.log('🔵 Login started');
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });

      const response = await authService.login(credentials);
      if (response && response.token && response.user) {
        dispatch({ type: 'SET_TOKEN', payload: response.token });
        dispatch({ type: 'SET_USER', payload: response.user });

        return {
          ...response,
          redirectPath: getRoleDashboardPath(response.user.role),
        };
      } else {
        throw new Error('Invalid login response');
      }
    } catch (error) {
      console.error('🔴 Login error:', error);
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Login failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // ------------------------------------------------------
  // Register
  // ------------------------------------------------------
  const register = useCallback(async (userData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'CLEAR_ERROR' });
      const response = await authService.register(userData);
      return response;
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message || 'Registration failed' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // ------------------------------------------------------
  // Logout (Enhanced with socket disconnect)
  // ------------------------------------------------------
  const logout = useCallback(async (redirectToLogin = true) => {
    try {
      await authService.logout();
      socketService.disconnect();
      console.log('🟢 Logout successful & socket disconnected');
    } catch (error) {
      console.error('🔴 Logout error:', error);
    } finally {
      dispatch({ type: 'LOGOUT' });
      localStorage.clear();
      if (redirectToLogin && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
  }, []);

  // ------------------------------------------------------
  // Profile Update
  // ------------------------------------------------------
  const updateProfile = useCallback(async (profileData) => {
    try {
      const response = await userService.updateProfile(state.user.id, profileData);
      if (response) {
        const updatedUser = { ...state.user, ...response };
        dispatch({ type: 'SET_USER', payload: updatedUser });
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return response;
    } catch (error) {
      throw error;
    }
  }, [state.user]);

  // ------------------------------------------------------
  // Profile Photo Upload
  // ------------------------------------------------------
  const uploadProfilePhoto = useCallback(async (file) => {
    try {
      const response = await userService.uploadProfilePhoto(state.user.id, file);
      if (response && response.photoUrl) {
        setProfilePhoto(response.photoUrl);
        const updatedUser = { ...state.user, profilePhoto: response.photoUrl };
        dispatch({ type: 'SET_USER', payload: updatedUser });
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }
      return response;
    } catch (error) {
      throw error;
    }
  }, [state.user]);

  // ------------------------------------------------------
  // Password Change
  // ------------------------------------------------------
  const changePassword = useCallback(async (passwordData) => {
    try {
      return await authService.changePassword(passwordData);
    } catch (error) {
      console.error('🔴 Password change error:', error);
      throw error;
    }
  }, []);

  // ------------------------------------------------------
  // Update Preferences
  // ------------------------------------------------------
  const updatePreferences = useCallback(async (newPreferences) => {
    try {
      const response = await userService.updatePreferences(state.user.id, newPreferences);
      if (response && typeof response === 'object') {
        const updated = { ...preferences, ...response };
        setPreferences(updated);
        localStorage.setItem('preferences', JSON.stringify(updated));
      }
      return response;
    } catch (error) {
      console.error('🔴 Preferences update error:', error);
      throw error;
    }
  }, [state.user, preferences]);

  // ------------------------------------------------------
  // Helpers
  // ------------------------------------------------------
  const clearError = useCallback(() => dispatch({ type: 'CLEAR_ERROR' }), []);
  const hasRole = useCallback((role) => state.user?.role === role, [state.user]);
  const hasAnyRole = useCallback((roles) => roles.includes(state.user?.role), [state.user]);

  // ------------------------------------------------------
  // Memoized Context Value
  // ------------------------------------------------------
  const value = useMemo(() => ({
    ...state,
    profilePhoto,
    preferences,
    login,
    register,
    logout,
    updateProfile,
    uploadProfilePhoto,
    changePassword,
    updatePreferences,
    clearError,
    isAuthenticated: !!state.user,
    hasRole,
    hasAnyRole,
    getRoleDashboardPath: () => getRoleDashboardPath(state.user?.role),
    getSessionInfo: authService.getSessionInfo,
  }), [
    state,
    profilePhoto,
    preferences,
    login,
    register,
    logout,
    updateProfile,
    uploadProfilePhoto,
    changePassword,
    updatePreferences,
    clearError,
    hasRole,
    hasAnyRole,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ------------------------------------------------------
// Hook
// ------------------------------------------------------
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
