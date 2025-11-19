import api from './api';

const medicationService = {
  // Get all medications
  getAllMedications: async (params = {}) => {
    try {
      const response = await api.get('/medications', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search medications
  searchMedications: async (query) => {
    try {
      const response = await api.get('/medications/search', {
        params: { q: query }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get medication by ID
  getMedicationById: async (id) => {
    try {
      const response = await api.get(`/medications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create medication
  createMedication: async (medicationData) => {
    try {
      const response = await api.post('/medications', medicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update medication
  updateMedication: async (id, medicationData) => {
    try {
      const response = await api.put(`/medications/${id}`, medicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete medication
  deleteMedication: async (id) => {
    try {
      const response = await api.delete(`/medications/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get medication stock
  getMedicationStock: async (id) => {
    try {
      const response = await api.get(`/medications/${id}/stock`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update medication stock
  updateMedicationStock: async (id, stockData) => {
    try {
      const response = await api.put(`/medications/${id}/stock`, stockData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get low stock medications
  getLowStockMedications: async (threshold = 10) => {
    try {
      const response = await api.get('/medications/low-stock', {
        params: { threshold }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get expired medications
  getExpiredMedications: async () => {
    try {
      const response = await api.get('/medications/expired');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get medication interactions
  getMedicationInteractions: async (medicationId) => {
    try {
      const response = await api.get(`/medications/${medicationId}/interactions`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get medication categories
  getMedicationCategories: async () => {
    try {
      const response = await api.get('/medications/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default medicationService;
