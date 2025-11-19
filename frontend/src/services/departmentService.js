import { apiHelpers } from './api';

class DepartmentService {
  constructor() {
    this.baseURL = '/departments';
  }

  // Get all departments
  async getAllDepartments(params = {}) {
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

  // Get department by ID
  async getDepartmentById(id) {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Create new department
  async createDepartment(departmentData) {
    try {
      const response = await apiHelpers.post(this.baseURL, departmentData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Update department
  async updateDepartment(id, departmentData) {
    try {
      const response = await apiHelpers.put(`${this.baseURL}/${id}`, departmentData);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Delete department
  async deleteDepartment(id) {
    try {
      const response = await apiHelpers.delete(`${this.baseURL}/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get department statistics
  async getDepartmentStatistics() {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/statistics`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get department staff
  async getDepartmentStaff(departmentId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`${this.baseURL}/${departmentId}/staff?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get department patients
  async getDepartmentPatients(departmentId, params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.get(`${this.baseURL}/${departmentId}/patients?${queryParams}`);
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Export departments data
  async exportDepartments(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key]) queryParams.append(key, params[key]);
      });
      
      const response = await apiHelpers.download(`${this.baseURL}/export?${queryParams}`, 'departments.xlsx');
      return response;
    } catch (error) {
      throw error;
    }
  }

  // Get department performance metrics
  async getDepartmentPerformance(departmentId, period = '30d') {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/${departmentId}/performance?period=${period}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}

export const departmentService = new DepartmentService();
