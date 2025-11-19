import api from './api';

const fileService = {
  // Upload single file
  uploadFile: async (file, options = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      // Add optional metadata
      if (options.category) formData.append('category', options.category);
      if (options.description) formData.append('description', options.description);
      if (options.tags) formData.append('tags', JSON.stringify(options.tags));

      const response = await api.post('/files/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: options.onProgress ? (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          options.onProgress(percentCompleted);
        } : undefined
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload multiple files
  uploadMultipleFiles: async (files, options = {}) => {
    try {
      const formData = new FormData();
      
      Array.from(files).forEach((file, index) => {
        formData.append('files', file);
      });

      if (options.category) formData.append('category', options.category);

      const response = await api.post('/files/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: options.onProgress ? (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          options.onProgress(percentCompleted);
        } : undefined
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get file by ID
  getFileById: async (fileId) => {
    try {
      const response = await api.get(`/files/${fileId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Download file
  downloadFile: async (fileId, filename) => {
    try {
      const response = await api.get(`/files/${fileId}/download`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename || `file_${fileId}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get file URL
  getFileUrl: (fileId) => {
    const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    return `${API_URL}/files/${fileId}/view`;
  },

  // Delete file
  deleteFile: async (fileId) => {
    try {
      const response = await api.delete(`/files/${fileId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get files by category
  getFilesByCategory: async (category, params = {}) => {
    try {
      const response = await api.get(`/files/category/${category}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get files by entity (patient, appointment, etc.)
  getEntityFiles: async (entityType, entityId) => {
    try {
      const response = await api.get(`/files/entity/${entityType}/${entityId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Attach file to entity
  attachFileToEntity: async (fileId, entityType, entityId) => {
    try {
      const response = await api.post('/files/attach', {
        fileId,
        entityType,
        entityId
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload patient document
  uploadPatientDocument: async (patientId, file, documentType) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patientId', patientId);
      formData.append('documentType', documentType);

      const response = await api.post('/files/patient-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload medical record
  uploadMedicalRecord: async (patientId, file, recordType) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patientId', patientId);
      formData.append('recordType', recordType);

      const response = await api.post('/files/medical-record', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload profile photo
  uploadProfilePhoto: async (userId, file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const response = await api.post(`/files/profile-photo/${userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get storage info
  getStorageInfo: async () => {
    try {
      const response = await api.get('/files/storage-info');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search files
  searchFiles: async (query, params = {}) => {
    try {
      const response = await api.get('/files/search', {
        params: { q: query, ...params }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Validate file before upload
  validateFile: (file, options = {}) => {
    const {
      maxSize = 10485760, // 10MB default
      allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 
                      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx']
    } = options;

    // Check file size
    if (file.size > maxSize) {
      return {
        valid: false,
        error: `File size exceeds maximum allowed size of ${maxSize / 1048576}MB`
      };
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: 'File type not allowed'
      };
    }

    // Check file extension
    const extension = file.name.split('.').pop().toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      return {
        valid: false,
        error: 'File extension not allowed'
      };
    }

    return { valid: true };
  },

  // Format file size
  formatFileSize: (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }
};

export default fileService;
