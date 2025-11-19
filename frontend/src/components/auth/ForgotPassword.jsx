import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import Button from '../common/Button';
import Input from '../common/Input';
import { Mail, ArrowLeft, Stethoscope, AlertCircle, CheckCircle } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleInputChange = (value) => {
    setEmail(value);
    if (error) setError('');
  };

  const validateEmail = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateEmail()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
      setEmailSent(true);
    } catch (err) {
      setError(err.message || 'Failed to send reset email. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    setError('');

    try {
      await authService.forgotPassword(email);
      setSuccess(true);
    } catch (err) {
      setError(err.message || 'Failed to resend email. Please try again.');
    } finally {
      setLoading(false);
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
          <h2 className="text-3xl font-bold text-gray-900">Forgot Password</h2>
          <p className="mt-2 text-gray-600">
            {emailSent 
              ? 'Check your email for reset instructions'
              : 'Enter your email to receive password reset instructions'
            }
          </p>
        </div>

        {/* Form or Success Message */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {emailSent ? (
            <div className="text-center space-y-6">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Email Sent Successfully!
                </h3>
                <p className="text-gray-600 mb-4">
                  We've sent password reset instructions to:
                </p>
                <p className="font-medium text-gray-900 bg-gray-100 px-3 py-2 rounded">
                  {email}
                </p>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>Please check your email and follow the instructions to reset your password.</p>
                <p>If you don't see the email, check your spam folder.</p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  variant="outline"
                  loading={loading}
                  fullWidth
                >
                  {loading ? 'Resending...' : 'Resend Email'}
                </Button>

                <Link to="/login">
                  <Button variant="primary" fullWidth>
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Enter your registered email"
                leftIcon={<Mail className="h-4 w-4 text-gray-400" />}
                error={error}
                required
                autoComplete="email"
                autoFocus
              />

              <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p>
                  <strong>Note:</strong> You will receive an email with instructions to reset your password. 
                  The reset link will be valid for 24 hours.
                </p>
              </div>

              {/* Error Message */}
              {error && !email && (
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
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </Button>
            </form>
          )}

          {/* Back to Login */}
          {!emailSent && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                to="/login"
                className="flex items-center justify-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </div>
          )}
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

export default ForgotPassword;
