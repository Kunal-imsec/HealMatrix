import { apiHelpers } from './api';

class AuthService {
  constructor() {
    this.baseURL = '/auth';
  }

  // ==========================
  // 🔐 User Login
  // ==========================
  async login(credentials) {
    try {
      console.log('🔵 ==================== LOGIN START ====================');
      console.log('🔵 authService: Received credentials:', {
        identifier: credentials?.identifier,
        hasPassword: !!credentials?.password,
        passwordLength: credentials?.password?.length
      });

      // ✅ Validate input
      if (!credentials?.identifier || credentials.identifier.trim() === '') {
        throw new Error('Email or username is required');
      }
      if (!credentials?.password || credentials.password.trim() === '') {
        throw new Error('Password is required');
      }

      // ✅ FIX: Map to what backend expects
      // Try different field name combinations
      const identifier = credentials.identifier.trim();
      const isEmail = identifier.includes('@');
      
      // Send both 'email' and 'username' fields based on input type
      const payload = isEmail 
        ? {
            email: identifier,
            username: identifier,  // Some backends check both
            password: credentials.password
          }
        : {
            username: identifier,
            email: identifier,  // Some backends check both
            password: credentials.password
          };

      console.log('🔵 authService: Sending payload:', {
        email: payload.email,
        username: payload.username,
        hasPassword: !!payload.password
      });

      const response = await apiHelpers.post(`${this.baseURL}/login`, payload);
      
      console.log('🟢 ==================== RESPONSE RECEIVED ====================');
      console.log('🟢 authService: Response:', response);
      console.log('🟢 authService: Has token:', !!response.token);
      console.log('🟢 authService: Has user:', !!response.user);

      if (response.token) {
        if (response.user && typeof response.user === 'object') {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('loginTime', new Date().toISOString());

          console.log('🟢 authService: ✅ Data saved successfully');
          console.log('🟢 authService: Token saved:', !!localStorage.getItem('authToken'));
          console.log('🟢 authService: User saved:', !!localStorage.getItem('user'));
        } else {
          throw new Error('Invalid user data received');
        }
      } else {
        throw new Error('No token in response');
      }

      console.log('🟢 ==================== LOGIN SUCCESS ====================');
      return response;
      
    } catch (error) {
      console.log('🔴 ==================== LOGIN FAILED ====================');
      console.error('🔴 authService: Error:', error.message);
      console.error('🔴 authService: Full error:', error);
      throw error;
    }
  }

  // ==========================
  // 📝 Registration
  // ==========================
  async register(userData) {
    try {
      return await apiHelpers.post(`${this.baseURL}/register`, userData);
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async registerPatient(patientData) {
    try {
      return await apiHelpers.post('/patients/register', patientData);
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // ==========================
  // 🚪 Logout & Token Handling
  // ==========================
  async logout() {
    try {
      await apiHelpers.post(`${this.baseURL}/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearAuthData();
    }
  }

  async refreshToken() {
    try {
      const response = await apiHelpers.post(`${this.baseURL}/refresh-token`);
      if (response.token) {
        localStorage.setItem('authToken', response.token);
        return response;
      }
      throw new Error('Failed to refresh token');
    } catch (error) {
      this.clearAuthData();
      throw error.response?.data || error;
    }
  }

  async verifyToken() {
    try {
      return await apiHelpers.get(`${this.baseURL}/verify`);
    } catch (error) {
      this.clearAuthData();
      throw error.response?.data || error;
    }
  }

  // ==========================
  // 👤 User Profile
  // ==========================
  async getCurrentUser() {
    try {
      const response = await apiHelpers.get(`${this.baseURL}/profile`);
      if (response && typeof response === 'object') {
        localStorage.setItem('user', JSON.stringify(response));
      }
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async updateProfile(userData) {
    try {
      const response = await apiHelpers.put(`${this.baseURL}/profile`, userData);
      if (response && typeof response === 'object') {
        localStorage.setItem('user', JSON.stringify(response));
      }
      return response;
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // ==========================
  // 🔑 Password & Verification
  // ==========================
  async changePassword(passwordData) {
    try {
      return await apiHelpers.post(`${this.baseURL}/change-password`, passwordData);
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async forgotPassword(email) {
    try {
      return await apiHelpers.post(`${this.baseURL}/forgot-password`, { email });
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async resetPassword(resetData) {
    try {
      return await apiHelpers.post(`${this.baseURL}/reset-password`, resetData);
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async verifyEmail(token) {
    try {
      return await apiHelpers.post(`${this.baseURL}/verify-email`, { token });
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  async resendVerificationEmail(email) {
    try {
      return await apiHelpers.post(`${this.baseURL}/resend-verification`, { email });
    } catch (error) {
      throw error.response?.data || error;
    }
  }

  // ==========================
  // 💾 Session & Local Storage
  // ==========================
  getSessionInfo() {
    const loginTime = localStorage.getItem('loginTime');
    const user = this.getCurrentUserFromStorage();

    if (!loginTime || !user) return null;

    const now = new Date();
    const login = new Date(loginTime);
    const sessionDuration = Math.floor((now - login) / (1000 * 60));

    return {
      loginTime: login,
      sessionDuration,
      user,
      isActive: sessionDuration < (8 * 60),
    };
  }

  isAuthenticated() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('user');
    return !!(token && user && user !== 'undefined' && user !== 'null');
  }

  getCurrentUserFromStorage() {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr || userStr === 'undefined' || userStr === 'null') return null;

      const user = JSON.parse(userStr);
      if (user && typeof user === 'object' && user.email) return user;

      console.warn('Invalid user object in localStorage');
      this.clearAuthData();
      return null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      this.clearAuthData();
      return null;
    }
  }

  clearAuthData() {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('loginTime');
      localStorage.removeItem('preferences');
      localStorage.removeItem('socketId');
    } catch (error) {
      console.error('Error clearing auth data:', error);
    }
  }

  // ==========================
  // 🧩 Roles & Permissions
  // ==========================
  hasRole(role) {
    const user = this.getCurrentUserFromStorage();
    return user?.role === role;
  }

  hasAnyRole(roles) {
    const user = this.getCurrentUserFromStorage();
    return roles.includes(user?.role);
  }
}

export const authService = new AuthService();
