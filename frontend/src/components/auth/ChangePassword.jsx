import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import Button from '../common/Button';
import Input from '../common/Input';
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

const ChangePassword = ({ onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

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
    
    if (!formData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      errors.newPassword = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (formData.currentPassword === formData.newPassword) {
      errors.newPassword = 'New password must be different from current password';
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
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
      await authService.changePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword
      });
      
      setSuccess(true);
      
      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 2000);
      }
      
    } catch (err) {
      setError(err.message || 'Failed to change password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Password Changed Successfully!
        </h3>
        <p className="text-gray-600">
          Your password has been updated successfully.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
        <p className="text-gray-600">Update your account password</p>
        {user && (
          <p className="text-sm text-gray-500 mt-1">for {user.email}</p>
        )}
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Input
            label="Current Password"
            type={showCurrentPassword ? 'text' : 'password'}
            value={formData.currentPassword}
            onChange={(e) => handleInputChange('currentPassword', e.target.value)}
            placeholder="Enter your current password"
            leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
            error={validationErrors.currentPassword}
            required
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
          >
            {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="New Password"
            type={showNewPassword ? 'text' : 'password'}
            value={formData.newPassword}
            onChange={(e) => handleInputChange('newPassword', e.target.value)}
            placeholder="Enter your new password"
            leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
            error={validationErrors.newPassword}
            required
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 focus:outline-none"
            tabIndex={-1}
          >
            {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
        {formData.newPassword && (
          <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="font-medium mb-2">Password Requirements:</p>
            <ul className="space-y-1 text-xs">
              <li className={`flex items-center ${formData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                <CheckCircle className={`h-3 w-3 mr-1 ${formData.newPassword.length >= 8 ? 'text-green-500' : 'text-gray-400'}`} />
                At least 8 characters long
              </li>
              <li className={`flex items-center ${/(?=.*[a-z])/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                <CheckCircle className={`h-3 w-3 mr-1 ${/(?=.*[a-z])/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-400'}`} />
                Contains lowercase letter
              </li>
              <li className={`flex items-center ${/(?=.*[A-Z])/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                <CheckCircle className={`h-3 w-3 mr-1 ${/(?=.*[A-Z])/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-400'}`} />
                Contains uppercase letter
              </li>
              <li className={`flex items-center ${/(?=.*\d)/.test(formData.newPassword) ? 'text-green-600' : 'text-gray-500'}`}>
                <CheckCircle className={`h-3 w-3 mr-1 ${/(?=.*\d)/.test(formData.newPassword) ? 'text-green-500' : 'text-gray-400'}`} />
                Contains number
              </li>
            </ul>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex space-x-3 pt-4">
          {onClose && (
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              fullWidth
            >
              Cancel
            </Button>
          )}
          
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            fullWidth
          >
            {loading ? 'Changing...' : 'Change Password'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;
