// Format date
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 
                'Thursday', 'Friday', 'Saturday'];
  
  const year = d.getFullYear();
  const month = d.getMonth();
  const day = d.getDate();
  const dayOfWeek = d.getDay();
  const hours = d.getHours();
  const minutes = d.getMinutes();
  const seconds = d.getSeconds();
  
  // Format mappings
  const formatMap = {
    YYYY: year,
    YY: String(year).slice(-2),
    MMMM: months[month],
    MMM: months[month],
    MM: String(month + 1).padStart(2, '0'),
    M: month + 1,
    DD: String(day).padStart(2, '0'),
    D: day,
    dddd: days[dayOfWeek],
    ddd: days[dayOfWeek].slice(0, 3),
    HH: String(hours).padStart(2, '0'),
    H: hours,
    hh: String(hours % 12 || 12).padStart(2, '0'),
    h: hours % 12 || 12,
    mm: String(minutes).padStart(2, '0'),
    m: minutes,
    ss: String(seconds).padStart(2, '0'),
    s: seconds,
    A: hours >= 12 ? 'PM' : 'AM',
    a: hours >= 12 ? 'pm' : 'am'
  };
  
  let result = format;
  Object.keys(formatMap).forEach(key => {
    result = result.replace(key, formatMap[key]);
  });
  
  return result;
};

// Parse date
export const parseDate = (dateString) => {
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

// Add days to date
export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Add months to date
export const addMonths = (date, months) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

// Add years to date
export const addYears = (date, years) => {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + years);
  return result;
};

// Get difference in days
export const getDaysDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

// Get difference in hours
export const getHoursDifference = (date1, date2) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diffTime = Math.abs(d2 - d1);
  return Math.floor(diffTime / (1000 * 60 * 60));
};

// Check if date is today
export const isToday = (date) => {
  const today = new Date();
  const d = new Date(date);
  return d.getDate() === today.getDate() &&
         d.getMonth() === today.getMonth() &&
         d.getFullYear() === today.getFullYear();
};

// Check if date is tomorrow
export const isTomorrow = (date) => {
  const tomorrow = addDays(new Date(), 1);
  const d = new Date(date);
  return d.getDate() === tomorrow.getDate() &&
         d.getMonth() === tomorrow.getMonth() &&
         d.getFullYear() === tomorrow.getFullYear();
};

// Check if date is yesterday
export const isYesterday = (date) => {
  const yesterday = addDays(new Date(), -1);
  const d = new Date(date);
  return d.getDate() === yesterday.getDate() &&
         d.getMonth() === yesterday.getMonth() &&
         d.getFullYear() === yesterday.getFullYear();
};

// Check if date is weekend
export const isWeekend = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
};

// Get start of day
export const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// Get end of day
export const endOfDay = (date) => {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
};

// Get start of week
export const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

// Get end of week
export const endOfWeek = (date) => {
  const d = startOfWeek(date);
  return addDays(d, 6);
};

// Get start of month
export const startOfMonth = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), 1);
};

// Get end of month
export const endOfMonth = (date) => {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
};

// Get age from date of birth
export const getAge = (dateOfBirth) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// Get date range
export const getDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);
  
  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate = addDays(currentDate, 1);
  }
  
  return dates;
};

// Get business days between dates
export const getBusinessDays = (startDate, endDate) => {
  let count = 0;
  let current = new Date(startDate);
  const end = new Date(endDate);
  
  while (current <= end) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current = addDays(current, 1);
  }
  
  return count;
};

export default {
  formatDate,
  parseDate,
  addDays,
  addMonths,
  addYears,
  getDaysDifference,
  getHoursDifference,
  isToday,
  isTomorrow,
  isYesterday,
  isWeekend,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  getAge,
  getDateRange,
  getBusinessDays
};
