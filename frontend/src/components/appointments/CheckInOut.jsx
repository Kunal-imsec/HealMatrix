import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import Button from '../common/Button';
import { 
  Clock, 
  CheckCircle, 
  User, 
  Calendar,
  AlertCircle,
  MapPin,
  Phone
} from 'lucide-react';

const CheckInOut = ({ appointmentId, onStatusChange }) => {
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [checkInTime, setCheckInTime] = useState(null);
  const [waitTime, setWaitTime] = useState(0);

  useEffect(() => {
    fetchAppointment();
  }, [appointmentId]);

  useEffect(() => {
    let interval;
    if (checkInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const checkedIn = new Date(checkInTime);
        const diff = Math.floor((now - checkedIn) / 60000); // minutes
        setWaitTime(diff);
      }, 60000); // Update every minute
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [checkInTime]);

  const fetchAppointment = async () => {
    try {
      const response = await appointmentService.getAppointmentById(appointmentId);
      setAppointment(response);
      
      if (response.checkedInAt) {
        setCheckInTime(response.checkedInAt);
      }
    } catch (err) {
      setError('Failed to fetch appointment details');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    setProcessing(true);
    setError('');

    try {
      await appointmentService.checkinAppointment(appointmentId);
      
      const now = new Date().toISOString();
      setCheckInTime(now);
      setAppointment(prev => ({ 
        ...prev, 
        status: 'CHECKED_IN',
        checkedInAt: now
      }));
      
      if (onStatusChange) {
        onStatusChange('CHECKED_IN');
      }
    } catch (err) {
      setError('Failed to check in. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCheckOut = async () => {
    setProcessing(true);
    setError('');

    try {
      const checkOutData = {
        checkOutTime: new Date().toISOString(),
        waitTime: waitTime
      };
      
      await appointmentService.checkoutAppointment(appointmentId, checkOutData);
      
      setAppointment(prev => ({ 
        ...prev, 
        status: 'COMPLETED',
        checkedOutAt: new Date().toISOString()
      }));
      
      if (onStatusChange) {
        onStatusChange('COMPLETED');
      }
    } catch (err) {
      setError('Failed to check out. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'CHECKED_IN':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Appointment Not Found</h3>
          <p className="text-gray-600">Unable to load appointment details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Check-In/Check-Out</h3>
          <p className="text-gray-600">Manage appointment status</p>
        </div>
        
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(appointment.status)}`}>
          {appointment.status?.replace('_', ' ')}
        </span>
      </div>

      {/* Appointment Details */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Patient:</span>
            <span className="font-medium text-gray-900">{appointment.patientName}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Doctor:</span>
            <span className="font-medium text-gray-900">Dr. {appointment.doctorName}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Date:</span>
            <span className="font-medium text-gray-900">
              {new Date(appointment.date).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Time:</span>
            <span className="font-medium text-gray-900">{appointment.timeSlot}</span>
          </div>
        </div>

        <div className="pt-3 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Reason:</span> {appointment.reason}
          </p>
        </div>
      </div>

      {/* Check-In Status */}
      {checkInTime && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Checked In</p>
                <p className="text-sm text-yellow-700">
                  at {formatTime(checkInTime)}
                </p>
              </div>
            </div>
            
            <div className="text-right">
              <p className="text-sm font-medium text-yellow-800">
                Wait Time: {waitTime} minutes
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Patient Contact Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">Patient Contact Information</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4 text-blue-600" />
            <span className="text-blue-800">{appointment.patientPhone || 'Not provided'}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-blue-600" />
            <span className="text-blue-800">{appointment.patientAddress || 'Not provided'}</span>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        {appointment.status === 'CONFIRMED' && !checkInTime && (
          <Button
            variant="primary"
            onClick={handleCheckIn}
            loading={processing}
            leftIcon={<CheckCircle className="h-4 w-4" />}
            size="lg"
          >
            Check In Patient
          </Button>
        )}

        {(appointment.status === 'CHECKED_IN' || appointment.status === 'IN_PROGRESS') && (
          <Button
            variant="success"
            onClick={handleCheckOut}
            loading={processing}
            leftIcon={<CheckCircle className="h-4 w-4" />}
            size="lg"
          >
            Complete Appointment
          </Button>
        )}

        {appointment.status === 'COMPLETED' && (
          <div className="text-center py-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <p className="text-green-700 font-medium">Appointment Completed</p>
            <p className="text-sm text-green-600">
              Checked out at {appointment.checkedOutAt ? formatTime(appointment.checkedOutAt) : 'N/A'}
            </p>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 mb-2">Instructions</h4>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Check in the patient when they arrive</li>
          <li>• Monitor wait time for patient satisfaction</li>
          <li>• Complete the appointment after the consultation</li>
          <li>• Contact patient if there are any delays</li>
        </ul>
      </div>
    </div>
  );
};

export default CheckInOut;
