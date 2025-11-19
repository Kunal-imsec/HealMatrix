import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { useAuth } from '../../hooks/useAuth';
import AppointmentCard from './AppointmentCard';
import LoadingSpinner from '../common/LoadingSpinner';
import { Calendar, Filter, Search, Plus } from 'lucide-react';

const AppointmentList = ({ 
  showCreateButton = false, 
  filterByDoctor = null, 
  filterByPatient = null 
}) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    searchTerm: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, [user, filters, filterByDoctor, filterByPatient]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let response;
      
      // Role-based data fetching based on our authentication pattern
      if (user.role === 'ADMIN') {
        response = await appointmentService.getAllAppointments(filters);
      } else if (user.role === 'DOCTOR') {
        response = await appointmentService.getDoctorAppointments(user.id, filters);
      } else if (user.role === 'PATIENT') {
        response = await appointmentService.getPatientAppointments(user.id, filters);
      } else if (user.role === 'NURSE' || user.role === 'RECEPTIONIST') {
        response = await appointmentService.getAllAppointments(filters);
      }

      if (filterByDoctor) {
        response = response.filter(apt => apt.doctorId === filterByDoctor);
      }
      if (filterByPatient) {
        response = response.filter(apt => apt.patientId === filterByPatient);
      }

      setAppointments(response);
    } catch (err) {
      setError('Failed to fetch appointments');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, newStatus);
      fetchAppointments(); // Refresh the list
    } catch (err) {
      setError('Failed to update appointment status');
    }
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: 'bg-blue-100 text-blue-800',
      CONFIRMED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
      COMPLETED: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Appointments</h2>
        </div>
        {showCreateButton && (
          <button 
            onClick={() => window.location.href = '/appointments/book'}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search appointments..."
                value={filters.searchTerm}
                onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No appointments found</h3>
            <p className="text-gray-400">Try adjusting your filters or create a new appointment.</p>
          </div>
        ) : (
          appointments.map((appointment) => (
            <AppointmentCard
              key={appointment.id}
              appointment={appointment}
              onStatusChange={handleStatusChange}
              userRole={user.role}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default AppointmentList;
