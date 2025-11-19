import api from './api';

const settingsService = {
  // Get all settings
  getAllSettings: async () => {
    try {
      const response = await api.get('/settings');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get system settings
  getSystemSettings: async () => {
    try {
      const response = await api.get('/settings/system');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update system settings
  updateSystemSettings: async (settings) => {
    try {
      const response = await api.put('/settings/system', settings);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get notification settings
  getNotificationSettings: async (userId) => {
    try {
      const response = await api.get(`/settings/notifications/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update notification settings
  updateNotificationSettings: async (userId, settings) => {
    try {
      const response = await api.put(`/settings/notifications/${userId}`, settings);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get backup settings
  getBackupSettings: async () => {
    try {
      const response = await api.get('/settings/backup');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update backup settings
  updateBackupSettings: async (settings) => {
    try {
      const response = await api.put('/settings/backup', settings);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get backup list
  getBackupList: async () => {
    try {
      const response = await api.get('/settings/backup/list');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create backup
  createBackup: async () => {
    try {
      const response = await api.post('/settings/backup/create');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Restore backup
  restoreBackup: async (backupId) => {
    try {
      const response = await api.post(`/settings/backup/restore/${backupId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get audit logs
  getAuditLogs: async (params = {}) => {
    try {
      const response = await api.get('/settings/audit-logs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Export audit logs
  exportAuditLogs: async (params = {}) => {
    try {
      const response = await api.get('/settings/audit-logs/export', {
        params,
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `audit_logs_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get security settings
  getSecuritySettings: async (userId) => {
    try {
      const response = await api.get(`/settings/security/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get active sessions
  getActiveSessions: async (userId) => {
    try {
      const response = await api.get(`/settings/sessions/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Terminate session
  terminateSession: async (sessionId) => {
    try {
      const response = await api.delete(`/settings/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Terminate all sessions
  terminateAllSessions: async (userId) => {
    try {
      const response = await api.delete(`/settings/sessions/all/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get login history
  getLoginHistory: async (userId) => {
    try {
      const response = await api.get(`/settings/login-history/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Enable two-factor authentication
  enableTwoFactor: async (userId) => {
    try {
      const response = await api.post(`/settings/2fa/enable/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Verify two-factor authentication
  verifyTwoFactor: async (userId, code) => {
    try {
      const response = await api.post(`/settings/2fa/verify/${userId}`, { code });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Disable two-factor authentication
  disableTwoFactor: async (userId) => {
    try {
      const response = await api.post(`/settings/2fa/disable/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default settingsService;
