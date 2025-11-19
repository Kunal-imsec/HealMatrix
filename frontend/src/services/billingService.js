import { apiHelpers } from './api';

class BillingService {
  constructor() {
    this.baseURL = '/billing';
  }

  // Get all bills
  async getAllBills(params = {}) {
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

  // Get bill by ID
  async getBillById(id) {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create new bill
  async createBill(billData) {
    try {
      const response = await apiHelpers.post(this.baseURL, billData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update bill
  async updateBill(id, billData) {
    try {
      const response = await apiHelpers.put(`${this.baseURL}/${id}`, billData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete bill
  async deleteBill(id) {
    try {
      const response = await apiHelpers.delete(`${this.baseURL}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Process payment
  async processPayment(billId, paymentData) {
    try {
      const response = await apiHelpers.post(`${this.baseURL}/${billId}/payment`, paymentData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get patient's bills
  async getPatientBills(patientId, params = {}) {
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

  // Get doctor's bills
  async getDoctorBills(doctorId, params = {}) {
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

  // Get billing statistics
  async getBillingStatistics() {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/statistics`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get patient billing stats
  async getPatientBillingStats(patientId) {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/patient/${patientId}/statistics`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Download bill PDF
  async downloadBillPDF(billId) {
    try {
      const response = await apiHelpers.download(`${this.baseURL}/${billId}/pdf`, `bill-${billId}.pdf`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get available services
  async getServices() {
    try {
      const response = await apiHelpers.get('/services');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Export bills
  async exportBills(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.download(`${this.baseURL}/export?${queryParams}`, 'bills.xlsx');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Send bill reminder
  async sendBillReminder(billId) {
    try {
      const response = await apiHelpers.post(`${this.baseURL}/${billId}/reminder`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get payment methods
  async getPaymentMethods() {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/payment-methods`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const billingService = new BillingService();
