import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { ChevronLeft, ChevronRight, Clock, Calendar } from 'lucide-react';

const TimeSlotPicker = ({ 
  doctorId, 
  selectedDate, 
  selectedTimeSlot, 
  onTimeSlotSelect,
  compact = false,
  minDate = new Date(),
  maxDate = null
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState({});
  const [loading, setLoading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(selectedDate || '');

  useEffect(() => {
    if (doctorId) {
      fetchAvailableSlots();
    }
  }, [doctorId, currentMonth]);

  const fetchAvailableSlots = async () => {
    setLoading(true);
    try {
      // Fetch slots for the entire month
      const startDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      const endDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      
      const slotsData = {};
      
      // Simulate fetching slots for each day
      for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
        const dateString = date.toISOString().split('T')[0];
        if (date >= minDate && (!maxDate || date <= maxDate)) {
          try {
            const slots = await appointmentService.getAvailableSlots(doctorId, dateString);
            slotsData[dateString] = slots;
          } catch (error) {
            slotsData[dateString] = [];
          }
        }
      }
      
      setAvailableSlots(slotsData);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    } finally {
      setLoading(false);
    }
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

  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleDateSelect = (date) => {
    const dateString = date.toISOString().split('T')[0];
    setSelectedDay(dateString);
  };

  const handleTimeSlotClick = (timeSlot) => {
    if (onTimeSlotSelect) {
      onTimeSlotSelect(selectedDay, timeSlot);
    }
  };

  const isDateDisabled = (date) => {
    if (!date) return true;
    if (date < minDate) return true;
    if (maxDate && date > maxDate) return true;
    
    const dateString = date.toISOString().split('T')[0];
    const slots = availableSlots[dateString];
    return !slots || slots.length === 0;
  };

  const isDateSelected = (date) => {
    if (!date || !selectedDay) return false;
    return date.toISOString().split('T')[0] === selectedDay;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const timeSlots = selectedDay ? availableSlots[selectedDay] || [] : [];

  return (
    <div className={`${compact ? 'space-y-4' : 'space-y-6'}`}>
      {/* Calendar */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
            disabled={loading}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          
          <h3 className="text-lg font-semibold text-gray-900">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h3>
          
          <button
            type="button"
            onClick={handleNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg"
            disabled={loading}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Day Names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth(currentMonth).map((date, index) => (
            <div key={index} className="aspect-square">
              {date && (
                <button
                  type="button"
                  onClick={() => handleDateSelect(date)}
                  disabled={isDateDisabled(date) || loading}
                  className={`
                    w-full h-full flex items-center justify-center text-sm rounded-lg relative
                    ${isDateSelected(date)
                      ? 'bg-blue-600 text-white'
                      : isToday(date)
                      ? 'bg-blue-100 text-blue-600 font-medium'
                      : isDateDisabled(date)
                      ? 'text-gray-300 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                    }
                  `}
                >
                  {date.getDate()}
                  
                  {/* Available slots indicator */}
                  {!isDateDisabled(date) && availableSlots[date.toISOString().split('T')[0]]?.length > 0 && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                      <div className="w-1 h-1 bg-green-500 rounded-full"></div>
                    </div>
                  )}
                </button>
              )}
            </div>
          ))}
        </div>

        {loading && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">Loading available dates...</p>
          </div>
        )}
      </div>

      {/* Time Slots */}
      {selectedDay && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="h-4 w-4 text-gray-400" />
            <h4 className="font-medium text-gray-900">
              Available Times for {new Date(selectedDay).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h4>
          </div>

          {timeSlots.length === 0 ? (
            <div className="text-center py-8">
              <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">No available time slots for this date</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {timeSlots.map((slot, index) => (
                <button
                  key={index}
                  onClick={() => handleTimeSlotClick(slot)}
                  className={`
                    px-3 py-2 text-sm font-medium rounded-lg border transition-colors
                    ${selectedTimeSlot === slot
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                    }
                  `}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      {!compact && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <Clock className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">How to book:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li>Select an available date from the calendar</li>
                <li>Choose a time slot from the available options</li>
                <li>Your selection will be highlighted in blue</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeSlotPicker;
