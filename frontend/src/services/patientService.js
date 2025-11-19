import { apiHelpers } from './api';

class PatientService {
  constructor() {
    this.baseURL = '/patients';
  }

  // Get all patients with filtering
  async getAllPatients(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      const response = await apiHelpers.get(`${this.baseURL}?${queryParams}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get patient by ID
  async getPatientById(id) {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Create new patient
  async createPatient(patientData) {
    try {
      const response = await apiHelpers.post(this.baseURL, patientData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Update patient
  async updatePatient(id, patientData) {
    try {
      const response = await apiHelpers.put(`${this.baseURL}/${id}`, patientData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Delete patient
  async deletePatient(id) {
    try {
      const response = await apiHelpers.delete(`${this.baseURL}/${id}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Search patients
  async searchPatients(searchTerm) {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/search?q=${encodeURIComponent(searchTerm)}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get patient's medical history
  async getMedicalHistory(patientId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      const response = await apiHelpers.get(`${this.baseURL}/${patientId}/medical-history?${queryParams}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Add medical record
  async addMedicalRecord(patientId, recordData) {
    try {
      const response = await apiHelpers.post(`${this.baseURL}/${patientId}/medical-history`, recordData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get patient's appointments
  async getPatientAppointments(patientId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      const response = await apiHelpers.get(`${this.baseURL}/${patientId}/appointments?${queryParams}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get patient's prescriptions
  async getPatientPrescriptions(patientId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      const response = await apiHelpers.get(`${this.baseURL}/${patientId}/prescriptions?${queryParams}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get patient's bills
  async getPatientBills(patientId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      const response = await apiHelpers.get(`${this.baseURL}/${patientId}/bills?${queryParams}`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get departments
  async getDepartments() {
    try {
      const response = await apiHelpers.get('/departments');
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Export patients data
  async exportPatients(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      const response = await apiHelpers.download(`${this.baseURL}/export?${queryParams}`, 'patients.xlsx');
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Upload patient photo
  async uploadPatientPhoto(patientId, photoFile) {
    try {
      const formData = new FormData();
      formData.append('photo', photoFile);
      const response = await apiHelpers.upload(`${this.baseURL}/${patientId}/photo`, formData);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Get patient statistics
  async getPatientStatistics() {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/statistics`);
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // Merge patient records
  async mergePatients(sourcePatientId, targetPatientId) {
    try {
      const response = await apiHelpers.post(`${this.baseURL}/merge`, {
        sourcePatientId,
        targetPatientId
      });
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
}

export const patientService = new PatientService();
