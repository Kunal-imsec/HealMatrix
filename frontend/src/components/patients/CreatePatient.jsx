import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { patientService } from '../../services/patientService';
import { departmentService } from '../../services/departmentService';
import Button from '../common/Button';
import Input from '../common/Input';
import FileUpload from '../common/FileUpload';
import DatePicker from '../common/DatePicker';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle,
  Camera
} from 'lucide-react';

const CreatePatient = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Contact Info, 3: Medical Info, 4: Emergency Contact
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    maritalStatus: '',
    
    // Contact Information
    email: '',
    phoneNumber: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    
    // Medical Information
    allergies: '',
    medicalHistory: '',
    currentMedications: '',
    insuranceProvider: '',
    insuranceNumber: '',
    primaryDoctorId: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelation: '',
    emergencyContactPhone: '',
    emergencyContactAddress: ''
  });

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    fetchDepartments();
    fetchDoctors();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await departmentService.getAllDepartments();
      setDepartments(response);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await patientService.getDepartments(); // This should fetch available doctors
      setDoctors(response);
    } catch (err) {
      console.error('Error fetching doctors:', err);
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

  const validateStep = (stepNumber) => {
    const errors = {};
    
    switch (stepNumber) {
      case 1: // Basic Information
        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
        if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) errors.gender = 'Gender is required';
        if (!formData.bloodGroup) errors.bloodGroup = 'Blood group is required';
        break;
        
      case 2: // Contact Information
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
        if (!formData.address.trim()) errors.address = 'Address is required';
        if (!formData.city.trim()) errors.city = 'City is required';
        if (!formData.state.trim()) errors.state = 'State is required';
        if (!formData.zipCode.trim()) errors.zipCode = 'ZIP code is required';
        break;
        
      case 4: // Emergency Contact
        if (!formData.emergencyContactName.trim()) {
          errors.emergencyContactName = 'Emergency contact name is required';
        }
        if (!formData.emergencyContactRelation.trim()) {
          errors.emergencyContactRelation = 'Relationship is required';
        }
        if (!formData.emergencyContactPhone.trim()) {
          errors.emergencyContactPhone = 'Emergency contact phone is required';
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) return;

    setLoading(true);
    setError('');

    try {
      const patientData = {
        ...formData,
        registeredBy: user.id,
        registrationDate: new Date().toISOString()
      };

      // Create patient
      const response = await patientService.createPatient(patientData);
      
      // Upload profile photo if provided
      if (profilePhoto.length > 0) {
        try {
          await patientService.uploadPatientPhoto(response.id, profilePhoto[0]);
        } catch (photoErr) {
          console.error('Error uploading photo:', photoErr);
          // Don't fail the entire registration for photo upload error
        }
      }

      setSuccess(true);
      
      setTimeout(() => {
        onSuccess(response);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create patient record');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Patient Registered Successfully!
        </h3>
        <p className="text-gray-600">
          The patient record has been created and a patient ID has been assigned.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
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
                  w-24 h-1 mx-2
                  ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>Basic Info</span>
          <span>Contact Info</span>
          <span>Medical Info</span>
          <span>Emergency Contact</span>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <User className="mx-auto h-12 w-12 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              <p className="text-gray-600">Enter the patient's basic details</p>
            </div>

            {/* Profile Photo Upload */}
            <div className="flex justify-center">
              <FileUpload
                variant="avatar"
                accept="image/*"
                files={profilePhoto}
                onFileSelect={(files) => setProfilePhoto(Array.isArray(files) ? files : [files])}
                onFileRemove={() => setProfilePhoto([])}
                label="Upload Photo"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name *"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                error={validationErrors.firstName}
                required
              />

              <Input
                label="Last Name *"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                error={validationErrors.lastName}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DatePicker
                label="Date of Birth *"
                value={formData.dateOfBirth}
                onChange={(date) => handleInputChange('dateOfBirth', date)}
                error={validationErrors.dateOfBirth}
                maxDate={new Date()}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender *
                </label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select gender</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </select>
                {validationErrors.gender && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {validationErrors.gender}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group *
                </label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => handleInputChange('bloodGroup', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
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
                {validationErrors.bloodGroup && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {validationErrors.bloodGroup}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Marital Status
                </label>
                <select
                  value={formData.maritalStatus}
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

        {/* Step 2: Contact Information */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <Phone className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
              <p className="text-gray-600">Enter contact details and address</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email Address *"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                leftIcon={<Mail className="h-4 w-4 text-gray-400" />}
                error={validationErrors.email}
                required
              />

              <Input
                label="Phone Number *"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                leftIcon={<Phone className="h-4 w-4 text-gray-400" />}
                error={validationErrors.phoneNumber}
                required
              />
            </div>

            <Input
              label="Alternate Phone Number"
              type="tel"
              value={formData.alternatePhone}
              onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
              leftIcon={<Phone className="h-4 w-4 text-gray-400" />}
            />

            <Input
              label="Address *"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              leftIcon={<MapPin className="h-4 w-4 text-gray-400" />}
              error={validationErrors.address}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City *"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                error={validationErrors.city}
                required
              />

              <Input
                label="State *"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                error={validationErrors.state}
                required
              />

              <Input
                label="ZIP Code *"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                error={validationErrors.zipCode}
                required
              />
            </div>

            <Input
              label="Country"
              value={formData.country}
              onChange={(e) => handleInputChange('country', e.target.value)}
            />
          </div>
        )}

        {/* Step 3: Medical Information */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <FileText className="mx-auto h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Medical Information</h3>
              <p className="text-gray-600">Enter medical history and insurance details</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Known Allergies
              </label>
              <textarea
                value={formData.allergies}
                onChange={(e) => handleInputChange('allergies', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List any known allergies (medications, food, environmental, etc.)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medical History
              </label>
              <textarea
                value={formData.medicalHistory}
                onChange={(e) => handleInputChange('medicalHistory', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Previous surgeries, chronic conditions, family history, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Medications
              </label>
              <textarea
                value={formData.currentMedications}
                onChange={(e) => handleInputChange('currentMedications', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List current medications with dosages"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Insurance Provider"
                value={formData.insuranceProvider}
                onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
                leftIcon={<Shield className="h-4 w-4 text-gray-400" />}
              />

              <Input
                label="Insurance Number"
                value={formData.insuranceNumber}
                onChange={(e) => handleInputChange('insuranceNumber', e.target.value)}
                leftIcon={<Shield className="h-4 w-4 text-gray-400" />}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Doctor (Optional)
              </label>
              <select
                value={formData.primaryDoctorId}
                onChange={(e) => handleInputChange('primaryDoctorId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select primary doctor</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 4: Emergency Contact */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <Phone className="mx-auto h-12 w-12 text-red-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
              <p className="text-gray-600">Person to contact in case of emergency</p>
            </div>

            <Input
              label="Emergency Contact Name *"
              value={formData.emergencyContactName}
              onChange={(e) => handleInputChange('emergencyContactName', e.target.value)}
              leftIcon={<User className="h-4 w-4 text-gray-400" />}
              error={validationErrors.emergencyContactName}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Relationship *"
                value={formData.emergencyContactRelation}
                onChange={(e) => handleInputChange('emergencyContactRelation', e.target.value)}
                error={validationErrors.emergencyContactRelation}
                placeholder="e.g., Spouse, Parent, Sibling"
                required
              />

              <Input
                label="Phone Number *"
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={(e) => handleInputChange('emergencyContactPhone', e.target.value)}
                leftIcon={<Phone className="h-4 w-4 text-gray-400" />}
                error={validationErrors.emergencyContactPhone}
                required
              />
            </div>

            <Input
              label="Emergency Contact Address"
              value={formData.emergencyContactAddress}
              onChange={(e) => handleInputChange('emergencyContactAddress', e.target.value)}
              leftIcon={<MapPin className="h-4 w-4 text-gray-400" />}
            />

            {/* Registration Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Registration Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Patient Name:</span>
                  <span className="font-medium">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date of Birth:</span>
                  <span className="font-medium">
                    {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender:</span>
                  <span className="font-medium">{formData.gender || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Blood Group:</span>
                  <span className="font-medium">{formData.bloodGroup || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{formData.phoneNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{formData.email}</span>
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
              Register Patient
            </Button>
          ) : (
            <Button
              variant="primary"
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePatient;
