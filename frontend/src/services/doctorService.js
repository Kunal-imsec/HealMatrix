// Helper function to try both v1 and normal endpoints
const fetchWithFallback = async (v1Endpoint, normalEndpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  
  if (!token) {
    console.error('❌ No auth token found');
    throw new Error('No authentication token');
  }
  
  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    ...options.headers
  };

  console.log('🔵 Attempting API call:', v1Endpoint);

  // Try v1 first
  try {
    const response = await fetch(`http://localhost:8080/api/v1${v1Endpoint}`, {
      ...options,
      headers
    });
    
    console.log(`🔵 v1 response status:`, response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ v1 success:', result);
      // Handle ApiResponse wrapper: {message, data, success}
      return result.data || result;
    }
    
    if (response.status === 401 || response.status === 403) {
      console.error('❌ Unauthorized - token may be expired');
      // Don't fallback on auth errors
      throw new Error('Unauthorized - please login again');
    }
  } catch (error) {
    console.log(`⚠️ v1 endpoint failed: ${error.message}`);
  }

  // Fallback to normal
  console.log('🔵 Trying fallback:', normalEndpoint);
  try {
    const response = await fetch(`http://localhost:8080/api${normalEndpoint}`, {
      ...options,
      headers
    });
    
    console.log(`🔵 Normal response status:`, response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Normal endpoint success:', result);
      return result.data || result;
    }
  } catch (error) {
    console.error('❌ Both endpoints failed:', error);
  }

  throw new Error('Failed to fetch data from both endpoints');
};

class DoctorService {
  constructor() {
    this.baseURL = '/doctors';
    this.adminBaseURL = '/admin/doctors';
  }

  // ✅ Get all doctors with enhanced logging
  async getAllDoctors(params = {}) {
    console.log('🏥 DoctorService.getAllDoctors() called with params:', params);
    
    try {
      const data = await fetchWithFallback(
        this.adminBaseURL,     // /api/v1/admin/doctors
        this.adminBaseURL      // /api/admin/doctors
      );
      
      console.log('✅ Doctors data received:', {
        isArray: Array.isArray(data),
        length: data?.length,
        sample: data?.[0]
      });
      
      if (!Array.isArray(data)) {
        console.warn('⚠️ Data is not an array:', typeof data);
        return [];
      }
      
      return data;
    } catch (error) {
      console.error('❌ Error in getAllDoctors:', error);
      return [];
    }
  }

  // ✅ Get doctor by ID
  async getDoctorById(id) {
    console.log('🔍 Getting doctor by ID:', id);
    try {
      const data = await fetchWithFallback(
        `${this.adminBaseURL}/${id}`,
        `${this.adminBaseURL}/${id}`
      );
      return data;
    } catch (error) {
      console.error('Error fetching doctor:', error);
      throw error;
    }
  }

  // ✅ Create new doctor
  async createDoctor(doctorData) {
    console.log('➕ Creating doctor:', doctorData);
    try {
      const data = await fetchWithFallback(
        this.adminBaseURL,
        this.adminBaseURL,
        {
          method: 'POST',
          body: JSON.stringify(doctorData)
        }
      );
      console.log('✅ Doctor created:', data);
      return data;
    } catch (error) {
      console.error('Error creating doctor:', error);
      throw error;
    }
  }

  // ✅ Update doctor
  async updateDoctor(id, doctorData) {
    console.log('📝 Updating doctor:', id, doctorData);
    try {
      const data = await fetchWithFallback(
        `${this.adminBaseURL}/${id}`,
        `${this.adminBaseURL}/${id}`,
        {
          method: 'PUT',
          body: JSON.stringify(doctorData)
        }
      );
      console.log('✅ Doctor updated:', data);
      return data;
    } catch (error) {
      console.error('Error updating doctor:', error);
      throw error;
    }
  }

  // ✅ Delete doctor
  async deleteDoctor(id) {
    console.log('🗑️ Deleting doctor:', id);
    try {
      await fetchWithFallback(
        `${this.adminBaseURL}/${id}`,
        `${this.adminBaseURL}/${id}`,
        { method: 'DELETE' }
      );
      console.log('✅ Doctor deleted');
      return { success: true, message: 'Doctor deleted successfully' };
    } catch (error) {
      console.error('Error deleting doctor:', error);
      throw error;
    }
  }

