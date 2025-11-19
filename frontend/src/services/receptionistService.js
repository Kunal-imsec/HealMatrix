import { apiHelpers } from './api';

class ReceptionistService {
  constructor() {
    this.baseURL = '/receptionists';
  }

  // Get all receptionists
  async getAllReceptionists(params = {}) {
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

  // Get receptionist by ID
  async getReceptionistById(id) {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create new receptionist
  async createReceptionist(receptionistData) {
    try {
      const response = await apiHelpers.post(this.baseURL, receptionistData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update receptionist
  async updateReceptionist(id, receptionistData) {
    try {
      const response = await apiHelpers.put(`${this.baseURL}/${id}`, receptionistData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete receptionist
  async deleteReceptionist(id) {
    try {
      const response = await apiHelpers.delete(`${this.baseURL}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Patient Registration
  async registerPatient(patientData) {
    try {
      const response = await apiHelpers.post('/patients/register', patientData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Quick patient registration
  async quickRegisterPatient(quickPatientData) {
    try {
      const response = await apiHelpers.post('/patients/quick-register', quickPatientData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Search existing patients
  async searchPatients(searchTerm) {
    try {
      const response = await apiHelpers.get(`/patients/search?q=${encodeURIComponent(searchTerm)}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get patient registration queue
  async getRegistrationQueue(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`/front-desk/registration-queue?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Appointment Management
  async scheduleAppointment(appointmentData) {
    try {
      const response = await apiHelpers.post('/appointments', appointmentData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get available appointment slots
  async getAvailableSlots(doctorId, date) {
    try {
      const response = await apiHelpers.get(`/appointments/available-slots?doctorId=${doctorId}&date=${date}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Reschedule appointment
  async rescheduleAppointment(appointmentId, newScheduleData) {
    try {
      const response = await apiHelpers.patch(`/appointments/${appointmentId}/reschedule`, newScheduleData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Cancel appointment
  async cancelAppointment(appointmentId, reason) {
    try {
      const response = await apiHelpers.patch(`/appointments/${appointmentId}/cancel`, { reason });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get today's appointments
  async getTodaysAppointments(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`/appointments/today?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Check-in Management
  async checkInPatient(appointmentId, checkInData = {}) {
    try {
      const response = await apiHelpers.patch(`/appointments/${appointmentId}/checkin`, checkInData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Check-out patient
  async checkOutPatient(appointmentId, checkOutData = {}) {
    try {
      const response = await apiHelpers.patch(`/appointments/${appointmentId}/checkout`, checkOutData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get waiting queue
  async getWaitingQueue(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`/front-desk/waiting-queue?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update queue status
  async updateQueueStatus(queueId, status, notes = '') {
    try {
      const response = await apiHelpers.patch(`/front-desk/queue/${queueId}`, { status, notes });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Walk-in Management
  async addWalkInPatient(walkInData) {
    try {
      const response = await apiHelpers.post('/front-desk/walk-in', walkInData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get walk-in queue
  async getWalkInQueue(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`/front-desk/walk-in-queue?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Visitor Management
  async registerVisitor(visitorData) {
    try {
      const response = await apiHelpers.post('/front-desk/visitors', visitorData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get visitor log
  async getVisitorLog(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`/front-desk/visitors?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Check out visitor
  async checkOutVisitor(visitorId) {
    try {
      const response = await apiHelpers.patch(`/front-desk/visitors/${visitorId}/checkout`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Billing Support
  async getBillingInformation(patientId) {
    try {
      const response = await apiHelpers.get(`/billing/patient/${patientId}/summary`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Process payment
  async processPayment(billId, paymentData) {
    try {
      const response = await apiHelpers.post(`/billing/${billId}/payment`, paymentData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Generate payment receipt
  async generatePaymentReceipt(paymentId) {
    try {
      const response = await apiHelpers.download(`/billing/payments/${paymentId}/receipt`, `receipt-${paymentId}.pdf`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Insurance Management
  async verifyInsurance(insuranceData) {
    try {
      const response = await apiHelpers.post('/insurance/verify', insuranceData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get insurance providers
  async getInsuranceProviders() {
    try {
      const response = await apiHelpers.get('/insurance/providers');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Communication
  async sendAppointmentReminder(appointmentId, reminderType = 'EMAIL') {
    try {
      const response = await apiHelpers.post(`/appointments/${appointmentId}/reminder`, { type: reminderType });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Send bulk reminders
  async sendBulkReminders(appointmentIds, reminderType = 'EMAIL') {
    try {
      const response = await apiHelpers.post('/appointments/bulk-reminder', { 
        appointmentIds, 
        type: reminderType 
      });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get available doctors
  async getAvailableDoctors(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`/doctors/available?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get departments
  async getDepartments() {
    try {
      const response = await apiHelpers.get('/departments');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Reports and Statistics
  async getFrontDeskStatistics() {
    try {
      const response = await apiHelpers.get('/front-desk/statistics');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get daily report
  async getDailyReport(date = null) {
    try {
      const queryParam = date ? `?date=${date}` : '';
      const response = await apiHelpers.get(`/front-desk/daily-report${queryParam}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Export daily report
  async exportDailyReport(date = null) {
    try {
      const queryParam = date ? `?date=${date}` : '';
      const filename = date ? `daily-report-${date}.xlsx` : 'daily-report.xlsx';
      const response = await apiHelpers.download(`/front-desk/daily-report/export${queryParam}`, filename);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Emergency Management
  async declareEmergency(emergencyData) {
    try {
      const response = await apiHelpers.post('/front-desk/emergency', emergencyData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get emergency protocols
  async getEmergencyProtocols() {
    try {
      const response = await apiHelpers.get('/front-desk/emergency-protocols');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Resource Management
  async checkResourceAvailability(resourceType, date = null) {
    try {
      const queryParam = date ? `&date=${date}` : '';
      const response = await apiHelpers.get(`/resources/availability?type=${resourceType}${queryParam}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Book resource
  async bookResource(resourceId, bookingData) {
    try {
      const response = await apiHelpers.post(`/resources/${resourceId}/book`, bookingData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Patient Information Updates
  async updatePatientInfo(patientId, updateData) {
    try {
      const response = await apiHelpers.patch(`/patients/${patientId}`, updateData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Print patient wristband
  async printWristband(patientId) {
    try {
      const response = await apiHelpers.post(`/patients/${patientId}/wristband`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get receptionist statistics
  async getReceptionistStatistics(receptionistId = null) {
    try {
      const url = receptionistId ? `${this.baseURL}/${receptionistId}/statistics` : `${this.baseURL}/statistics`;
      const response = await apiHelpers.get(url);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const receptionistService = new ReceptionistService();
