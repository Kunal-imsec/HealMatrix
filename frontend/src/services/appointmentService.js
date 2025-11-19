import { apiHelpers } from './api';

class AppointmentService {
  constructor() {
    this.baseURL = '/appointments';
  }

  // Get all appointments
  async getAllAppointments(params = {}) {
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

  // Get appointment by ID
  async getAppointmentById(id) {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create new appointment
  async createAppointment(appointmentData) {
    try {
      const response = await apiHelpers.post(this.baseURL, appointmentData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update appointment
  async updateAppointment(id, appointmentData) {
    try {
      const response = await apiHelpers.put(`${this.baseURL}/${id}`, appointmentData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Cancel appointment
  async cancelAppointment(id, reason = '') {
    try {
      const response = await apiHelpers.patch(`${this.baseURL}/${id}/cancel`, { reason });
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Complete appointment
  async completeAppointment(id, completionData) {
    try {
      const response = await apiHelpers.patch(`${this.baseURL}/${id}/complete`, completionData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Reschedule appointment
  async rescheduleAppointment(id, newScheduleData) {
    try {
      const response = await apiHelpers.patch(`${this.baseURL}/${id}/reschedule`, newScheduleData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Check-in appointment
  async checkinAppointment(id) {
    try {
      const response = await apiHelpers.patch(`${this.baseURL}/${id}/checkin`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get available time slots
  async getAvailableSlots(doctorId, date) {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/available-slots?doctorId=${doctorId}&date=${date}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get patient's appointments
  async getPatientAppointments(patientId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`${this.baseURL}/patient/${patientId}?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get doctor's appointments
  async getDoctorAppointments(doctorId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`${this.baseURL}/doctor/${doctorId}?${queryParams}`);
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
      
      const response = await apiHelpers.get(`${this.baseURL}/today?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get appointment statistics
  async getAppointmentStatistics(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`${this.baseURL}/statistics?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Export appointments
  async exportAppointments(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.download(`${this.baseURL}/export?${queryParams}`, 'appointments.xlsx');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Send appointment reminder
  async sendReminder(id, reminderType = 'EMAIL') {
    try {
      const response = await apiHelpers.post(`${this.baseURL}/${id}/reminder`, { type: reminderType });
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const appointmentService = new AppointmentService();
