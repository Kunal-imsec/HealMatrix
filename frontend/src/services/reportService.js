import api from './api';

const reportService = {
  // Get available reports
  getAvailableReports: async () => {
    try {
      const response = await api.get('/reports');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Generate patient report
  generatePatientReport: async (params = {}) => {
    try {
      const response = await api.post('/reports/patients', params);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Generate appointment report
  generateAppointmentReport: async (params = {}) => {
    try {
      const response = await api.post('/reports/appointments', params);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Generate financial report
  generateFinancialReport: async (params = {}) => {
    try {
      const response = await api.post('/reports/financial', params);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Generate department report
  generateDepartmentReport: async (departmentId, params = {}) => {
    try {
      const response = await api.post(`/reports/departments/${departmentId}`, params);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Generate doctor performance report
  generateDoctorPerformanceReport: async (doctorId, params = {}) => {
    try {
      const response = await api.post(`/reports/doctors/${doctorId}/performance`, params);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Generate inventory report
  generateInventoryReport: async (params = {}) => {
    try {
      const response = await api.post('/reports/inventory', params);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Generate custom report
  generateCustomReport: async (reportData) => {
    try {
      const response = await api.post('/reports/custom', reportData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Export report
  exportReport: async (reportId, format = 'pdf') => {
    try {
      const response = await api.get(`/reports/${reportId}/export`, {
        params: { format },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `report_${reportId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get report by ID
  getReportById: async (reportId) => {
    try {
      const response = await api.get(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get saved reports
  getSavedReports: async (params = {}) => {
    try {
      const response = await api.get('/reports/saved', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Schedule report
  scheduleReport: async (scheduleData) => {
    try {
      const response = await api.post('/reports/schedule', scheduleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get scheduled reports
  getScheduledReports: async () => {
    try {
      const response = await api.get('/reports/scheduled');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete report
  deleteReport: async (reportId) => {
    try {
      const response = await api.delete(`/reports/${reportId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default reportService;