  // Get doctor's patients
  async getDoctorPatients(doctorId, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const data = await fetchWithFallback(
        `${this.baseURL}/${doctorId}/patients?${queryParams}`,
        `${this.baseURL}/${doctorId}/patients?${queryParams}`
      );
      return data || [];
    } catch (error) {
      console.error('Error fetching doctor patients:', error);
      return [];
    }
  }

  // Get doctor's appointments
  async getDoctorAppointments(doctorId, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const data = await fetchWithFallback(
        `${this.baseURL}/${doctorId}/appointments?${queryParams}`,
        `${this.baseURL}/${doctorId}/appointments?${queryParams}`
      );
      return data || [];
    } catch (error) {
      console.error('Error fetching doctor appointments:', error);
      return [];
    }
  }

  // Get doctor's schedule
  async getDoctorSchedule(doctorId, startDate, endDate) {
    try {
      const data = await fetchWithFallback(
        `${this.baseURL}/${doctorId}/schedule?startDate=${startDate}&endDate=${endDate}`,
        `${this.baseURL}/${doctorId}/schedule?startDate=${startDate}&endDate=${endDate}`
      );
      return data || [];
    } catch (error) {
      console.error('Error fetching doctor schedule:', error);
      return [];
    }
  }

  // Add schedule slot
  async addScheduleSlot(doctorId, slotData) {
    try {
      const data = await fetchWithFallback(
        `${this.baseURL}/${doctorId}/schedule`,
        `${this.baseURL}/${doctorId}/schedule`,
        {
          method: 'POST',
          body: JSON.stringify(slotData)
        }
      );
      return data;
    } catch (error) {
      console.error('Error adding schedule slot:', error);
      throw error;
    }
  }

  // Update schedule slot
  async updateScheduleSlot(slotId, slotData) {
    try {
      const data = await fetchWithFallback(
        `/schedule-slots/${slotId}`,
        `/schedule-slots/${slotId}`,
        {
          method: 'PUT',
          body: JSON.stringify(slotData)
        }
      );
      return data;
    } catch (error) {
      console.error('Error updating schedule slot:', error);
      throw error;
    }
  }

  // Delete schedule slot
  async deleteScheduleSlot(slotId) {
    try {
      await fetchWithFallback(
        `/schedule-slots/${slotId}`,
        `/schedule-slots/${slotId}`,
        { method: 'DELETE' }
      );
      return { success: true };
    } catch (error) {
      console.error('Error deleting schedule slot:', error);
      throw error;
    }
  }

  // Get doctor's prescriptions
  async getDoctorPrescriptions(doctorId, params = {}) {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const data = await fetchWithFallback(
        `${this.baseURL}/${doctorId}/prescriptions?${queryParams}`,
        `${this.baseURL}/${doctorId}/prescriptions?${queryParams}`
      );
      return data || [];
    } catch (error) {
      console.error('Error fetching doctor prescriptions:', error);
      return [];
    }
  }

  // ✅ Get departments
  async getDepartments() {
    console.log('📂 Fetching departments');
    try {
      const data = await fetchWithFallback('/departments', '/departments');
      if (data && Array.isArray(data)) {
        console.log('✅ Departments fetched:', data.length);
        return data;
      }
    } catch (error) {
      console.log('⚠️ Using mock departments');
    }
    
    return [
      { id: 1, name: 'Cardiology', description: 'Heart care' },
      { id: 2, name: 'Neurology', description: 'Brain & nervous system' },
      { id: 3, name: 'Pediatrics', description: 'Child healthcare' },
      { id: 4, name: 'Orthopedics', description: 'Bone & joint care' },
      { id: 5, name: 'Emergency', description: 'Emergency services' },
      { id: 6, name: 'Dermatology', description: 'Skin care' },
      { id: 7, name: 'Gynecology', description: 'Women\'s health' }
    ];
  }

  // ✅ Get specializations
  async getSpecializations() {
    console.log('📋 Fetching specializations');
    try {
      const data = await fetchWithFallback(
        `${this.adminBaseURL}/specializations`,
        `${this.baseURL}/specializations`
      );
      if (data && Array.isArray(data)) {
        console.log('✅ Specializations fetched:', data.length);
        return data;
      }
    } catch (error) {
      console.log('⚠️ Using mock specializations');
    }
    
    return [
      'Cardiology',
      'Neurology',
      'Pediatrics',
      'Orthopedics',
      'Dermatology',
      'Gynecology',
      'Psychiatry',
      'General Medicine',
      'Surgery'
    ];
  }

  // Get available doctors for HOD
  async getAvailableHODs() {
    try {
      const data = await fetchWithFallback(
        `${this.baseURL}/available-hods`,
        `${this.baseURL}/available-hods`
      );
      return data || [];
    } catch (error) {
      console.error('Error fetching available HODs:', error);
      return [];
    }
  }

  // Get doctor statistics
  async getDoctorStatistics(doctorId = null) {
    try {
      const endpoint = doctorId 
        ? `${this.adminBaseURL}/${doctorId}/statistics`
        : `${this.adminBaseURL}/statistics`;
      
      const data = await fetchWithFallback(endpoint, endpoint);
      return data || {
        totalDoctors: 0,
        activeDoctors: 0,
        averageRating: 0,
        totalAppointments: 0
      };
    } catch (error) {
      console.error('Error fetching doctor statistics:', error);
      return {
        totalDoctors: 0,
        activeDoctors: 0,
        averageRating: 0,
        totalAppointments: 0
      };
    }
  }

  // ✅ Export doctors
  async exportDoctors(params = {}) {
    console.log('📥 Exporting doctors with params:', params);
    try {
      const queryParams = new URLSearchParams();
      Object.keys(params).forEach(key => {
        if (params[key] && params[key] !== 'all') {
          queryParams.append(key, params[key]);
        }
      });
      
      const token = localStorage.getItem('authToken');
      
      // Try v1 first
      let response = await fetch(`http://localhost:8080/api/v1${this.adminBaseURL}/export?${queryParams}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      // Fallback to normal
      if (!response.ok) {
        response = await fetch(`http://localhost:8080/api${this.adminBaseURL}/export?${queryParams}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `doctors_${new Date().toISOString().split('T')[0]}.xlsx`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        console.log('✅ Doctors exported');
        return { success: true };
      }
      throw new Error('Export failed');
    } catch (error) {
      console.error('Error exporting doctors:', error);
      throw error;
    }
  }

  // Search doctors
  async searchDoctors(searchTerm, filters = {}) {
    try {
      const params = { search: searchTerm, ...filters };
      return await this.getAllDoctors(params);
    } catch (error) {
      console.error('Error searching doctors:', error);
      return [];
    }
  }

  // Get doctors by specialization
  async getDoctorsBySpecialization(specialization) {
    try {
      const data = await fetchWithFallback(
        `${this.baseURL}?specialization=${specialization}`,
        `${this.baseURL}?specialization=${specialization}`
      );
      return data || [];
    } catch (error) {
      console.error('Error fetching doctors by specialization:', error);
      return [];
    }
  }

  // Get doctors by department
  async getDoctorsByDepartment(departmentId) {
    try {
      const data = await fetchWithFallback(
        `${this.baseURL}?department=${departmentId}`,
        `${this.baseURL}?department=${departmentId}`
      );
      return data || [];
    } catch (error) {
      console.error('Error fetching doctors by department:', error);
      return [];
    }
  }

  // Get available doctors for booking
  async getAvailableDoctors(date, specialization = null) {
    try {
      const params = new URLSearchParams({ date });
      if (specialization) params.append('specialization', specialization);
      
      const data = await fetchWithFallback(
        `${this.baseURL}/available?${params}`,
        `${this.baseURL}/available?${params}`
      );
      return data || [];
    } catch (error) {
      console.error('Error fetching available doctors:', error);
      return [];
    }
  }
}

export const doctorService = new DoctorService();
