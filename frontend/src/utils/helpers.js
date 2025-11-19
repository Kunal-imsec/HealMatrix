// Generate unique ID
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Generate random string
export const generateRandomString = (length = 10) => {
  return Math.random().toString(36).substring(2, length + 2);
};

// Capitalize first letter
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// Capitalize all words
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.split(' ').map(word => capitalize(word)).join(' ');
};

// Truncate text
export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + suffix;
};

// Generate initials from name
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

// Deep clone object
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

// Check if object is empty
export const isEmpty = (obj) => {
  if (obj === null || obj === undefined) return true;
  if (Array.isArray(obj)) return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

// Remove duplicates from array
export const removeDuplicates = (array, key = null) => {
  if (!key) return [...new Set(array)];
  return array.filter((item, index, self) =>
    index === self.findIndex((t) => t[key] === item[key])
  );
};

// Sort array by key
export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

// Group array by key
export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

// Debounce function
export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Throttle function
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

// Sleep/delay function
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

// Download file
export const downloadFile = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};

// Copy to clipboard
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

// Get query params from URL
export const getQueryParams = () => {
  const params = new URLSearchParams(window.location.search);
  const result = {};
  for (const [key, value] of params) {
    result[key] = value;
  }
  return result;
};

// Update query params
export const updateQueryParams = (params) => {
  const searchParams = new URLSearchParams(window.location.search);
  Object.keys(params).forEach(key => {
    if (params[key] === null || params[key] === undefined) {
      searchParams.delete(key);
    } else {
      searchParams.set(key, params[key]);
    }
  });
  const newUrl = `${window.location.pathname}?${searchParams.toString()}`;
  window.history.pushState({}, '', newUrl);
};

// Calculate age from date of birth
export const calculateAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Generate random color
export const generateRandomColor = () => {
  return '#' + Math.floor(Math.random()*16777215).toString(16);
};

// Check if mobile device
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Get file extension
export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

// Format file size
export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

export default {
  generateId,
  generateRandomString,
  capitalize,
  capitalizeWords,
  truncateText,
  getInitials,
  deepClone,
  isEmpty,
  removeDuplicates,
  sortBy,
  groupBy,
  debounce,
  throttle,
  sleep,
  downloadFile,
  copyToClipboard,
  getQueryParams,
  updateQueryParams,
  calculateAge,
  generateRandomColor,
  isMobileDevice,
  getFileExtension,
  formatFileSize
};
