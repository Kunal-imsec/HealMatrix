import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import { departmentService } from '../../services/departmentService';
import Button from '../common/Button';
import Input from '../common/Input';
import DatePicker from '../common/DatePicker';
import FileUpload from '../common/FileUpload';
import { AlertCircle, CheckCircle, User, Save, Stethoscope } from 'lucide-react';

const EditDoctor = ({ doctorId, onSuccess, onCancel }) => {
  const [doctor, setDoctor] = useState(null);
  const [formData, setFormData] = useState({});
  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  const weekDays = [
    { id: 'MONDAY', label: 'Monday' },
    { id: 'TUESDAY', label: 'Tuesday' },
    { id: 'WEDNESDAY', label: 'Wednesday' },
    { id: 'THURSDAY', label: 'Thursday' },
    { id: 'FRIDAY', label: 'Friday' },
    { id: 'SATURDAY', label: 'Saturday' },
    { id: 'SUNDAY', label: 'Sunday' }
  ];

  useEffect(() => {
    fetchDoctor();
    fetchDepartments();
    fetchSpecializations();
  }, [doctorId]);

  const fetchDoctor = async () => {
    try {
      const response = await doctorService.getDoctorById(doctorId);
      setDoctor(response);
      setFormData({
        ...response,
        workingDays: response.workingDays || []
      });
    } catch (err) {
      setError('Failed to fetch doctor details');
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments();
      setDepartments(response);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const mockSpecializations = [
        'Cardiology', 'Dermatology', 'Emergency Medicine', 'Endocrinology',
        'Gastroenterology', 'General Practice', 'Geriatrics', 'Gynecology',
        'Internal Medicine', 'Nephrology', 'Neurology', 'Oncology',
        'Ophthalmology', 'Orthopedics', 'Otolaryngology', 'Pediatrics',
        'Psychiatry', 'Pulmonology', 'Radiology', 'Surgery', 'Urology'
      ];
      setSpecializations(mockSpecializations.map(spec => ({ id: spec, name: spec })));
    } catch (err) {
      console.error('Error fetching specializations:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (error) setError('');
  };

  const handleWorkingDaysChange = (dayId, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        workingDays: [...(prev.workingDays || []), dayId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        workingDays: (prev.workingDays || []).filter(day => day !== dayId)
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName?.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName?.trim()) errors.lastName = 'Last name is required';
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.phoneNumber) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setError('');

    try {
      await doctorService.updateDoctor(doctorId, formData);
      
      if (profilePhoto.length > 0) {
        try {
          await doctorService.uploadDoctorPhoto(doctorId, profilePhoto[0]);
        } catch (photoErr) {
          console.error('Error uploading photo:', photoErr);
        }
      }

      setSuccess(true);
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update doctor');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
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

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Doctor Profile Updated Successfully!
        </h3>
        <p className="text-gray-600">
          The doctor information has been updated.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'professional', label: 'Professional', icon: Stethoscope },
    { id: 'schedule', label: 'Schedule', icon: User }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Edit Doctor</h3>
            <p className="text-gray-600">Update doctor information</p>
          </div>
          
          {doctor && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Employee ID</p>
              <p className="font-mono text-lg font-semibold text-gray-900">
                {doctor.employeeId}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div className="flex justify-center">
                <FileUpload
                  variant="avatar"
                  accept="image/*"
                  files={profilePhoto}
                  onFileSelect={(files) => setProfilePhoto(Array.isArray(files) ? files : [files])}
                  onFileRemove={() => setProfilePhoto([])}
                  label="Update Photo"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name *"
                  value={formData.firstName || ''}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  error={validationErrors.firstName}
                  required
                />

                <Input
                  label="Last Name *"
                  value={formData.lastName || ''}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  error={validationErrors.lastName}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DatePicker
                  label="Date of Birth"
                  value={formData.dateOfBirth}
                  onChange={(date) => handleInputChange('dateOfBirth', date)}
                  maxDate={new Date()}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender
                  </label>
                  <select
                    value={formData.gender || ''}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email Address *"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={validationErrors.email}
                  required
                />

                <Input
                  label="Phone Number *"
                  type="tel"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  error={validationErrors.phoneNumber}
                  required
                />
              </div>

              <Input
                label="Alternate Phone Number"
                type="tel"
                value={formData.alternatePhone || ''}
                onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
              />

              <Input
                label="Address"
                value={formData.address || ''}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="City"
                  value={formData.city || ''}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                />

                <Input
                  label="State"
                  value={formData.state || ''}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                />

                <Input
                  label="ZIP Code"
                  value={formData.zipCode || ''}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Professional Information Tab */}
          {activeTab === 'professional' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Employee ID"
                  value={formData.employeeId || ''}
                  onChange={(e) => handleInputChange('employeeId', e.target.value)}
                  disabled
                />

                <Input
                  label="Medical License Number"
                  value={formData.medicalLicenseNumber || ''}
                  onChange={(e) => handleInputChange('medicalLicenseNumber', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={formData.departmentId || ''}
                    onChange={(e) => handleInputChange('departmentId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Specialization
                  </label>
                  <select
                    value={formData.specialization || ''}
                    onChange={(e) => handleInputChange('specialization', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select specialization</option>
                    {specializations.map(spec => (
                      <option key={spec.id} value={spec.id}>{spec.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Sub-Specialization"
                value={formData.subSpecialization || ''}
                onChange={(e) => handleInputChange('subSpecialization', e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Years of Experience"
                  type="number"
                  value={formData.experience || ''}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                />

                <Input
                  label="Qualification"
                  value={formData.qualification || ''}
                  onChange={(e) => handleInputChange('qualification', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Consultation Fee"
                  type="number"
                  value={formData.consultationFee || ''}
                  onChange={(e) => handleInputChange('consultationFee', e.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employment Type
                  </label>
                  <select
                    value={formData.employmentType || 'FULL_TIME'}
                    onChange={(e) => handleInputChange('employmentType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="CONSULTANT">Consultant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Board Certifications
                </label>
                <textarea
                  value={formData.boardCertifications || ''}
                  onChange={(e) => handleInputChange('boardCertifications', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <Input
                label="Languages Spoken"
                value={formData.languages || ''}
                onChange={(e) => handleInputChange('languages', e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biography
                </label>
                <textarea
                  value={formData.biography || ''}
                  onChange={(e) => handleInputChange('biography', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Working Days
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {weekDays.map(day => (
                    <label key={day.id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={(formData.workingDays || []).includes(day.id)}
                        onChange={(e) => handleWorkingDaysChange(day.id, e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{day.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Start Time"
                  type="time"
                  value={formData.startTime || '09:00'}
                  onChange={(e) => handleInputChange('startTime', e.target.value)}
                />

                <Input
                  label="End Time"
                  type="time"
                  value={formData.endTime || '17:00'}
                  onChange={(e) => handleInputChange('endTime', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Break Start Time"
                  type="time"
                  value={formData.breakStartTime || '12:00'}
                  onChange={(e) => handleInputChange('breakStartTime', e.target.value)}
                />

                <Input
                  label="Break End Time"
                  type="time"
                  value={formData.breakEndTime || '13:00'}
                  onChange={(e) => handleInputChange('breakEndTime', e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Consultation Duration (minutes)
                </label>
                <select
                  value={formData.consultationDuration || 30}
                  onChange={(e) => handleInputChange('consultationDuration', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
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
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditDoctor;
