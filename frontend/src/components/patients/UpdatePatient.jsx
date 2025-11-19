import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import Button from '../common/Button';
import Input from '../common/Input';
import DatePicker from '../common/DatePicker';
import FileUpload from '../common/FileUpload';
import { AlertCircle, CheckCircle, User, Save } from 'lucide-react';

const EditPatient = ({ patientId, onSuccess, onCancel }) => {
  const [patient, setPatient] = useState(null);
  const [formData, setFormData] = useState({});
  const [profilePhoto, setProfilePhoto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  useEffect(() => {
    fetchPatient();
  }, [patientId]);

  const fetchPatient = async () => {
    try {
      const response = await patientService.getPatientById(patientId);
      setPatient(response);
      setFormData(response);
    } catch (err) {
      setError('Failed to fetch patient details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (error) setError('');
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
      await patientService.updatePatient(patientId, formData);
      
      // Upload profile photo if provided
      if (profilePhoto.length > 0) {
        try {
          await patientService.uploadPatientPhoto(patientId, profilePhoto[0]);
        } catch (photoErr) {
          console.error('Error uploading photo:', photoErr);
        }
      }

      setSuccess(true);
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update patient');
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
          Patient Updated Successfully!
        </h3>
        <p className="text-gray-600">
          The patient information has been updated.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: User },
    { id: 'contact', label: 'Contact Info', icon: User },
    { id: 'medical', label: 'Medical Info', icon: User },
    { id: 'emergency', label: 'Emergency Contact', icon: User }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Edit Patient</h3>
            <p className="text-gray-600">Update patient information</p>
          </div>
          
          {patient && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Patient ID</p>
              <p className="font-mono text-lg font-semibold text-gray-900">
                {patient.patientId}
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup || ''}
                    onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Marital Status
                  </label>
                  <select
                    value={formData.maritalStatus || ''}
                    onChange={(e) => handleInputChange('maritalStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select status</option>
                    <option value="SINGLE">Single</option>
                    <option value="MARRIED">Married</option>
                    <option value="DIVORCED">Divorced</option>
                    <option value="WIDOWED">Widowed</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Contact Information Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
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

              <Input
                label="Country"
                value={formData.country || ''}
                onChange={(e) => handleInputChange('country', e.target.value)}
              />
            </div>
          )}

          {/* Medical Information Tab */}
          {activeTab === 'medical' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Known Allergies
                </label>
                <textarea
                  value={formData.allergies || ''}
                  onChange={(e) => handleInputChange('allergies', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="List any known allergies"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Medical History
                </label>
                <textarea
                  value={formData.medicalHistory || ''}
                  onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Previous surgeries, chronic conditions, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Medications
                </label>
                <textarea
                  value={formData.currentMedications || ''}
                  onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="List current medications with dosages"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Insurance Provider"
                  value={formData.insuranceProvider || ''}
                  onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                />

                <Input
                  label="Insurance Number"
                  value={formData.insuranceNumber || ''}
                  onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Emergency Contact Tab */}
          {activeTab === 'emergency' && (
            <div className="space-y-6">
              <Input
                label="Emergency Contact Name"
                value={formData.emergencyContactName || ''}
                onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Relationship"
                  value={formData.emergencyContactRelation || ''}
                  onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                  placeholder="e.g., Spouse, Parent, Sibling"
                />

                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.emergencyContactPhone || ''}
                  onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                />
              </div>

              <Input
                label="Emergency Contact Address"
                value={formData.emergencyContactAddress || ''}
                onChange={(e) => handleInputChange('emergencyContactAddress', e.target.value)}
              />
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

export default updatePatient;
