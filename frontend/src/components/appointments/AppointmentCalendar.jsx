import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../hooks/useAuth';
import { ChevronLeft, ChevronRight, Calendar, Plus } from 'lucide-react';

const AppointmentCalendar = ({ onDateSelect, onAppointmentClick }) => {
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMonthAppointments();
  }, [currentDate, user]);

  const fetchMonthAppointments = async () => {
    setLoading(true);
    try {
      const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      let response;
      if (user.role === 'DOCTOR') {
        response = await appointmentService.getDoctorAppointmentsByDateRange(
          user.id, 
          startDate.toISOString().split('T')[0], 
          endDate.toISOString().split('T')[0]
        );
      } else if (user.role === 'PATIENT') {
        response = await appointmentService.getPatientAppointmentsByDateRange(
          user.id, 
          startDate.toISOString().split('T')[0], 
          endDate.toISOString().split('T')[0]
        );
      } else {
        response = await appointmentService.getAppointmentsByDateRange(
          startDate.toISOString().split('T')[0], 
          endDate.toISOString().split('T')[0]
        );
      }
      
      setAppointments(response);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false });
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({ date: new Date(year, month, day), isCurrentMonth: true });
    }
    
    // Next month days to fill the grid
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      days.push({ date: new Date(year, month + 1, day), isCurrentMonth: false });
    }
    
    return days;
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => 
      apt.appointmentDateTime.split('T')[0] === dateStr
    );
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-3">
          <Calendar className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {getDaysInMonth().map((dayObj, index) => {
            const dayAppointments = getAppointmentsForDate(dayObj.date);
            const hasAppointments = dayAppointments.length > 0;
            
            return (
              <div
                key={index}
                onClick={() => dayObj.isCurrentMonth && handleDateClick(dayObj.date)}
                className={`
                  relative p-2 h-16 border rounded cursor-pointer transition-colors
                  ${dayObj.isCurrentMonth ? 'hover:bg-blue-50' : 'text-gray-300'}
                  ${isToday(dayObj.date) ? 'bg-blue-100 border-blue-300' : 'border-gray-200'}
                  ${isSelected(dayObj.date) ? 'bg-blue-600 text-white' : ''}
                  ${!dayObj.isCurrentMonth ? 'cursor-not-allowed' : ''}
                `}
              >
                <div className="text-sm font-medium">
                  {dayObj.date.getDate()}
                </div>
                
                {hasAppointments && (
                  <div className="absolute bottom-1 left-1 right-1">
                    <div className="flex flex-wrap gap-1">
                      {dayAppointments.slice(0, 2).map((apt, i) => (
                        <div
                          key={apt.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            onAppointmentClick && onAppointmentClick(apt);
                          }}
                          className={`
                            w-2 h-2 rounded-full cursor-pointer
                            ${apt.status === 'CONFIRMED' ? 'bg-green-500' : 
                              apt.status === 'SCHEDULED' ? 'bg-blue-500' :
                              apt.status === 'CANCELLED' ? 'bg-red-500' : 'bg-gray-500'}
                          `}
                          title={`${apt.patientName || apt.doctorName} - ${apt.reason}`}
                        />
                      ))}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-600 font-medium">
                          +{dayAppointments.length - 2}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 pb-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-xs text-gray-600 mt-3">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Confirmed</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Scheduled</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Cancelled</span>
            </div>
          </div>
          
          {user.role === 'PATIENT' && (
            <button 
              onClick={() => window.location.href = '/appointments/book'}
              className="flex items-center space-x-1 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Book</span>
            </button>
          )}
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      )}
    </div>
  );
};

export default AppointmentCalendar;
