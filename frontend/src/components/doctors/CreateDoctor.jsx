import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
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
  GraduationCap,
  Calendar,
  Shield,
  FileText,
  AlertCircle,
  CheckCircle,
  Stethoscope
} from 'lucide-react';

const CreateDoctor = ({ onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1: Basic Info, 2: Professional Info, 3: Schedule & Availability
  const [formData, setFormData] = useState({
    // Basic Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phoneNumber: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA',
    
    // Professional Information
    medicalLicenseNumber: '',
    specialization: '',
    subSpecialization: '',
    departmentId: '',
    experience: '',
    qualification: '',
    university: '',
    graduationYear: '',
    boardCertifications: '',
    
    // Employment Information
    employeeId: '',
    joinDate: '',
    employmentType: 'FULL_TIME', // FULL_TIME, PART_TIME, CONTRACT, CONSULTANT
    consultationFee: '',
    
    // Schedule Information
    workingDays: [],
    startTime: '09:00',
    endTime: '17:00',
    consultationDuration: 30,
    breakStartTime: '12:00',
    breakEndTime: '13:00',
    
    // Additional Information
    languages: '',
    awards: '',
    publications: '',
    researchInterests: '',
    biography: ''
  });

  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState([]);
  const [documents, setDocuments] = useState([]); // Medical license, certificates
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

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
    fetchDepartments();
    fetchSpecializations();
  }, []);

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
      // Mock specializations - replace with actual API call
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
    
    // Clear specific field error
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (error) setError('');
  };

  const handleWorkingDaysChange = (dayId, checked) => {
    if (checked) {
      setFormData(prev => ({
        ...prev,
        workingDays: [...prev.workingDays, dayId]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        workingDays: prev.workingDays.filter(day => day !== dayId)
      }));
    }
  };

  const validateStep = (stepNumber) => {
    const errors = {};
    
    switch (stepNumber) {
      case 1: // Basic Information
        if (!formData.firstName.trim()) errors.firstName = 'First name is required';
        if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
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
        if (!formData.dateOfBirth) errors.dateOfBirth = 'Date of birth is required';
        if (!formData.gender) errors.gender = 'Gender is required';
        break;
        
      case 2: // Professional Information
        if (!formData.medicalLicenseNumber.trim()) {
          errors.medicalLicenseNumber = 'Medical license number is required';
        }
        if (!formData.specialization) errors.specialization = 'Specialization is required';
        if (!formData.departmentId) errors.departmentId = 'Department is required';
        if (!formData.experience) errors.experience = 'Years of experience is required';
        if (!formData.qualification.trim()) errors.qualification = 'Qualification is required';
        if (!formData.employeeId.trim()) errors.employeeId = 'Employee ID is required';
        if (!formData.joinDate) errors.joinDate = 'Join date is required';
        break;
        
      case 3: // Schedule Information
        if (formData.workingDays.length === 0) {
          errors.workingDays = 'Please select at least one working day';
        }
        if (!formData.consultationFee) {
          errors.consultationFee = 'Consultation fee is required';
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
    if (!validateStep(3)) return;

    setLoading(true);
    setError('');

    try {
      const doctorData = {
        ...formData,
        createdBy: user.id,
        status: 'ACTIVE',
        registrationDate: new Date().toISOString()
      };

      // Create doctor
      const response = await doctorService.createDoctor(doctorData);
      
      // Upload profile photo if provided
      if (profilePhoto.length > 0) {
        try {
          await doctorService.uploadDoctorPhoto(response.id, profilePhoto[0]);
        } catch (photoErr) {
          console.error('Error uploading photo:', photoErr);
        }
      }

      // Upload documents if provided
      if (documents.length > 0) {
        try {
          await doctorService.uploadDoctorDocuments(response.id, documents);
        } catch (docErr) {
          console.error('Error uploading documents:', docErr);
        }
      }

      setSuccess(true);
      
      setTimeout(() => {
        onSuccess(response);
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to create doctor profile');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Doctor Profile Created Successfully!
        </h3>
        <p className="text-gray-600">
          The doctor has been registered and can now access the system.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((stepNumber) => (
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
              {stepNumber < 3 && (
                <div className={`
                  w-32 h-1 mx-2
                  ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'}
                `} />
              )}
            </div>
          ))}
        </div>
        
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>Basic Information</span>
          <span>Professional Details</span>
          <span>Schedule & Availability</span>
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
              <p className="text-gray-600">Enter the doctor's personal details</p>
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
              label="Address"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              leftIcon={<MapPin className="h-4 w-4 text-gray-400" />}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input
                label="City"
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
              />

              <Input
                label="State"
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
              />

              <Input
                label="ZIP Code"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
              />
            </div>
          </div>
        )}

        {/* Step 2: Professional Information */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <Stethoscope className="mx-auto h-12 w-12 text-green-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Professional Information</h3>
              <p className="text-gray-600">Enter medical credentials and qualifications</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Employee ID *"
                value={formData.employeeId}
                onChange={(e) => handleInputChange('employeeId', e.target.value)}
                error={validationErrors.employeeId}
                placeholder="EMP001"
                required
              />

              <Input
                label="Medical License Number *"
                value={formData.medicalLicenseNumber}
                onChange={(e) => handleInputChange('medicalLicenseNumber', e.target.value)}
                error={validationErrors.medicalLicenseNumber}
                leftIcon={<Shield className="h-4 w-4 text-gray-400" />}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department *
                </label>
                <select
                  value={formData.departmentId}
                  onChange={(e) => handleInputChange('departmentId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select department</option>
                  {departments.map(dept => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
                {validationErrors.departmentId && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {validationErrors.departmentId}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specialization *
                </label>
                <select
                  value={formData.specialization}
                  onChange={(e) => handleInputChange('specialization', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select specialization</option>
                  {specializations.map(spec => (
                    <option key={spec.id} value={spec.id}>{spec.name}</option>
                  ))}
                </select>
                {validationErrors.specialization && (
                  <p className="text-red-600 text-xs mt-1 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {validationErrors.specialization}
                  </p>
                )}
              </div>
            </div>

            <Input
              label="Sub-Specialization"
              value={formData.subSpecialization}
              onChange={(e) => handleInputChange('subSpecialization', e.target.value)}
              placeholder="e.g., Interventional Cardiology"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Years of Experience *"
                type="number"
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                error={validationErrors.experience}
                required
              />

              <Input
                label="Qualification *"
                value={formData.qualification}
                onChange={(e) => handleInputChange('qualification', e.target.value)}
                placeholder="e.g., MBBS, MD"
                error={validationErrors.qualification}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="University/Medical School"
                value={formData.university}
                onChange={(e) => handleInputChange('university', e.target.value)}
                leftIcon={<GraduationCap className="h-4 w-4 text-gray-400" />}
              />

              <Input
                label="Graduation Year"
                type="number"
                value={formData.graduationYear}
                onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                placeholder="YYYY"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DatePicker
                label="Join Date *"
                value={formData.joinDate}
                onChange={(date) => handleInputChange('joinDate', date)}
                error={validationErrors.joinDate}
                required
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employment Type
                </label>
                <select
                  value={formData.employmentType}
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
                value={formData.boardCertifications}
                onChange={(e) => handleInputChange('boardCertifications', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="List any board certifications, fellowships, or additional qualifications"
              />
            </div>

            <Input
              label="Languages Spoken"
              value={formData.languages}
              onChange={(e) => handleInputChange('languages', e.target.value)}
              placeholder="e.g., English, Spanish, French"
            />

            {/* Document Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Documents (License, Certificates)
              </label>
              <FileUpload
                accept=".pdf,.jpg,.jpeg,.png"
                multiple={true}
                files={documents}
                onFileSelect={setDocuments}
                onFileRemove={(index) => setDocuments(prev => prev.filter((_, i) => i !== index))}
                maxFiles={5}
              />
            </div>
          </div>
        )}

        {/* Step 3: Schedule & Availability */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <Calendar className="mx-auto h-12 w-12 text-purple-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">Schedule & Availability</h3>
              <p className="text-gray-600">Set working hours and consultation details</p>
            </div>

            <Input
              label="Consultation Fee *"
              type="number"
              value={formData.consultationFee}
              onChange={(e) => handleInputChange('consultationFee', e.target.value)}
              error={validationErrors.consultationFee}
              placeholder="100"
              leftIcon={<span className="text-gray-400">$</span>}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Working Days *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weekDays.map(day => (
                  <label key={day.id} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.workingDays.includes(day.id)}
                      onChange={(e) => handleWorkingDaysChange(day.id, e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{day.label}</span>
                  </label>
                ))}
              </div>
              {validationErrors.workingDays && (
                <p className="text-red-600 text-xs mt-1 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {validationErrors.workingDays}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Time"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
              />

              <Input
                label="End Time"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Break Start Time"
                type="time"
                value={formData.breakStartTime}
                onChange={(e) => handleInputChange('breakStartTime', e.target.value)}
              />

              <Input
                label="Break End Time"
                type="time"
                value={formData.breakEndTime}
                onChange={(e) => handleInputChange('breakEndTime', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consultation Duration (minutes)
              </label>
              <select
                value={formData.consultationDuration}
                onChange={(e) => handleInputChange('consultationDuration', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>1 hour</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Biography
              </label>
              <textarea
                value={formData.biography}
                onChange={(e) => handleInputChange('biography', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Brief professional biography and areas of expertise"
              />
            </div>

            {/* Registration Summary */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">Registration Summary</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Doctor Name:</span>
                  <span className="font-medium">Dr. {formData.firstName} {formData.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Specialization:</span>
                  <span className="font-medium">{formData.specialization || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Department:</span>
                  <span className="font-medium">
                    {departments.find(d => d.id === formData.departmentId)?.name || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Experience:</span>
                  <span className="font-medium">{formData.experience || 'N/A'} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Consultation Fee:</span>
                  <span className="font-medium">${formData.consultationFee || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Working Days:</span>
                  <span className="font-medium">{formData.workingDays.length} days/week</span>
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

          {step === 3 ? (
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
            >
              Create Doctor Profile
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

export default CreateDoctor;
