import api from './api';

const userService = {
  // Get user profile
  getUserProfile: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user profile
  updateProfile: async (userId, profileData) => {
    try {
      const response = await api.put(`/users/${userId}/profile`, profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload profile photo
  uploadProfilePhoto: async (userId, file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);
      
      const response = await api.post(`/users/${userId}/profile-photo`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update user preferences
  updatePreferences: async (userId, preferences) => {
    try {
      const response = await api.put(`/users/${userId}/preferences`, preferences);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user preferences
  getUserPreferences: async (userId) => {
    try {
      const response = await api.get(`/users/${userId}/preferences`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Change password
  changePassword: async (userId, passwordData) => {
    try {
      const response = await api.post(`/users/${userId}/change-password`, passwordData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get user notifications
  getUserNotifications: async (userId, params = {}) => {
    try {
      const response = await api.get(`/users/${userId}/notifications`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update notification settings
  updateNotificationSettings: async (userId, settings) => {
    try {
      const response = await api.put(`/users/${userId}/notification-settings`, settings);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default userService;
