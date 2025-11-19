import { REGEX_PATTERNS } from './constants';

// Email validation
export const validateEmail = (email) => {
  if (!email) return { isValid: false, error: 'Email is required' };
  const isValid = REGEX_PATTERNS.EMAIL.test(email);
  return {
    isValid,
    error: isValid ? '' : 'Please enter a valid email address'
  };
};

// Phone validation
export const validatePhone = (phone) => {
  if (!phone) return { isValid: false, error: 'Phone number is required' };
  const isValid = REGEX_PATTERNS.PHONE.test(phone);
  return {
    isValid,
    error: isValid ? '' : 'Please enter a valid phone number'
  };
};

// Password validation
export const validatePassword = (password) => {
  if (!password) return { isValid: false, error: 'Password is required' };
  
  const errors = [];
  if (password.length < 8) errors.push('at least 8 characters');
  if (!/[a-z]/.test(password)) errors.push('one lowercase letter');
  if (!/[A-Z]/.test(password)) errors.push('one uppercase letter');
  if (!/\d/.test(password)) errors.push('one number');
  if (!/[@$!%*?&]/.test(password)) errors.push('one special character');
  
  return {
    isValid: errors.length === 0,
    error: errors.length > 0 ? `Password must contain ${errors.join(', ')}` : ''
  };
};

// Confirm password validation
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return { isValid: false, error: 'Please confirm your password' };
  const isValid = password === confirmPassword;
  return {
    isValid,
    error: isValid ? '' : 'Passwords do not match'
  };
};

// Name validation
export const validateName = (name, fieldName = 'Name') => {
  if (!name) return { isValid: false, error: `${fieldName} is required` };
  if (name.length < 2) return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  if (name.length > 50) return { isValid: false, error: `${fieldName} must be less than 50 characters` };
  if (!/^[a-zA-Z\s]+$/.test(name)) return { isValid: false, error: `${fieldName} can only contain letters` };
  
  return { isValid: true, error: '' };
};

// Required field validation
export const validateRequired = (value, fieldName = 'Field') => {
  const isValid = value !== null && value !== undefined && value !== '';
  return {
    isValid,
    error: isValid ? '' : `${fieldName} is required`
  };
};

// Number validation
export const validateNumber = (value, min = null, max = null, fieldName = 'Value') => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const num = Number(value);
  if (isNaN(num)) return { isValid: false, error: `${fieldName} must be a number` };
  if (min !== null && num < min) return { isValid: false, error: `${fieldName} must be at least ${min}` };
  if (max !== null && num > max) return { isValid: false, error: `${fieldName} must be at most ${max}` };
  
  return { isValid: true, error: '' };
};

// Date validation
export const validateDate = (date, fieldName = 'Date') => {
  if (!date) return { isValid: false, error: `${fieldName} is required` };
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: `${fieldName} is invalid` };
  }
  
  return { isValid: true, error: '' };
};

// Future date validation
export const validateFutureDate = (date, fieldName = 'Date') => {
  const dateValidation = validateDate(date, fieldName);
  if (!dateValidation.isValid) return dateValidation;
  
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (dateObj < today) {
    return { isValid: false, error: `${fieldName} must be in the future` };
  }
  
  return { isValid: true, error: '' };
};

// Past date validation
export const validatePastDate = (date, fieldName = 'Date') => {
  const dateValidation = validateDate(date, fieldName);
  if (!dateValidation.isValid) return dateValidation;
  
  const dateObj = new Date(date);
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  
  if (dateObj > today) {
    return { isValid: false, error: `${fieldName} must be in the past` };
  }
  
  return { isValid: true, error: '' };
};

// Age validation
export const validateAge = (dateOfBirth, minAge = 0, maxAge = 150) => {
  const dateValidation = validatePastDate(dateOfBirth, 'Date of birth');
  if (!dateValidation.isValid) return dateValidation;
  
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  if (age < minAge) {
    return { isValid: false, error: `Age must be at least ${minAge} years` };
  }
  
  if (age > maxAge) {
    return { isValid: false, error: `Age must be at most ${maxAge} years` };
  }
  
  return { isValid: true, error: '' };
};

// URL validation
export const validateUrl = (url) => {
  if (!url) return { isValid: false, error: 'URL is required' };
  
  try {
    new URL(url);
    return { isValid: true, error: '' };
  } catch (err) {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
};

// ZIP code validation
export const validateZipCode = (zipCode) => {
  if (!zipCode) return { isValid: false, error: 'ZIP code is required' };
  const isValid = REGEX_PATTERNS.ZIP_CODE.test(zipCode);
  return {
    isValid,
    error: isValid ? '' : 'Please enter a valid ZIP code'
  };
};

// SSN validation
export const validateSSN = (ssn) => {
  if (!ssn) return { isValid: false, error: 'SSN is required' };
  const isValid = REGEX_PATTERNS.SSN.test(ssn);
  return {
    isValid,
    error: isValid ? '' : 'Please enter a valid SSN (XXX-XX-XXXX)'
  };
};

// File validation
export const validateFile = (file, maxSize = 10485760, allowedTypes = []) => {
  if (!file) return { isValid: false, error: 'File is required' };
  
  if (file.size > maxSize) {
    return { 
      isValid: false, 
      error: `File size must be less than ${(maxSize / 1048576).toFixed(0)}MB` 
    };
  }
  
  if (allowedTypes.length > 0 && !allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: 'File type not allowed'
    };
  }
  
  return { isValid: true, error: '' };
};

// Array validation
export const validateArray = (array, minLength = 1, fieldName = 'Items') => {
  if (!Array.isArray(array)) {
    return { isValid: false, error: `${fieldName} must be an array` };
  }
  
  if (array.length < minLength) {
    return { 
      isValid: false, 
      error: `At least ${minLength} ${fieldName.toLowerCase()} required` 
    };
  }
  
  return { isValid: true, error: '' };
};

export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validateConfirmPassword,
  validateName,
  validateRequired,
  validateNumber,
  validateDate,
  validateFutureDate,
  validatePastDate,
  validateAge,
  validateUrl,
  validateZipCode,
  validateSSN,
  validateFile,
  validateArray
};
