import React, { createContext, useContext, useState, useEffect } from 'react';
import settingsService from '../services/settingsService';
import { useAuth } from './AuthContext';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const { user } = useAuth();
  
  // System Settings
  const [systemSettings, setSystemSettings] = useState({
    hospitalName: '',
    hospitalAddress: '',
    hospitalPhone: '',
    hospitalEmail: '',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    currency: 'USD',
    language: 'en'
  });

  // User Settings
  const [userSettings, setUserSettings] = useState({
    theme: 'light',
    notifications: {
      email: true,
      sms: false,
      push: true,
      inApp: true
    },
    language: 'en',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12'
  });

  // Loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch settings on mount
  useEffect(() => {
    if (user) {
      fetchSettings();
    }
  }, [user]);

  // Fetch all settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);

      const [systemData, userData] = await Promise.all([
        settingsService.getSystemSettings(),
        user ? settingsService.getNotificationSettings(user.id) : Promise.resolve({})
      ]);

      setSystemSettings(prev => ({ ...prev, ...systemData }));
      if (userData) {
        setUserSettings(prev => ({ ...prev, ...userData }));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
      setError(err.message || 'Failed to fetch settings');
    } finally {
      setLoading(false);
    }
  };

  // Update system settings
  const updateSystemSettings = async (newSettings) => {
    try {
      setError(null);
      const updatedSettings = await settingsService.updateSystemSettings(newSettings);
      setSystemSettings(prev => ({ ...prev, ...updatedSettings }));
      return updatedSettings;
    } catch (err) {
      console.error('Error updating system settings:', err);
      setError(err.message || 'Failed to update system settings');
      throw err;
    }
  };

  // Update user settings
  const updateUserSettings = async (newSettings) => {
    try {
      setError(null);
      if (!user) throw new Error('User not authenticated');

      const updatedSettings = await settingsService.updateNotificationSettings(
        user.id,
        newSettings
      );
      setUserSettings(prev => ({ ...prev, ...updatedSettings }));
      return updatedSettings;
    } catch (err) {
      console.error('Error updating user settings:', err);
      setError(err.message || 'Failed to update user settings');
      throw err;
    }
  };

  // Update notification preferences
  const updateNotificationPreferences = async (preferences) => {
    try {
      setError(null);
      const updated = await updateUserSettings({
        ...userSettings,
        notifications: { ...userSettings.notifications, ...preferences }
      });
      return updated;
    } catch (err) {
      console.error('Error updating notification preferences:', err);
      throw err;
    }
  };

  // Get setting value by key
  const getSetting = (key, defaultValue = null) => {
    const keys = key.split('.');
    let value = systemSettings;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }

    return value !== undefined ? value : defaultValue;
  };

  // Get user setting value by key
  const getUserSetting = (key, defaultValue = null) => {
    const keys = key.split('.');
    let value = userSettings;

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return defaultValue;
      }
    }

    return value !== undefined ? value : defaultValue;
  };

  // Format date according to settings
  const formatDate = (date, includeTime = false) => {
    if (!date) return '';

    const dateObj = date instanceof Date ? date : new Date(date);
    const dateFormat = getSetting('dateFormat', 'MM/DD/YYYY');
    const timeFormat = getSetting('timeFormat', '12');

    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    };

    if (includeTime) {
      options.hour = '2-digit';
      options.minute = '2-digit';
      options.hour12 = timeFormat === '12';
    }

    return dateObj.toLocaleString(getSetting('language', 'en'), options);
  };

  // Format currency according to settings
  const formatCurrency = (amount) => {
    const currency = getSetting('currency', 'USD');
    const locale = getSetting('language', 'en');

    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  // Refresh settings
  const refreshSettings = async () => {
    await fetchSettings();
  };

  const value = {
    systemSettings,
    userSettings,
    loading,
    error,
    updateSystemSettings,
    updateUserSettings,
    updateNotificationPreferences,
    getSetting,
    getUserSetting,
    formatDate,
    formatCurrency,
    refreshSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
