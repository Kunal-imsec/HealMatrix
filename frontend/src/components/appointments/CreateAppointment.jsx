import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import { patientService } from '../../services/patientService';
import { doctorService } from '../../services/doctorService';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import TimeSlotPicker from './TimeSlotPicker';
import { 
  Calendar, 
  User, 
  Clock, 
  FileText, 
  Search,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const CreateAppointment = ({ onSuccess, onCancel, preselectedPatient = null }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Patient, 2: Doctor, 3: DateTime, 4: Details
  const [formData, setFormData] = useState({
    patientId: preselectedPatient?.id || '',
    patientName: preselectedPatient?.name || '',
    doctorId: '',
    doctorName: '',
    date: '',
    timeSlot: '',
    appointmentType: 'CONSULTATION',
    priority: 'NORMAL',
    reason: '',
    notes: '',
    duration: 30
  });

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  const [doctorSearchTerm, setDoctorSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (step === 1 && !preselectedPatient) {
      fetchPatients();
    }
    if (step === 2) {
      fetchDoctors();
    }
  }, [step, preselectedPatient]);

  useEffect(() => {
    if (formData.doctorId && formData.date) {
      fetchAvailableSlots();
    }
  }, [formData.doctorId, formData.date]);

  const fetchPatients = async () => {
    try {
      const response = await patientService.searchPatients(patientSearchTerm);
      setPatients(response);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await doctorService.getAllDoctors({ search: doctorSearchTerm });
      setDoctors(response);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    }
  };

  const fetchAvailableSlots = async () => {
    try {
      const response = await appointmentService.getAvailableSlots(formData.doctorId, formData.date);
      setAvailableSlots(response);
    } catch (err) {
      console.error('Error fetching available slots:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handlePatientSelect = (patient) => {
    setFormData(prev => ({
      ...prev,
      patientId: patient.id,
      patientName: `${patient.firstName} ${patient.lastName}`
    }));
    setStep(2);
  };

  const handleDoctorSelect = (doctor) => {
    setFormData(prev => ({
      ...prev,
      doctorId: doctor.id,
      doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`
    }));
    setStep(3);
  };

  const handleTimeSlotSelect = (date, timeSlot) => {
    setFormData(prev => ({ ...prev, date, timeSlot }));
    setStep(4);
  };

  const validateForm = () => {
    if (!formData.patientId) {
      setError('Please select a patient');
      return false;
    }
    if (!formData.doctorId) {
      setError('Please select a doctor');
      return false;
    }
    if (!formData.date || !formData.timeSlot) {
      setError('Please select date and time');
      return false;
    }
    if (!formData.reason.trim()) {
      setError('Please provide reason for appointment');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const appointmentData = {
        ...formData,
        createdBy: user.id,
        status: 'SCHEDULED'
      };

      await appointmentService.createAppointment(appointmentData);
      setSuccess(true);
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create appointment');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Appointment Created Successfully!
        </h3>
        <p className="text-gray-600">
          The appointment has been scheduled and confirmation notifications will be sent.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step >= stepNumber 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`
                  w-16 h-1 mx-2
                  ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>Patient</span>
          <span>Doctor</span>
          <span>Date & Time</span>
          <span>Details</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Step 1: Patient Selection */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <User className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Select Patient</h3>
              <p className="text-gray-600">Choose the patient for this appointment</p>
            </div>

            {!preselectedPatient && (
              <div>
                <Input
                  placeholder="Search patients by name or ID..."
                  value={patientSearchTerm}
                  onChange={(e) => setPatientSearchTerm(e.target.value)}
                  leftIcon={<Search className="h-4 w-4 text-gray-400" />}
                />
              </div>
            )}

            <div className="max-h-64 overflow-y-auto space-y-2">
              {(preselectedPatient ? [preselectedPatient] : patients).map((patient) => (
                <button
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient)}
                  className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-gray-500">ID: {patient.patientId}</p>
                      <p className="text-sm text-gray-500">Age: {patient.age} • {patient.gender}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{patient.email}</p>
                      <p className="text-sm text-gray-500">{patient.phoneNumber}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Doctor Selection */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <User className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Select Doctor</h3>
              <p className="text-gray-600">Choose the doctor for this appointment</p>
            </div>

            <Input
              placeholder="Search doctors by name or specialization..."
              value={doctorSearchTerm}
              onChange={(e) => setDoctorSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4 text-gray-400" />}
            />

            <div className="max-h-64 overflow-y-auto space-y-2">
              {doctors.map((doctor) => (
                <button
                  key={doctor.id}
                  onClick={() => handleDoctorSelect(doctor)}
                  className="w-full p-4 text-left border border-gray-200 rounded-lg hover:bg-green-50 hover:border-green-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        Dr. {doctor.firstName} {doctor.lastName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {doctor.specialization} • {doctor.department}
                      </p>
                      <p className="text-sm text-gray-500">
                        Experience: {doctor.experience} years
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-sm text-green-600">Available</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Date & Time Selection */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="mx-auto h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Select Date & Time</h3>
              <p className="text-gray-600">Choose available appointment slot</p>
            </div>

            <TimeSlotPicker
              doctorId={formData.doctorId}
              selectedDate={formData.date}
              selectedTimeSlot={formData.timeSlot}
              onTimeSlotSelect={handleTimeSlotSelect}
            />
          </div>
        )}

        {/* Step 4: Appointment Details */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-orange-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Appointment Details</h3>
              <p className="text-gray-600">Provide additional information</p>
            </div>

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
              placeholder="Brief description of the reason for this appointment"
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any additional information or special requirements"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected Duration (minutes)
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

            {/* Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Appointment Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Patient:</span>
                  <span className="font-medium">{formData.patientName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Doctor:</span>
                  <span className="font-medium">{formData.doctorName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{formData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{formData.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{formData.appointmentType}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <div>
          {step > 1 && (
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={loading}
            >
              Back
            </Button>
          )}
        </div>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>

          {step === 4 ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
            >
              Create Appointment
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !formData.patientId) ||
                (step === 2 && !formData.doctorId) ||
                (step === 3 && (!formData.date || !formData.timeSlot))
              }
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateAppointment;
