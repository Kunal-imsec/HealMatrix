// Format currency
export const formatCurrency = (amount, currency = 'USD', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency
  }).format(amount);
};

// Format number
export const formatNumber = (number, decimals = 0, locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(number);
};

// Format percentage
export const formatPercentage = (value, decimals = 2) => {
  return `${formatNumber(value, decimals)}%`;
};

// Format phone number
export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = ('' + phone).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + '-' + match[3];
  }
  return phone;
};

// Format SSN
export const formatSSN = (ssn) => {
  if (!ssn) return '';
  const cleaned = ('' + ssn).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{2})(\d{4})$/);
  if (match) {
    return match[1] + '-' + match[2] + '-' + match[3];
  }
  return ssn;
};

// Mask SSN
export const maskSSN = (ssn) => {
  if (!ssn) return '';
  const cleaned = ('' + ssn).replace(/\D/g, '');
  if (cleaned.length === 9) {
    return 'XXX-XX-' + cleaned.slice(-4);
  }
  return ssn;
};

// Format credit card
export const formatCreditCard = (cardNumber) => {
  if (!cardNumber) return '';
  const cleaned = ('' + cardNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{4})(\d{4})(\d{4})(\d{4})$/);
  if (match) {
    return match[1] + ' ' + match[2] + ' ' + match[3] + ' ' + match[4];
  }
  return cardNumber;
};

// Mask credit card
export const maskCreditCard = (cardNumber) => {
  if (!cardNumber) return '';
  const cleaned = ('' + cardNumber).replace(/\D/g, '');
  if (cleaned.length === 16) {
    return '**** **** **** ' + cleaned.slice(-4);
  }
  return cardNumber;
};

// Format name
export const formatName = (firstName, lastName, middleName = '') => {
  const parts = [firstName, middleName, lastName].filter(Boolean);
  return parts.join(' ');
};

// Format address
export const formatAddress = (address) => {
  if (!address) return '';
  const { street, city, state, zipCode, country } = address;
  const parts = [street, city, state, zipCode, country].filter(Boolean);
  return parts.join(', ');
};

// Format bytes to human readable
export const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

// Format duration (seconds to readable format)
export const formatDuration = (seconds) => {
  if (seconds < 60) return `${seconds} sec`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr`;
  return `${Math.floor(seconds / 86400)} days`;
};

// Format time ago
export const formatTimeAgo = (date) => {
  const now = new Date();
  const past = new Date(date);
  const seconds = Math.floor((now - past) / 1000);
  
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} weeks ago`;
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} months ago`;
  return `${Math.floor(seconds / 31536000)} years ago`;
};

// Sanitize filename
export const sanitizeFilename = (filename) => {
  return filename.replace(/[^a-z0-9.]/gi, '_').toLowerCase();
};

// Format medical record number
export const formatMRN = (mrn) => {
  if (!mrn) return '';
  const cleaned = ('' + mrn).replace(/\D/g, '');
  return 'MRN-' + cleaned.padStart(8, '0');
};

// Format appointment ID
export const formatAppointmentId = (id) => {
  if (!id) return '';
  return 'APT-' + String(id).padStart(6, '0');
};

// Format prescription ID
export const formatPrescriptionId = (id) => {
  if (!id) return '';
  return 'RX-' + String(id).padStart(6, '0');
};

// Format invoice number
export const formatInvoiceNumber = (id) => {
  if (!id) return '';
  return 'INV-' + String(id).padStart(8, '0');
};

export default {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatPhoneNumber,
  formatSSN,
  maskSSN,
  formatCreditCard,
  maskCreditCard,
  formatName,
  formatAddress,
  formatBytes,
  formatDuration,
  formatTimeAgo,
  sanitizeFilename,
  formatMRN,
  formatAppointmentId,
  formatPrescriptionId,
  formatInvoiceNumber
};
