import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import { Eye, EyeOff, User, Mail, Lock, Phone, Stethoscope, AlertCircle, CheckCircle, Info } from 'lucide-react';


const Register = () => {
  const { register, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    role: 'PATIENT', // ✅ Fixed: Always PATIENT
    dateOfBirth: '',
    gender: '',
    agreeToTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);


  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear general error
    if (error) clearError();
  };


  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
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
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.dateOfBirth) {
      errors.dateOfBirth = 'Date of birth is required';
    }
    
    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }
    
    if (!formData.agreeToTerms) {
      errors.agreeToTerms = 'You must agree to the terms and conditions';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }


    try {
      const registrationData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: formData.phoneNumber.trim(),
        password: formData.password,
        role: 'PATIENT', // ✅ Fixed: Force PATIENT role
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender
      };
      
      await register(registrationData);
      setRegistrationSuccess(true);
      
      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Registration successful! Please log in with your credentials.' 
          }
        });
      }, 2000);
      
    } catch (err) {
      console.error('Registration failed:', err);
      // Error is handled by AuthContext
    }
  };


  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your patient account has been created successfully. You will be redirected to the login page shortly.
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Patient Registration</h2>
          <p className="mt-2 text-gray-600">Create your patient account</p>
        </div>


        {/* ✅ Info Banner for Staff */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-blue-900">Hospital Staff Registration</p>
              <p className="text-sm text-blue-700 mt-1">
                Are you a doctor, nurse, or hospital staff member? Staff accounts are created by administrators only. 
                Please contact your hospital administrator to get your credentials.
              </p>
            </div>
          </div>
        </div>


        {/* Registration Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  placeholder="Enter your first name"
                  leftIcon={<User className="h-4 w-4 text-gray-400" />}
                  error={validationErrors.firstName}
                  required
                />


                <Input
                  label="Last Name"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  placeholder="Enter your last name"
                  leftIcon={<User className="h-4 w-4 text-gray-400" />}
                  error={validationErrors.lastName}
                  required
                />
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <Input
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                  error={validationErrors.dateOfBirth}
                  required
                />


                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender <span className="text-red-500">*</span>
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
            </div>


            {/* Contact Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Information</h3>
              
              <Input
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Enter your email"
                leftIcon={<Mail className="h-4 w-4 text-gray-400" />}
                error={validationErrors.email}
                required
                autoComplete="email"
              />


              <Input
                label="Phone Number"
                type="tel"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                placeholder="Enter your phone number"
                leftIcon={<Phone className="h-4 w-4 text-gray-400" />}
                error={validationErrors.phoneNumber}
                required
              />
            </div>


            {/* Account Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
              
              {/* ✅ Removed Role Selection - Always PATIENT */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Account Type:</span> Patient
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  You are registering as a patient. This will give you access to book appointments, view medical records, and manage your health information.
                </p>
              </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Create a password"
                    leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
                    error={validationErrors.password}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>


                <div className="relative">
                  <Input
                    label="Confirm Password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
                    error={validationErrors.confirmPassword}
                    required
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 focus:outline-none"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>


              <p className="text-xs text-gray-500 mt-2">
                Password must be at least 8 characters and contain uppercase, lowercase, and numbers.
              </p>
            </div>


            {/* Terms and Conditions */}
            <div className="flex items-start">
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1"
              />
              <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link to="/terms" className="text-blue-600 hover:text-blue-500 underline">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-blue-600 hover:text-blue-500 underline">
                  Privacy Policy
                </Link>
                <span className="text-red-500 ml-1">*</span>
              </label>
            </div>
            {validationErrors.agreeToTerms && (
              <p className="text-red-600 text-xs flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" />
                {validationErrors.agreeToTerms}
              </p>
            )}


            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}


            <Button
              type="submit"
              variant="primary"
              loading={loading}
              fullWidth
              className="py-3"
            >
              {loading ? 'Creating Account...' : 'Create Patient Account'}
            </Button>
          </form>


          {/* Login Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


export default Register;
