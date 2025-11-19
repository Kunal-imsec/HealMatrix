import api from './api';

const adminService = {
  // User Management
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createUser: async (userData) => {
    try {
      const response = await api.post('/admin/users', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await api.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getUserStatistics: async () => {
    try {
      const response = await api.get('/admin/users/statistics');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateUserStatus: async (userId, status) => {
    try {
      const response = await api.patch(`/admin/users/${userId}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  lockUserAccount: async (userId) => {
    try {
      const response = await api.post(`/admin/users/${userId}/lock`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  unlockUserAccount: async (userId) => {
    try {
      const response = await api.post(`/admin/users/${userId}/unlock`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  sendPasswordReset: async (userId) => {
    try {
      const response = await api.post(`/admin/users/${userId}/password-reset`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  bulkUserAction: async (action, userIds) => {
    try {
      const response = await api.post('/admin/users/bulk-action', { action, userIds });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  exportUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users/export', {
        params,
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `users_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Role Management
  getAllRoles: async () => {
    try {
      const response = await api.get('/admin/roles');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createRole: async (roleData) => {
    try {
      const response = await api.post('/admin/roles', roleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateRole: async (roleId, roleData) => {
    try {
      const response = await api.put(`/admin/roles/${roleId}`, roleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteRole: async (roleId) => {
    try {
      const response = await api.delete(`/admin/roles/${roleId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  duplicateRole: async (roleId) => {
    try {
      const response = await api.post(`/admin/roles/${roleId}/duplicate`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getAllPermissions: async () => {
    try {
      const response = await api.get('/admin/permissions');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // System Monitoring
  getSystemMetrics: async () => {
    try {
      const response = await api.get('/admin/system/metrics');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getServiceStatus: async () => {
    try {
      const response = await api.get('/admin/system/services');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getSystemLogs: async (params = {}) => {
    try {
      const response = await api.get('/admin/system/logs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  exportMetrics: async () => {
    try {
      const response = await api.get('/admin/system/metrics/export', {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `metrics_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Database Management
  getDatabaseStats: async () => {
    try {
      const response = await api.get('/admin/database/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getDatabaseTables: async () => {
    try {
      const response = await api.get('/admin/database/tables');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  optimizeTable: async (tableName) => {
    try {
      const response = await api.post('/admin/database/optimize', { table: tableName });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  optimizeAllTables: async () => {
    try {
      const response = await api.post('/admin/database/optimize-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  vacuumDatabase: async () => {
    try {
      const response = await api.post('/admin/database/vacuum');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getDatabaseBackups: async () => {
    try {
      const response = await api.get('/admin/database/backups');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  createDatabaseBackup: async () => {
    try {
      const response = await api.post('/admin/database/backup');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  restoreDatabaseBackup: async (backupId) => {
    try {
      const response = await api.post(`/admin/database/restore/${backupId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  deleteDatabaseBackup: async (backupId) => {
    try {
      const response = await api.delete(`/admin/database/backups/${backupId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getSlowQueries: async () => {
    try {
      const response = await api.get('/admin/database/slow-queries');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  testDatabaseConnection: async (config) => {
    try {
      const response = await api.post('/admin/database/test-connection', config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Security Audit
  getSecurityAudit: async (params = {}) => {
    try {
      const response = await api.get('/admin/security/audit', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getSecurityThreats: async (params = {}) => {
    try {
      const response = await api.get('/admin/security/threats', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getSuspiciousActivity: async (params = {}) => {
    try {
      const response = await api.get('/admin/security/suspicious-activity', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  getFailedLogins: async (params = {}) => {
    try {
      const response = await api.get('/admin/security/failed-logins', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  blockIPAddress: async (ip) => {
    try {
      const response = await api.post('/admin/security/block-ip', { ip });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  unblockIPAddress: async (ip) => {
    try {
      const response = await api.post('/admin/security/unblock-ip', { ip });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  exportSecurityAudit: async (params = {}) => {
    try {
      const response = await api.get('/admin/security/audit/export', {
        params,
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `security_audit_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // System Configuration
  getSystemConfiguration: async () => {
    try {
      const response = await api.get('/admin/config');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  updateSystemConfiguration: async (config) => {
    try {
      const response = await api.put('/admin/config', config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  restartApplication: async () => {
    try {
      const response = await api.post('/admin/system/restart');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  testEmailConfiguration: async (config) => {
    try {
      const response = await api.post('/admin/config/test-email', config);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Maintenance Mode
  getMaintenanceStatus: async () => {
    try {
      const response = await api.get('/admin/maintenance/status');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  enableMaintenanceMode: async (data) => {
    try {
      const response = await api.post('/admin/maintenance/enable', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  disableMaintenanceMode: async () => {
    try {
      const response = await api.post('/admin/maintenance/disable');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  scheduleMaintenanceMode: async (data) => {
    try {
      const response = await api.post('/admin/maintenance/schedule', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default adminService;
