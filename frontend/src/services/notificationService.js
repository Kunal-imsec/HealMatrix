import api from './api';

const notificationService = {
  // Get all notifications
  getAllNotifications: async (params = {}) => {
    try {
      const response = await api.get('/notifications', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get unread notifications
  getUnreadNotifications: async () => {
    try {
      const response = await api.get('/notifications/unread');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get unread count
  getUnreadCount: async () => {
    try {
      const response = await api.get('/notifications/unread/count');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark as read
  markAsRead: async (notificationId) => {
    try {
      const response = await api.patch(`/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Mark all as read
  markAllAsRead: async () => {
    try {
      const response = await api.patch('/notifications/read-all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await api.delete(`/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete all notifications
  deleteAllNotifications: async () => {
    try {
      const response = await api.delete('/notifications/all');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send notification
  sendNotification: async (notificationData) => {
    try {
      const response = await api.post('/notifications/send', notificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Send bulk notification
  sendBulkNotification: async (bulkData) => {
    try {
      const response = await api.post('/notifications/send-bulk', bulkData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get notification settings
  getNotificationSettings: async () => {
    try {
      const response = await api.get('/notifications/settings');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update notification settings
  updateNotificationSettings: async (settings) => {
    try {
      const response = await api.put('/notifications/settings', settings);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Register device for push notifications
  registerDevice: async (deviceToken, deviceType) => {
    try {
      const response = await api.post('/notifications/devices', {
        token: deviceToken,
        type: deviceType
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Unregister device
  unregisterDevice: async (deviceToken) => {
    try {
      const response = await api.delete('/notifications/devices', {
        data: { token: deviceToken }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default notificationService;
