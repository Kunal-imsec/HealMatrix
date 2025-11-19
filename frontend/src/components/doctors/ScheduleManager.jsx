import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import { appointmentService } from '../../services/appointmentService';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { 
  Calendar, 
  Clock, 
  User, 
  Plus, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal,
  Eye,
  Edit3,
  X
} from 'lucide-react';

const ScheduleManager = ({ doctorId, doctorName, editable = true }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'day', 'week', 'month'
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  useEffect(() => {
    fetchScheduleData();
  }, [doctorId, currentDate, viewMode]);

  const fetchScheduleData = async () => {
    try {
      // Fetch appointments and availability for the current period
      const startDate = getStartDate();
      const endDate = getEndDate();
      
      // Mock data - replace with actual API calls
      const mockAppointments = [
        {
          id: 1,
          patientName: 'John Doe',
          patientId: 'P001',
          appointmentType: 'CONSULTATION',
          date: '2025-10-22',
          timeSlot: '09:00 - 09:30',
          startTime: '09:00',
          endTime: '09:30',
          status: 'CONFIRMED',
          reason: 'Regular checkup'
        },
        {
          id: 2,
          patientName: 'Jane Smith',
          patientId: 'P002',
          appointmentType: 'FOLLOW_UP',
          date: '2025-10-22',
          timeSlot: '10:00 - 10:30',
          startTime: '10:00',
          endTime: '10:30',
          status: 'SCHEDULED',
          reason: 'Follow-up consultation'
        },
        {
          id: 3,
          patientName: 'Robert Johnson',
          patientId: 'P003',
          appointmentType: 'CONSULTATION',
          date: '2025-10-23',
          timeSlot: '14:00 - 14:30',
          startTime: '14:00',
          endTime: '14:30',
          status: 'CONFIRMED',
          reason: 'Back pain consultation'
        }
      ];

      const mockAvailability = [
        { dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00', isActive: true },
        { dayOfWeek: 'TUESDAY', startTime: '09:00', endTime: '17:00', isActive: true },
        { dayOfWeek: 'WEDNESDAY', startTime: '09:00', endTime: '17:00', isActive: true },
        { dayOfWeek: 'THURSDAY', startTime: '09:00', endTime: '17:00', isActive: true },
        { dayOfWeek: 'FRIDAY', startTime: '09:00', endTime: '17:00', isActive: true }
      ];

      setAppointments(mockAppointments);
      setAvailability(mockAvailability);
    } catch (err) {
      console.error('Error fetching schedule data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStartDate = () => {
    const date = new Date(currentDate);
    switch (viewMode) {
      case 'day':
        return date;
      case 'week':
        const day = date.getDay();
        const diff = date.getDate() - day;
        return new Date(date.setDate(diff));
      case 'month':
        return new Date(date.getFullYear(), date.getMonth(), 1);
      default:
        return date;
    }
  };

  const getEndDate = () => {
    const startDate = getStartDate();
    switch (viewMode) {
      case 'day':
        return startDate;
      case 'week':
        const endWeek = new Date(startDate);
        endWeek.setDate(startDate.getDate() + 6);
        return endWeek;
      case 'month':
        return new Date(startDate.getFullYear(), startDate.getMonth() + 1, 0);
      default:
        return startDate;
    }
  };

  const navigateDate = (direction) => {
    const newDate = new Date(currentDate);
    switch (viewMode) {
      case 'day':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
        break;
      case 'week':
        newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
        break;
      case 'month':
        newDate.setMonth(currentDate.getMonth() + (direction === 'next' ? 1 : -1));
        break;
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const formatDate = (date, format = 'full') => {
    const d = new Date(date);
    switch (format) {
      case 'day':
        return d.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
      case 'month':
        return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
      case 'week':
        const startWeek = getStartDate();
        const endWeek = getEndDate();
        return `${startWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
      default:
        return d.toLocaleDateString();
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'CONSULTATION':
        return 'bg-blue-500';
      case 'FOLLOW_UP':
        return 'bg-green-500';
      case 'EMERGENCY':
        return 'bg-red-500';
      case 'CHECKUP':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };

  const renderDayView = () => {
    const dayAppointments = appointments.filter(apt => apt.date === currentDate.toISOString().split('T')[0]);
    const timeSlots = [];
    
    // Generate time slots from 8 AM to 6 PM
    for (let hour = 8; hour <= 18; hour++) {
      timeSlots.push(`${hour.toString().padStart(2, '0')}:00`);
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {formatDate(currentDate, 'full')}
          </h3>
        </div>
        
        <div className="p-4">
          <div className="space-y-2">
            {timeSlots.map(time => {
              const appointment = dayAppointments.find(apt => apt.startTime === time);
              
              return (
                <div key={time} className="flex items-center space-x-4 py-2 border-b border-gray-100 last:border-b-0">
                  <div className="w-16 text-sm font-medium text-gray-600">
                    {time}
                  </div>
                  
                  {appointment ? (
                    <div
                      onClick={() => handleAppointmentClick(appointment)}
                      className="flex-1 cursor-pointer"
                    >
                      <div className={`p-3 rounded-lg border ${getStatusColor(appointment.status)}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${getTypeColor(appointment.appointmentType)}`}></div>
                            <div>
                              <p className="font-medium">{appointment.patientName}</p>
                              <p className="text-sm text-gray-600">{appointment.reason}</p>
                            </div>
                          </div>
                          <span className="text-xs font-medium">
                            {appointment.timeSlot}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 text-sm text-gray-400">
                      Available
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startWeek = getStartDate();
    const weekDays = [];
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startWeek);
      date.setDate(startWeek.getDate() + i);
      weekDays.push(date);
    }

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-4 text-sm font-medium text-gray-600">Time</div>
          {weekDays.map(day => (
            <div key={day.toISOString()} className="p-4 text-center border-l border-gray-200">
              <div className="text-sm font-medium text-gray-900">
                {day.toLocaleDateString('en-US', { weekday: 'short' })}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {day.getDate()}
              </div>
            </div>
          ))}
        </div>
        
        <div className="divide-y divide-gray-100">
          {Array.from({ length: 11 }, (_, i) => i + 8).map(hour => (
            <div key={hour} className="grid grid-cols-8">
              <div className="p-2 text-sm text-gray-600 border-r border-gray-200">
                {`${hour.toString().padStart(2, '0')}:00`}
              </div>
              {weekDays.map(day => {
                const dayStr = day.toISOString().split('T')[0];
                const hourStr = `${hour.toString().padStart(2, '0')}:00`;
                const appointment = appointments.find(apt => 
                  apt.date === dayStr && apt.startTime === hourStr
                );
                
                return (
                  <div key={`${dayStr}-${hourStr}`} className="p-1 border-l border-gray-200 min-h-[60px]">
                    {appointment && (
                      <div
                        onClick={() => handleAppointmentClick(appointment)}
                        className={`p-2 rounded text-xs cursor-pointer ${getStatusColor(appointment.status)}`}
                      >
                        <div className="font-medium truncate">{appointment.patientName}</div>
                        <div className="truncate">{appointment.timeSlot}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthView = () => {
    const startMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startCalendar = new Date(startMonth);
    startCalendar.setDate(startCalendar.getDate() - startMonth.getDay());
    
    const calendarDays = [];
    for (let i = 0; i < 42; i++) {
      const date = new Date(startCalendar);
      date.setDate(startCalendar.getDate() + i);
      calendarDays.push(date);
    }

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {/* Week day headers */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {weekDays.map(day => (
            <div key={day} className="p-4 text-center text-sm font-medium text-gray-600 border-r border-gray-200 last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7">
          {calendarDays.map(date => {
            const dateStr = date.toISOString().split('T')[0];
            const dayAppointments = appointments.filter(apt => apt.date === dateStr);
            const isCurrentMonth = date.getMonth() === currentDate.getMonth();
            const isToday = date.toDateString() === new Date().toDateString();
            
            return (
              <div 
                key={dateStr} 
                className={`min-h-[120px] p-2 border-r border-b border-gray-200 last:border-r-0 ${
                  !isCurrentMonth ? 'bg-gray-50' : ''
                } ${isToday ? 'bg-blue-50' : ''}`}
              >
                <div className={`text-sm font-medium mb-2 ${
                  !isCurrentMonth ? 'text-gray-400' : isToday ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {date.getDate()}
                </div>
                
                <div className="space-y-1">
                  {dayAppointments.slice(0, 3).map(appointment => (
                    <div
                      key={appointment.id}
                      onClick={() => handleAppointmentClick(appointment)}
                      className={`text-xs p-1 rounded cursor-pointer truncate ${getStatusColor(appointment.status)}`}
                    >
                      {appointment.patientName}
                    </div>
                  ))}
                  
                  {dayAppointments.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{dayAppointments.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Calendar className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Schedule Manager</h3>
              <p className="text-gray-600">{doctorName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigateDate('prev')}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            />
                       <div className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
              {formatDate(currentDate, viewMode)}
            </div>
            
            <Button
              variant="outline"
              onClick={() => navigateDate('next')}
              leftIcon={<ChevronRight className="h-4 w-4" />}
            />
            
            <Button
              variant="outline"
              onClick={goToToday}
            >
              Today
            </Button>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
              {['day', 'week', 'month'].map(mode => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1 text-sm font-medium rounded capitalize transition-colors ${
                    viewMode === mode
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
            
            {editable && (
              <Button
                variant="primary"
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Appointment
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Schedule View */}
      {viewMode === 'day' && renderDayView()}
      {viewMode === 'week' && renderWeekView()}
      {viewMode === 'month' && renderMonthView()}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Clock className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <User className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900">
                {appointments.filter(apt => apt.status === 'CONFIRMED').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Hours</p>
              <p className="text-2xl font-bold text-gray-900">6</p>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Detail Modal */}
      {showAppointmentModal && selectedAppointment && (
        <Modal
          isOpen={showAppointmentModal}
          onClose={() => setShowAppointmentModal(false)}
          title="Appointment Details"
          size="md"
        >
          <AppointmentDetailView
            appointment={selectedAppointment}
            editable={editable}
            onClose={() => setShowAppointmentModal(false)}
            onUpdate={() => {
              setShowAppointmentModal(false);
              fetchScheduleData();
            }}
          />
        </Modal>
      )}
    </div>
  );
};

// Appointment Detail View Component
const AppointmentDetailView = ({ appointment, editable, onClose, onUpdate }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      // await appointmentService.updateAppointmentStatus(appointment.id, newStatus);
      onUpdate();
    } catch (err) {
      console.error('Error updating appointment status:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Patient Information */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-3">Patient Information</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Patient Name</label>
            <p className="font-medium text-gray-900">{appointment.patientName}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Patient ID</label>
            <p className="font-medium text-gray-900">{appointment.patientId}</p>
          </div>
        </div>
      </div>

      {/* Appointment Details */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Date</label>
            <p className="font-medium text-gray-900">
              {new Date(appointment.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Time</label>
            <p className="font-medium text-gray-900">{appointment.timeSlot}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-600">Type</label>
            <p className="font-medium text-gray-900">{appointment.appointmentType}</p>
          </div>
          <div>
            <label className="text-sm text-gray-600">Status</label>
            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
              {appointment.status}
            </span>
          </div>
        </div>

        <div>
          <label className="text-sm text-gray-600">Reason for Visit</label>
          <p className="font-medium text-gray-900">{appointment.reason}</p>
        </div>
      </div>

      {/* Actions */}
      {editable && (
        <div className="border-t border-gray-200 pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Quick Actions</h4>
          <div className="flex flex-wrap gap-2">
            {appointment.status === 'SCHEDULED' && (
              <Button
                size="sm"
                variant="success"
                onClick={() => handleStatusChange('CONFIRMED')}
              >
                Confirm
              </Button>
            )}
            
            {['SCHEDULED', 'CONFIRMED'].includes(appointment.status) && (
              <>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Edit3 className="h-3 w-3" />}
                >
                  Reschedule
                </Button>
                
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleStatusChange('CANCELLED')}
                >
                  Cancel
                </Button>
              </>
            )}
            
            {appointment.status === 'CONFIRMED' && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleStatusChange('COMPLETED')}
              >
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      )}

      {/* Close Button */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex justify-end space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Close
          </Button>
          
          {editable && (
            <Button
              variant="primary"
              leftIcon={<Eye className="h-4 w-4" />}
            >
              View Full Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduleManager;
