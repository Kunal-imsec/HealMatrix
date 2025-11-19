import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

const DatePicker = ({
  value = null,
  onChange,
  placeholder = 'Select date',
  format = 'MM/dd/yyyy',
  minDate = null,
  maxDate = null,
  disabled = false,
  error = '',
  label = '',
  required = false,
  className = '',
  size = 'md'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [displayMonth, setDisplayMonth] = useState(new Date());
  const [inputValue, setInputValue] = useState('');
  
  const containerRef = useRef(null);
  const inputRef = useRef(null);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  // Update input value when value prop changes
  useEffect(() => {
    if (value) {
      setInputValue(formatDate(value, format));
      setDisplayMonth(new Date(value));
    } else {
      setInputValue('');
    }
  }, [value, format]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDate = (date, format) => {
    if (!date) return '';
    
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, '0');
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const year = d.getFullYear();
    
    switch (format) {
      case 'MM/dd/yyyy':
        return `${month}/${day}/${year}`;
      case 'dd/MM/yyyy':
        return `${day}/${month}/${year}`;
      case 'yyyy-MM-dd':
        return `${year}-${month}-${day}`;
      case 'MMM dd, yyyy':
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
      default:
        return d.toLocaleDateString();
    }
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;
    
    // Handle different formats
    const formats = [
      /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/, // MM/dd/yyyy or dd/MM/yyyy
      /^(\d{4})-(\d{1,2})-(\d{1,2})$/, // yyyy-MM-dd
    ];
    
    for (const formatRegex of formats) {
      const match = dateString.match(formatRegex);
      if (match) {
        let year, month, day;
        
        if (format === 'dd/MM/yyyy') {
          [, day, month, year] = match;
        } else {
          [, month, day, year] = match;
        }
        
        if (format === 'yyyy-MM-dd') {
          [, year, month, day] = match;
        }
        
        const date = new Date(year, month - 1, day);
        if (date.getFullYear() == year && date.getMonth() == month - 1 && date.getDate() == day) {
          return date;
        }
      }
    }
    
    return null;
  };

  const isDateDisabled = (date) => {
    if (minDate && date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    return false;
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const firstDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    
    const parsedDate = parseDate(newValue);
    if (parsedDate && !isDateDisabled(parsedDate)) {
      onChange(parsedDate);
      setDisplayMonth(parsedDate);
    } else if (!newValue) {
      onChange(null);
    }
  };

  const handleDateClick = (date) => {
    if (!isDateDisabled(date)) {
      onChange(date);
      setIsOpen(false);
    }
  };

  const handlePrevMonth = () => {
    setDisplayMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!value) return false;
    return date.toDateString() === new Date(value).toDateString();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full pr-10 border rounded-lg transition-all duration-200
            ${sizeClasses[size]}
            ${error 
              ? 'border-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent' 
              : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
            }
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white cursor-pointer'}
          `}
        />
        
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <Calendar className={`h-4 w-4 ${disabled ? 'text-gray-400' : 'text-gray-500'}`} />
        </button>
      </div>

      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}

      {/* Calendar Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            
            <h3 className="text-lg font-semibold">
              {monthNames[displayMonth.getMonth()]} {displayMonth.getFullYear()}
            </h3>
            
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1 hover:bg-gray-100 rounded"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {dayNames.map(day => (
              <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(displayMonth).map((date, index) => (
              <div key={index} className="aspect-square">
                {date && (
                  <button
                    type="button"
                    onClick={() => handleDateClick(date)}
                    disabled={isDateDisabled(date)}
                    className={`
                      w-full h-full flex items-center justify-center text-sm rounded
                      ${isSelected(date)
                        ? 'bg-blue-600 text-white'
                        : isToday(date)
                        ? 'bg-blue-100 text-blue-600 font-medium'
                        : 'hover:bg-gray-100'
                      }
                      ${isDateDisabled(date)
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'cursor-pointer'
                      }
                    `}
                  >
                    {date.getDate()}
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                onChange(new Date());
                setIsOpen(false);
              }}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              Today
            </button>
            
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
