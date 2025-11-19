import api from './api';

const prescriptionService = {
  // Get all prescriptions
  getAllPrescriptions: async (params = {}) => {
    try {
      const response = await api.get('/prescriptions', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get prescription by ID
  getPrescriptionById: async (id) => {
    try {
      const response = await api.get(`/prescriptions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create prescription
  createPrescription: async (prescriptionData) => {
    try {
      const response = await api.post('/prescriptions', prescriptionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update prescription
  updatePrescription: async (id, prescriptionData) => {
    try {
      const response = await api.put(`/prescriptions/${id}`, prescriptionData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete prescription
  deletePrescription: async (id) => {
    try {
      const response = await api.delete(`/prescriptions/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get patient prescriptions
  getPatientPrescriptions: async (patientId, params = {}) => {
    try {
      const response = await api.get(`/prescriptions/patient/${patientId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get doctor prescriptions
  getDoctorPrescriptions: async (doctorId, params = {}) => {
    try {
      const response = await api.get(`/prescriptions/doctor/${doctorId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Check drug interactions
  checkDrugInteractions: async (medicationIds) => {
    try {
      const response = await api.post('/prescriptions/check-interactions', { medicationIds });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Dispense prescription
  dispensePrescription: async (prescriptionId, dispenseData) => {
    try {
      const response = await api.post(`/prescriptions/${prescriptionId}/dispense`, dispenseData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update prescription status
  updatePrescriptionStatus: async (id, status, data = {}) => {
    try {
      const response = await api.patch(`/prescriptions/${id}/status`, { status, ...data });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get prescription statistics
  getPrescriptionStatistics: async (params = {}) => {
    try {
      const response = await api.get('/prescriptions/statistics', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Export prescriptions
  exportPrescriptions: async (params = {}) => {
    try {
      const response = await api.get('/prescriptions/export', {
        params,
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescriptions_${Date.now()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Print prescription
  printPrescription: async (id) => {
    try {
      const response = await api.get(`/prescriptions/${id}/print`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default prescriptionService;
