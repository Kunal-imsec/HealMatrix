import { apiHelpers } from './api';

class NurseService {
  constructor() {
    this.baseURL = '/nurses';
  }

  // Get all nurses
  async getAllNurses(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`${this.baseURL}?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get nurse by ID
  async getNurseById(id) {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create new nurse
  async createNurse(nurseData) {
    try {
      const response = await apiHelpers.post(this.baseURL, nurseData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update nurse
  async updateNurse(id, nurseData) {
    try {
      const response = await apiHelpers.put(`${this.baseURL}/${id}`, nurseData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete nurse
  async deleteNurse(id) {
    try {
      const response = await apiHelpers.delete(`${this.baseURL}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get nurse's assigned patients
  async getAssignedPatients(nurseId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`${this.baseURL}/${nurseId}/patients?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Assign patient to nurse
  async assignPatient(nurseId, patientId, assignmentData) {
    try {
      const response = await apiHelpers.post(`${this.baseURL}/${nurseId}/patients/${patientId}`, assignmentData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Unassign patient from nurse
  async unassignPatient(nurseId, patientId) {
    try {
      const response = await apiHelpers.delete(`${this.baseURL}/${nurseId}/patients/${patientId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get nurse's tasks
  async getNurseTasks(nurseId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`${this.baseURL}/${nurseId}/tasks?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create new task
  async createTask(nurseId, taskData) {
    try {
      const response = await apiHelpers.post(`${this.baseURL}/${nurseId}/tasks`, taskData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update task status
  async updateTaskStatus(taskId, status, notes = '') {
    try {
      const response = await apiHelpers.patch(`/tasks/${taskId}`, { status, notes });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Complete task
  async completeTask(taskId, completionData) {
    try {
      const response = await apiHelpers.patch(`/tasks/${taskId}/complete`, completionData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get patient vital signs
  async getPatientVitals(patientId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`/patients/${patientId}/vitals?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Record patient vital signs
  async recordVitalSigns(patientId, vitalData) {
    try {
      const response = await apiHelpers.post(`/patients/${patientId}/vitals`, vitalData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update vital signs
  async updateVitalSigns(vitalId, vitalData) {
    try {
      const response = await apiHelpers.put(`/vitals/${vitalId}`, vitalData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get patient care plans
  async getPatientCarePlans(patientId) {
    try {
      const response = await apiHelpers.get(`/patients/${patientId}/care-plans`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create care plan
  async createCarePlan(patientId, carePlanData) {
    try {
      const response = await apiHelpers.post(`/patients/${patientId}/care-plans`, carePlanData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update care plan
  async updateCarePlan(carePlanId, carePlanData) {
    try {
      const response = await apiHelpers.put(`/care-plans/${carePlanId}`, carePlanData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get medication administration records
  async getMedicationAdministration(patientId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`/patients/${patientId}/medication-administration?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Record medication administration
  async recordMedicationAdministration(administrationData) {
    try {
      const response = await apiHelpers.post('/medication-administration', administrationData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get ward information
  async getWardInfo(wardId) {
    try {
      const response = await apiHelpers.get(`/wards/${wardId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get ward patients
  async getWardPatients(wardId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`/wards/${wardId}/patients?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update patient status
  async updatePatientStatus(patientId, statusData) {
    try {
      const response = await apiHelpers.patch(`/patients/${patientId}/status`, statusData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get nurse schedule
  async getNurseSchedule(nurseId, startDate, endDate) {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/${nurseId}/schedule?startDate=${startDate}&endDate=${endDate}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update nurse schedule
  async updateNurseSchedule(nurseId, scheduleData) {
    try {
      const response = await apiHelpers.put(`${this.baseURL}/${nurseId}/schedule`, scheduleData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get shift handover notes
  async getHandoverNotes(wardId, shiftDate) {
    try {
      const response = await apiHelpers.get(`/wards/${wardId}/handover?date=${shiftDate}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create shift handover notes
  async createHandoverNotes(handoverData) {
    try {
      const response = await apiHelpers.post('/handover-notes', handoverData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get patient observations
  async getPatientObservations(patientId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`/patients/${patientId}/observations?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Record patient observation
  async recordObservation(patientId, observationData) {
    try {
      const response = await apiHelpers.post(`/patients/${patientId}/observations`, observationData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get nursing documentation templates
  async getDocumentationTemplates() {
    try {
      const response = await apiHelpers.get('/nursing/documentation-templates');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get nurse statistics
  async getNurseStatistics(nurseId = null) {
    try {
      const url = nurseId ? `${this.baseURL}/${nurseId}/statistics` : `${this.baseURL}/statistics`;
      const response = await apiHelpers.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Export nurse data
  async exportNurseData(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.download(`${this.baseURL}/export?${queryParams}`, 'nurses.xlsx');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get available wards
  async getAvailableWards() {
    try {
      const response = await apiHelpers.get('/wards');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get nursing specializations
  async getNursingSpecializations() {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/specializations`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Request overtime
  async requestOvertime(nurseId, overtimeData) {
    try {
      const response = await apiHelpers.post(`${this.baseURL}/${nurseId}/overtime`, overtimeData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get emergency protocols
  async getEmergencyProtocols() {
    try {
      const response = await apiHelpers.get('/nursing/emergency-protocols');
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const nurseService = new NurseService();
