import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import { Eye, EyeOff, Lock, Mail, AlertCircle, Stethoscope } from 'lucide-react';

const Login = () => {
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    identifier: '', // Can be email or username
    password: '',
    rememberMe: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    if (error) clearError();
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.identifier.trim()) {
      errors.identifier = 'Email or username is required';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ✅ UPDATED handleSubmit
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      console.log('🔵 Login: Submitting...');
      const response = await login(formData);
      
      console.log('🟢 Login: Success!');
      console.log('🟢 Login: Redirect path:', response.redirectPath);
      
      // ✅ Navigate to role-specific dashboard or default
      navigate(response.redirectPath || '/dashboard', { replace: true });
      
    } catch (err) {
      console.error('🔴 Login error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <Stethoscope className="h-8 w-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
          <p className="mt-2 text-gray-600">Sign in to your account</p>
        </div>

        {/* Success message from registration */}
        {location.state?.message && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{location.state.message}</span>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Username */}
            <Input
              label="Email or Username"
              type="text"
              value={formData.identifier}
              onChange={(e) => handleInputChange('identifier', e.target.value)}
              placeholder="Enter your email or username"
              leftIcon={<Mail className="h-4 w-4 text-gray-400" />}
              error={validationErrors.identifier}
              required
              autoFocus
              autoComplete="username"
            />

            {/* Password */}
            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                placeholder="Enter your password"
                leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
                error={validationErrors.password}
                required
                autoComplete="current-password"
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

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              fullWidth
              className="py-3"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Register Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500 focus:outline-none focus:underline"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>

        {/* Test Credentials Info */}
        {import.meta.env.DEV && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm">
            <p className="font-medium text-yellow-800 mb-2">Test Credentials:</p>
            <p className="text-yellow-700">Admin: admin@hospital.com / admin123</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
