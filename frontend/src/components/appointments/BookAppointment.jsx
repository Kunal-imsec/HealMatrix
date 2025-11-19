import React, { useState, useEffect } from 'react';
import { appointmentService } from '../../services/appointmentService';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import { useAuth } from '../../hooks/useAuth';
import { Calendar, Clock, User, Building2 } from 'lucide-react';

const BookAppointment = ({ onAppointmentBooked }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    doctorId: '',
    departmentId: '',
    appointmentDate: '',
    appointmentTime: '',
    reason: '',
    notes: ''
  });
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (formData.departmentId) {
      fetchDoctorsByDepartment(formData.departmentId);
    }
  }, [formData.departmentId]);

  useEffect(() => {
    if (formData.doctorId && formData.appointmentDate) {
      fetchAvailableSlots(formData.doctorId, formData.appointmentDate);
    }
  }, [formData.doctorId, formData.appointmentDate]);

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments();
      setDepartments(response);
    } catch (err) {
      setError('Failed to fetch departments');
    }
  };

  const fetchDoctorsByDepartment = async (departmentId) => {
    try {
      const response = await doctorService.getDoctorsByDepartment(departmentId);
      setDoctors(response);
    } catch (err) {
      setError('Failed to fetch doctors');
    }
  };

  const fetchAvailableSlots = async (doctorId, date) => {
    try {
      const response = await appointmentService.getAvailableSlots(doctorId, date);
      setAvailableSlots(response);
    } catch (err) {
      setError('Failed to fetch available slots');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Reset dependent fields
    if (name === 'departmentId') {
      setFormData(prev => ({ ...prev, doctorId: '', appointmentTime: '' }));
      setDoctors([]);
      setAvailableSlots([]);
    }
    if (name === 'doctorId') {
      setFormData(prev => ({ ...prev, appointmentTime: '' }));
      setAvailableSlots([]);
    }
    if (name === 'appointmentDate') {
      setFormData(prev => ({ ...prev, appointmentTime: '' }));
      setAvailableSlots([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const appointmentData = {
        ...formData,
        patientId: user.role === 'PATIENT' ? user.id : null,
        appointmentDateTime: `${formData.appointmentDate}T${formData.appointmentTime}`
      };

      await appointmentService.bookAppointment(appointmentData);
      setSuccess(true);
      setFormData({
        doctorId: '',
        departmentId: '',
        appointmentDate: '',
        appointmentTime: '',
        reason: '',
        notes: ''
      });
      
      if (onAppointmentBooked) {
        onAppointmentBooked();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
      </div>

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6">
          Appointment booked successfully! You will receive a confirmation email shortly.
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4" />
              <span>Department *</span>
            </label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Department</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4" />
              <span>Doctor *</span>
            </label>
            <select
              name="doctorId"
              value={formData.doctorId}
              onChange={handleInputChange}
              required
              disabled={!formData.departmentId}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>
                  Dr. {doctor.firstName} {doctor.lastName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Calendar className="w-4 h-4" />
              <span>Date *</span>
            </label>
            <input
              type="date"
              name="appointmentDate"
              value={formData.appointmentDate}
              onChange={handleInputChange}
              min={getTomorrowDate()}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              <span>Time *</span>
            </label>
            <select
              name="appointmentTime"
              value={formData.appointmentTime}
              onChange={handleInputChange}
              required
              disabled={!formData.appointmentDate || availableSlots.length === 0}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="">Select Time</option>
              {availableSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Reason for Visit *
          </label>
          <input
            type="text"
            name="reason"
            value={formData.reason}
            onChange={handleInputChange}
            required
            placeholder="Brief description of your concern"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
            placeholder="Any additional information you'd like to share"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
};

export default BookAppointment;
