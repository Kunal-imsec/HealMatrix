import React, { useState, useEffect } from 'react';
import settingsService from '../../services/settingsService';
import Button from '../common/Button';
import Input from '../common/Input';
import { 
  Settings, 
  Save, 
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Globe,
  Calendar,
  DollarSign,
  Mail,
  Database,
  Shield
} from 'lucide-react';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    hospitalName: '',
    hospitalAddress: '',
    hospitalPhone: '',
    hospitalEmail: '',
    hospitalWebsite: '',
    timezone: 'America/New_York',
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12',
    currency: 'USD',
    language: 'en',

    // Appointment Settings
    appointmentDuration: 30,
    maxAppointmentsPerDay: 50,
    allowOnlineBooking: true,
    requireAppointmentApproval: false,
    sendAppointmentReminders: true,
    reminderTimeBefore: 24,

    // Billing Settings
    taxRate: 0,
    lateFeePercentage: 0,
    paymentGracePeriod: 30,
    allowPartialPayments: true,
    requireInsuranceVerification: true,

    // Email Settings
    smtpHost: '',
    smtpPort: 587,
    smtpUsername: '',
    smtpPassword: '',
    smtpEncryption: 'TLS',
    fromEmail: '',
    fromName: '',

    // System Settings
    maintenanceMode: false,
    allowRegistration: true,
    requireEmailVerification: true,
    sessionTimeout: 60,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    passwordRequireSpecialChar: true,
    passwordExpiryDays: 90
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsService.getSystemSettings();
      setSettings(prev => ({ ...prev, ...response }));
    } catch (err) {
      setError('Failed to fetch system settings');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await settingsService.updateSystemSettings(settings);
      setSuccess('Settings saved successfully');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset to default settings?')) {
      fetchSettings();
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'billing', label: 'Billing', icon: DollarSign },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Security', icon: Shield }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Settings className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">System Settings</h3>
              <p className="text-gray-600">Configure system-wide settings</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleReset}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Reset
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
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

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
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Hospital Name"
                  value={settings.hospitalName}
                  onChange={(e) => handleInputChange('hospitalName', e.target.value)}
                />

                <Input
                  label="Phone Number"
                  value={settings.hospitalPhone}
                  onChange={(e) => handleInputChange('hospitalPhone', e.target.value)}
                />
              </div>

              <Input
                label="Address"
                value={settings.hospitalAddress}
                onChange={(e) => handleInputChange('hospitalAddress', e.target.value)}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Email"
                  type="email"
                  value={settings.hospitalEmail}
                  onChange={(e) => handleInputChange('hospitalEmail', e.target.value)}
                />

                <Input
                  label="Website"
                  value={settings.hospitalWebsite}
                  onChange={(e) => handleInputChange('hospitalWebsite', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={settings.timezone}
                    onChange={(e) => handleInputChange('timezone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="America/New_York">Eastern Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/Denver">Mountain Time</option>
                    <option value="America/Los_Angeles">Pacific Time</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <select
                    value={settings.dateFormat}
                    onChange={(e) => handleInputChange('dateFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Format
                  </label>
                  <select
                    value={settings.timeFormat}
                    onChange={(e) => handleInputChange('timeFormat', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="12">12 Hour</option>
                    <option value="24">24 Hour</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={settings.currency}
                    onChange={(e) => handleInputChange('currency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                    <option value="INR">INR (₹)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Default Appointment Duration (minutes)"
                  type="number"
                  value={settings.appointmentDuration}
                  onChange={(e) => handleInputChange('appointmentDuration', parseInt(e.target.value))}
                />

                <Input
                  label="Max Appointments Per Day"
                  type="number"
                  value={settings.maxAppointmentsPerDay}
                  onChange={(e) => handleInputChange('maxAppointmentsPerDay', parseInt(e.target.value))}
                />
              </div>

              <Input
                label="Reminder Time Before (hours)"
                type="number"
                value={settings.reminderTimeBefore}
                onChange={(e) => handleInputChange('reminderTimeBefore', parseInt(e.target.value))}
              />

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.allowOnlineBooking}
                    onChange={(e) => handleInputChange('allowOnlineBooking', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Allow Online Booking</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.requireAppointmentApproval}
                    onChange={(e) => handleInputChange('requireAppointmentApproval', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require Appointment Approval</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.sendAppointmentReminders}
                    onChange={(e) => handleInputChange('sendAppointmentReminders', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Send Appointment Reminders</span>
                </label>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Tax Rate (%)"
                  type="number"
                  step="0.01"
                  value={settings.taxRate}
                  onChange={(e) => handleInputChange('taxRate', parseFloat(e.target.value))}
                />

                <Input
                  label="Late Fee Percentage (%)"
                  type="number"
                  step="0.01"
                  value={settings.lateFeePercentage}
                  onChange={(e) => handleInputChange('lateFeePercentage', parseFloat(e.target.value))}
                />
              </div>

              <Input
                label="Payment Grace Period (days)"
                type="number"
                value={settings.paymentGracePeriod}
                onChange={(e) => handleInputChange('paymentGracePeriod', parseInt(e.target.value))}
              />

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.allowPartialPayments}
                    onChange={(e) => handleInputChange('allowPartialPayments', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Allow Partial Payments</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.requireInsuranceVerification}
                    onChange={(e) => handleInputChange('requireInsuranceVerification', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require Insurance Verification</span>
                </label>
              </div>
            </div>
          )}

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="SMTP Host"
                  value={settings.smtpHost}
                  onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                  placeholder="smtp.example.com"
                />

                <Input
                  label="SMTP Port"
                  type="number"
                  value={settings.smtpPort}
                  onChange={(e) => handleInputChange('smtpPort', parseInt(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="SMTP Username"
                  value={settings.smtpUsername}
                  onChange={(e) => handleInputChange('smtpUsername', e.target.value)}
                />

                <Input
                  label="SMTP Password"
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="From Email"
                  type="email"
                  value={settings.fromEmail}
                  onChange={(e) => handleInputChange('fromEmail', e.target.value)}
                  placeholder="noreply@hospital.com"
                />

                <Input
                  label="From Name"
                  value={settings.fromName}
                  onChange={(e) => handleInputChange('fromName', e.target.value)}
                  placeholder="Hospital Name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Encryption
                </label>
                <select
                  value={settings.smtpEncryption}
                  onChange={(e) => handleInputChange('smtpEncryption', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="TLS">TLS</option>
                  <option value="SSL">SSL</option>
                  <option value="NONE">None</option>
                </select>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Session Timeout (minutes)"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                />

                <Input
                  label="Max Login Attempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Password Minimum Length"
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value))}
                />

                <Input
                  label="Password Expiry (days)"
                  type="number"
                  value={settings.passwordExpiryDays}
                  onChange={(e) => handleInputChange('passwordExpiryDays', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => handleInputChange('maintenanceMode', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Maintenance Mode</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.allowRegistration}
                    onChange={(e) => handleInputChange('allowRegistration', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Allow Registration</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.requireEmailVerification}
                    onChange={(e) => handleInputChange('requireEmailVerification', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require Email Verification</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={settings.passwordRequireSpecialChar}
                    onChange={(e) => handleInputChange('passwordRequireSpecialChar', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Password Require Special Character</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemSettings;
