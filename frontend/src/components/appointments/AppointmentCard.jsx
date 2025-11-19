import React, { useState } from 'react';
import { Calendar, Clock, User, MapPin, Phone, MessageCircle, Edit, Trash2 } from 'lucide-react';
import { appointmentService } from '../../services/appointmentService';

const AppointmentCard = ({ appointment, onStatusChange, userRole }) => {
  const [loading, setLoading] = useState(false);
  
  const getStatusColor = (status) => {
    const colors = {
      SCHEDULED: 'bg-blue-100 text-blue-800 border-blue-200',
      CONFIRMED: 'bg-green-100 text-green-800 border-green-200',
      CANCELLED: 'bg-red-100 text-red-800 border-red-200',
      COMPLETED: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return {
      date: date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      }),
      time: date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    };
  };

  const handleStatusChange = async (newStatus) => {
    setLoading(true);
    try {
      await onStatusChange(appointment.id, newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setLoading(false);
    }
  };

  const canModifyAppointment = () => {
    const userCanModify = ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'].includes(userRole);
    const isNotCompleted = appointment.status !== 'COMPLETED';
    return userCanModify && isNotCompleted;
  };

  const canCancelAppointment = () => {
    if (userRole === 'PATIENT') {
      return appointment.status === 'SCHEDULED' && appointment.patientId === appointment.currentUserId;
    }
    return ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'].includes(userRole) && 
           appointment.status !== 'COMPLETED';
  };

  const { date, time } = formatDateTime(appointment.appointmentDateTime);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-blue-50 rounded-lg">
            <Calendar className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-lg">
              {userRole === 'PATIENT' ? `Dr. ${appointment.doctorName}` : appointment.patientName}
            </h3>
            <p className="text-gray-600">{appointment.departmentName}</p>
            <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{time}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(appointment.status)}`}>
            {appointment.status}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium text-gray-700">Reason for Visit</p>
          <p className="text-gray-600">{appointment.reason}</p>
        </div>
        
        {appointment.notes && (
          <div>
            <p className="text-sm font-medium text-gray-700">Notes</p>
            <p className="text-gray-600">{appointment.notes}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {appointment.location && (
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{appointment.location}</span>
              </div>
            )}
            {appointment.phoneNumber && (
              <div className="flex items-center space-x-1">
                <Phone className="w-4 h-4" />
                <span>{appointment.phoneNumber}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {canModifyAppointment() && (
              <>
                {appointment.status === 'SCHEDULED' && (
                  <button
                    onClick={() => handleStatusChange('CONFIRMED')}
                    disabled={loading}
                    className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
                  >
                    Confirm
                  </button>
                )}
                
                {appointment.status === 'CONFIRMED' && userRole === 'DOCTOR' && (
                  <button
                    onClick={() => handleStatusChange('COMPLETED')}
                    disabled={loading}
                    className="px-3 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
                  >
                    Complete
                  </button>
                )}

                <button
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                  title="Edit appointment"
                >
                  <Edit className="w-4 h-4" />
                </button>
              </>
            )}

            {canCancelAppointment() && (
              <button
                onClick={() => handleStatusChange('CANCELLED')}
                disabled={loading}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                title="Cancel appointment"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded"
              title="Send message"
            >
              <MessageCircle className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
