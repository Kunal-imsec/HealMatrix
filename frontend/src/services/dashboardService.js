import { apiHelpers } from './api';

class DashboardService {
  constructor() {
    this.baseURL = '/dashboard';
  }

  // Get general dashboard statistics
  async getDashboardStats() {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/stats`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get role-specific dashboard data
  async getRoleDashboard(role) {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/${role.toLowerCase()}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get recent activities
  async getRecentActivities(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`${this.baseURL}/activities?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get system notifications
  async getNotifications(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`${this.baseURL}/notifications?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Mark notification as read
  async markNotificationRead(notificationId) {
    try {
      const response = await apiHelpers.patch(`${this.baseURL}/notifications/${notificationId}/read`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllNotificationsRead() {
    try {
      const response = await apiHelpers.patch(`${this.baseURL}/notifications/read-all`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get analytics data
  async getAnalyticsData(type, period = '7d') {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/analytics/${type}?period=${period}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get quick stats for cards
  async getQuickStats() {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/quick-stats`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get upcoming appointments
  async getUpcomingAppointments(limit = 10) {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/upcoming-appointments?limit=${limit}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get pending tasks
  async getPendingTasks(limit = 10) {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/pending-tasks?limit=${limit}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get system health status
  async getSystemHealth() {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/system-health`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Doctor-specific dashboard data
  async getDoctorDashboard(doctorId) {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/doctor/${doctorId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // ✅ FIXED: Patient-specific dashboard data (no parameter needed)
  async getPatientDashboard() {
    try {
      console.log('📊 Fetching patient dashboard...');
      const response = await apiHelpers.get('/patient/dashboard');  // ✅ CORRECT PATH
      console.log('✅ Dashboard data received:', response);
      return response;
    } catch (error) {
      console.error('❌ Dashboard error:', error);
      throw error;
    }
  }

  // Admin dashboard data
  async getAdminDashboard() {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/admin`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get revenue analytics
  async getRevenueAnalytics(period = '30d') {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/revenue-analytics?period=${period}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get patient flow analytics
  async getPatientFlowAnalytics(period = '7d') {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/patient-flow?period=${period}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get department performance
  async getDepartmentPerformance(period = '30d') {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/department-performance?period=${period}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
export default dashboardService;
