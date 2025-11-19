import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import Button from '../common/Button';
import Input from '../common/Input';
import TimeSlotPicker from './TimeSlotPicker';
import { AlertCircle, CheckCircle, Calendar, User, Clock } from 'lucide-react';

const EditAppointment = ({ appointmentId, onSuccess, onCancel }) => {
  const [appointment, setAppointment] = useState(null);
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    timeSlot: '',
    appointmentType: '',
    priority: '',
    reason: '',
    notes: '',
    duration: 30,
    status: ''
  });

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [changesSaved, setChangesSaved] = useState(false);

  useEffect(() => {
    fetchAppointment();
    fetchDoctors();
  }, [appointmentId]);

  const fetchAppointment = async () => {
    try {
      const response = await appointmentService.getAppointmentById(appointmentId);
      setAppointment(response);
      setFormData({
        doctorId: response.doctorId,
        date: response.date,
        timeSlot: response.timeSlot,
        appointmentType: response.appointmentType,
        priority: response.priority,
        reason: response.reason,
        notes: response.notes || '',
        duration: response.duration || 30,
        status: response.status
      });
    } catch (err) {
      setError('Failed to fetch appointment details');
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorService.getAllDoctors();
      setDoctors(response);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    setChangesSaved(false);
  };

  const handleTimeSlotSelect = (date, timeSlot) => {
    setFormData(prev => ({ ...prev, date, timeSlot }));
    setChangesSaved(false);
  };

  const validateForm = () => {
    if (!formData.reason.trim()) {
      setError('Please provide reason for appointment');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setError('');

    try {
      await appointmentService.updateAppointment(appointmentId, formData);
      setChangesSaved(true);
      setSuccess(true);
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update appointment');
    } finally {
      setSaving(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setSaving(true);
      
      if (newStatus === 'CANCELLED') {
        await appointmentService.cancelAppointment(appointmentId, 'Cancelled by user');
      } else {
        await appointmentService.updateAppointment(appointmentId, { ...formData, status: newStatus });
      }
      
      setFormData(prev => ({ ...prev, status: newStatus }));
      setChangesSaved(true);
    } catch (err) {
      setError(err.message || 'Failed to update appointment status');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success && changesSaved) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-8">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Appointment Updated Successfully!
          </h3>
          <p className="text-gray-600">
            The appointment changes have been saved and notifications will be sent.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Edit Appointment</h3>
            <p className="text-gray-600">Update appointment details</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className={`
              px-3 py-1 text-xs font-medium rounded-full
              ${formData.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                formData.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                formData.status === 'CANCELLED' ? 'bg-red-100 text-red-800' :
                formData.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                'bg-yellow-100 text-yellow-800'
              }
            `}>
              {formData.status}
            </span>
          </div>
        </div>

        {/* Current Appointment Info */}
        {appointment && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-gray-900 mb-3">Current Appointment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Patient:</span>
                <span className="font-medium">{appointment.patientName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Doctor:</span>
                <span className="font-medium">{appointment.doctorName}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Date:</span>
                <span className="font-medium">{appointment.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-gray-600">Time:</span>
                <span className="font-medium">{appointment.timeSlot}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Quick Status Actions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Quick Actions
          </label>
          <div className="flex flex-wrap gap-2">
            {formData.status === 'SCHEDULED' && (
              <Button
                size="sm"
                variant="success"
                onClick={() => handleStatusChange('CONFIRMED')}
                loading={saving}
              >
                Confirm Appointment
              </Button>
            )}
            
            {['SCHEDULED', 'CONFIRMED'].includes(formData.status) && (
              <Button
                size="sm"
                variant="danger"
                onClick={() => handleStatusChange('CANCELLED')}
                loading={saving}
              >
                Cancel Appointment
              </Button>
            )}
            
            {formData.status === 'CONFIRMED' && (
              <Button
                size="sm"
                variant="primary"
                onClick={() => handleStatusChange('COMPLETED')}
                loading={saving}
              >
                Mark as Completed
              </Button>
            )}
          </div>
        </div>

        {/* Doctor Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Doctor
          </label>
          <select
            value={formData.doctorId}
            onChange={(e) => handleInputChange('doctorId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={formData.status !== 'SCHEDULED'}
          >
            {doctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        {/* Date & Time Selection */}
        {formData.status === 'SCHEDULED' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reschedule Appointment
            </label>
            <TimeSlotPicker
              doctorId={formData.doctorId}
              selectedDate={formData.date}
              selectedTimeSlot={formData.timeSlot}
              onTimeSlotSelect={handleTimeSlotSelect}
              compact={true}
            />
          </div>
        )}

        {/* Appointment Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Appointment Type
            </label>
            <select
              value={formData.appointmentType}
              onChange={(e) => handleInputChange('appointmentType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="CONSULTATION">Consultation</option>
              <option value="FOLLOW_UP">Follow Up</option>
              <option value="CHECKUP">Regular Checkup</option>
              <option value="EMERGENCY">Emergency</option>
              <option value="PROCEDURE">Procedure</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </div>

        <Input
          label="Reason for Visit *"
          value={formData.reason}
          onChange={(e) => handleInputChange('reason', e.target.value)}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Additional notes or updates"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <select
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value={15}>15 minutes</option>
            <option value={30}>30 minutes</option>
            <option value={45}>45 minutes</option>
            <option value={60}>1 hour</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {changesSaved && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Changes saved successfully!</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={handleSave}
          loading={saving}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditAppointment;
