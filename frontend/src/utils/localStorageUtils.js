import { STORAGE_KEYS } from './constants';

// Get item from localStorage
export const getItem = (key) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error getting item from localStorage (${key}):`, error);
    return null;
  }
};

// Set item in localStorage
export const setItem = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting item in localStorage (${key}):`, error);
    return false;
  }
};

// Remove item from localStorage
export const removeItem = (key) => {
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item from localStorage (${key}):`, error);
    return false;
  }
};

// Clear all localStorage
export const clearAll = () => {
  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
};

// Check if key exists
export const hasItem = (key) => {
  return window.localStorage.getItem(key) !== null;
};

// Get multiple items
export const getMultiple = (keys) => {
  return keys.reduce((acc, key) => {
    acc[key] = getItem(key);
    return acc;
  }, {});
};

// Set multiple items
export const setMultiple = (items) => {
  Object.entries(items).forEach(([key, value]) => {
    setItem(key, value);
  });
};

// Get all keys
export const getAllKeys = () => {
  return Object.keys(window.localStorage);
};

// Get storage size (approximate)
export const getStorageSize = () => {
  let size = 0;
  for (const key in window.localStorage) {
    if (window.localStorage.hasOwnProperty(key)) {
      size += window.localStorage[key].length + key.length;
    }
  }
  return size;
};

// Check storage quota
export const checkStorageQuota = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    try {
      const estimate = await navigator.storage.estimate();
      return {
        usage: estimate.usage,
        quota: estimate.quota,
        percentUsed: (estimate.usage / estimate.quota) * 100
      };
    } catch (error) {
      console.error('Error checking storage quota:', error);
      return null;
    }
  }
  return null;
};

// Auth token management
export const getAuthToken = () => {
  return getItem(STORAGE_KEYS.AUTH_TOKEN);
};

export const setAuthToken = (token) => {
  return setItem(STORAGE_KEYS.AUTH_TOKEN, token);
};

export const removeAuthToken = () => {
  return removeItem(STORAGE_KEYS.AUTH_TOKEN);
};

// User data management
export const getUserData = () => {
  return getItem(STORAGE_KEYS.USER_DATA);
};

export const setUserData = (userData) => {
  return setItem(STORAGE_KEYS.USER_DATA, userData);
};

export const removeUserData = () => {
  return removeItem(STORAGE_KEYS.USER_DATA);
};

// Theme management
export const getTheme = () => {
  return getItem(STORAGE_KEYS.THEME) || 'light';
};

export const setTheme = (theme) => {
  return setItem(STORAGE_KEYS.THEME, theme);
};

// Preferences management
export const getPreferences = () => {
  return getItem(STORAGE_KEYS.PREFERENCES) || {};
};

export const setPreferences = (preferences) => {
  return setItem(STORAGE_KEYS.PREFERENCES, preferences);
};

export const updatePreference = (key, value) => {
  const preferences = getPreferences();
  preferences[key] = value;
  return setPreferences(preferences);
};

// Recent searches management
export const getRecentSearches = () => {
  return getItem(STORAGE_KEYS.RECENT_SEARCHES) || [];
};

export const addRecentSearch = (searchTerm, maxItems = 10) => {
  const searches = getRecentSearches();
  const filtered = searches.filter(s => s !== searchTerm);
  filtered.unshift(searchTerm);
  const limited = filtered.slice(0, maxItems);
  return setItem(STORAGE_KEYS.RECENT_SEARCHES, limited);
};

export const clearRecentSearches = () => {
  return removeItem(STORAGE_KEYS.RECENT_SEARCHES);
};

// Cached data management with expiry
export const setCachedData = (key, data, expiryMinutes = 60) => {
  const expiryTime = new Date().getTime() + (expiryMinutes * 60 * 1000);
  return setItem(key, {
    data,
    expiry: expiryTime
  });
};

export const getCachedData = (key) => {
  const cached = getItem(key);
  
  if (!cached) return null;
  
  if (cached.expiry && new Date().getTime() > cached.expiry) {
    removeItem(key);
    return null;
  }
  
  return cached.data;
};

// Session management
export const clearSession = () => {
  removeAuthToken();
  removeUserData();
  // Keep theme and preferences
};

// Export/Import localStorage
export const exportLocalStorage = () => {
  const data = {};
  for (const key in window.localStorage) {
    if (window.localStorage.hasOwnProperty(key)) {
      data[key] = window.localStorage[key];
    }
  }
  return JSON.stringify(data);
};

export const importLocalStorage = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    Object.entries(data).forEach(([key, value]) => {
      window.localStorage.setItem(key, value);
    });
    return true;
  } catch (error) {
    console.error('Error importing localStorage:', error);
    return false;
  }
};

export default {
  getItem,
  setItem,
  removeItem,
  clearAll,
  hasItem,
  getMultiple,
  setMultiple,
  getAllKeys,
  getStorageSize,
  checkStorageQuota,
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getUserData,
  setUserData,
  removeUserData,
  getTheme,
  setTheme,
  getPreferences,
  setPreferences,
  updatePreference,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  setCachedData,
  getCachedData,
  clearSession,
  exportLocalStorage,
  importLocalStorage
};
