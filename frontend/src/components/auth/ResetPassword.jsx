import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import Button from '../common/Button';
import Input from '../common/Input';
import { Lock, Eye, EyeOff, Stethoscope, AlertCircle, CheckCircle } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [tokenValid, setTokenValid] = useState(true);

  useEffect(() => {
    // Validate token on component mount
    if (!token || !email) {
      setTokenValid(false);
      setError('Invalid or missing reset token. Please request a new password reset.');
    }
  }, [token, email]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear general error
    if (error) setError('');
  };

  const validateForm = () => {
    const errors = {};
    
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
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.resetPassword({
        token,
        email,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      });
      
      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: 'Password reset successful! Please log in with your new password.' 
          }
        });
      }, 3000);
      
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again or request a new reset link.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link to="/forgot-password">
              <Button variant="primary" fullWidth>
                Request New Reset Link
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Password Reset Successful!</h2>
            <p className="text-gray-600 mb-4">
              Your password has been successfully reset. You will be redirected to the login page.
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-gray-600">Enter your new password</p>
          {email && (
            <p className="text-sm text-gray-500 mt-1">for {email}</p>
          )}
        </div>

        {/* Reset Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Input
                label="New Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your new password"
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
                label="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                placeholder="Confirm your new password"
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

            {/* Password Requirements */}
            <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="font-medium mb-2">Password Requirements:</p>
              <ul className="space-y-1 text-xs">
                <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className={`h-3 w-3 mr-1 ${formData.password.length >= 8 ? 'text-green-500' : 'text-gray-400'}`} />
                  At least 8 characters long
                </li>
                <li className={`flex items-center ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className={`h-3 w-3 mr-1 ${/(?=.*[a-z])/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} />
                  Contains lowercase letter
                </li>
                <li className={`flex items-center ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className={`h-3 w-3 mr-1 ${/(?=.*[A-Z])/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} />
                  Contains uppercase letter
                </li>
                <li className={`flex items-center ${/(?=.*\d)/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                  <CheckCircle className={`h-3 w-3 mr-1 ${/(?=.*\d)/.test(formData.password) ? 'text-green-500' : 'text-gray-400'}`} />
                  Contains number
                </li>
              </ul>
            </div>

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
              {loading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </form>

          {/* Back to Login */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <Link
              to="/login"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              Back to Login
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            © 2025 Hospital Management System. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
