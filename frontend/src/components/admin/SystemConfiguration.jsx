import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../common/Button';
import Input from '../common/Input';
import { 
  Settings, 
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Server,
  Mail,
  Database,
  Lock,
  Globe,
  Bell,
  FileText,
  Zap,
  Shield
} from 'lucide-react';

const SystemConfiguration = () => {
  const [config, setConfig] = useState({
    // Application Settings
    appName: '',
    appUrl: '',
    appVersion: '',
    environment: 'production',
    debugMode: false,
    maintenanceMode: false,

    // Server Settings
    serverPort: 3000,
    serverHost: 'localhost',
    apiVersion: 'v1',
    apiRateLimit: 100,
    maxRequestSize: '10mb',
    requestTimeout: 30000,

    // Database Settings
    dbHost: '',
    dbPort: 5432,
    dbName: '',
    dbUser: '',
    dbPassword: '',
    dbConnectionPool: 20,
    dbTimeout: 5000,

    // Email Settings
    emailProvider: 'smtp',
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    smtpSecure: true,
    emailFrom: '',
    emailFromName: '',

    // Security Settings
    jwtSecret: '',
    jwtExpiry: '24h',
    sessionTimeout: 3600,
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    maxLoginAttempts: 5,
    lockoutDuration: 900,
    enableTwoFactor: false,

    // File Upload Settings
    uploadMaxSize: 10485760,
    allowedFileTypes: ['jpg', 'jpeg', 'png', 'pdf', 'doc', 'docx'],
    uploadPath: '/uploads',

    // Cache Settings
    cacheEnabled: true,
    cacheDriver: 'redis',
    cacheHost: 'localhost',
    cachePort: 6379,
    cacheTTL: 3600,

    // Logging Settings
    logLevel: 'info',
    logToFile: true,
    logToConsole: true,
    logRotation: 'daily',
    logRetentionDays: 30,

    // Notification Settings
    enableEmailNotifications: true,
    enableSmsNotifications: false,
    enablePushNotifications: true,
    notificationQueueEnabled: true
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('application');
  const [showSensitive, setShowSensitive] = useState({});

  useEffect(() => {
    fetchConfiguration();
  }, []);

  const fetchConfiguration = async () => {
    try {
      const response = await adminService.getSystemConfiguration();
      setConfig(prev => ({ ...prev, ...response }));
    } catch (err) {
      setError('Failed to fetch configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setConfig(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleToggle = (field) => {
    setConfig(prev => ({ ...prev, [field]: !prev[field] }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await adminService.updateSystemConfiguration(config);
      setSuccess('Configuration saved successfully. Restart may be required for some changes.');
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      setError(err.message || 'Failed to save configuration');
    } finally {
      setSaving(false);
    }
  };

  const handleRestart = async () => {
    if (window.confirm('Restart the application? This will disconnect all users temporarily.')) {
      try {
        await adminService.restartApplication();
        alert('Application restart initiated. Page will reload in 10 seconds.');
        setTimeout(() => window.location.reload(), 10000);
      } catch (err) {
        setError('Failed to restart application');
      }
    }
  };

  const handleTestEmail = async () => {
    try {
      await adminService.testEmailConfiguration(config);
      alert('Test email sent successfully');
    } catch (err) {
      alert('Failed to send test email: ' + err.message);
    }
  };

  const handleTestDatabase = async () => {
    try {
      await adminService.testDatabaseConnection(config);
      alert('Database connection successful');
    } catch (err) {
      alert('Database connection failed: ' + err.message);
    }
  };

  const tabs = [
    { id: 'application', label: 'Application', icon: Server },
    { id: 'database', label: 'Database', icon: Database },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'cache', label: 'Cache', icon: Zap },
    { id: 'logging', label: 'Logging', icon: FileText }
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
              <h3 className="text-lg font-semibold text-gray-900">System Configuration</h3>
              <p className="text-gray-600">Advanced system settings and environment configuration</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleRestart}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Restart App
            </Button>
            
            <Button
              size="sm"
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

      {/* Warning Banner */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-yellow-800">
            <p className="font-medium mb-1">Warning</p>
            <p>Changing these settings may affect system functionality. Some changes require an application restart. Always backup configuration before making changes.</p>
          </div>
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
          {/* Application Tab */}
          {activeTab === 'application' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Application Name"
                  value={config.appName}
                  onChange={(e) => handleInputChange('appName', e.target.value)}
                />

                <Input
                  label="Application URL"
                  value={config.appUrl}
                  onChange={(e) => handleInputChange('appUrl', e.target.value)}
                  placeholder="https://yourdomain.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Version"
                  value={config.appVersion}
                  onChange={(e) => handleInputChange('appVersion', e.target.value)}
                  disabled
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Environment
                  </label>
                  <select
                    value={config.environment}
                    onChange={(e) => handleInputChange('environment', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="development">Development</option>
                    <option value="staging">Staging</option>
                    <option value="production">Production</option>
                  </select>
                </div>

                <Input
                  label="API Version"
                  value={config.apiVersion}
                  onChange={(e) => handleInputChange('apiVersion', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Server Port"
                  type="number"
                  value={config.serverPort}
                  onChange={(e) => handleInputChange('serverPort', parseInt(e.target.value))}
                />

                <Input
                  label="API Rate Limit (req/min)"
                  type="number"
                  value={config.apiRateLimit}
                  onChange={(e) => handleInputChange('apiRateLimit', parseInt(e.target.value))}
                />

                <Input
                  label="Request Timeout (ms)"
                  type="number"
                  value={config.requestTimeout}
                  onChange={(e) => handleInputChange('requestTimeout', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.debugMode}
                    onChange={() => handleToggle('debugMode')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable Debug Mode</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.maintenanceMode}
                    onChange={() => handleToggle('maintenanceMode')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Maintenance Mode</span>
                </label>
              </div>
            </div>
          )}

          {/* Database Tab */}
          {activeTab === 'database' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Database Host"
                  value={config.dbHost}
                  onChange={(e) => handleInputChange('dbHost', e.target.value)}
                  placeholder="localhost"
                />

                <Input
                  label="Database Port"
                  type="number"
                  value={config.dbPort}
                  onChange={(e) => handleInputChange('dbPort', parseInt(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Database Name"
                  value={config.dbName}
                  onChange={(e) => handleInputChange('dbName', e.target.value)}
                />

                <Input
                  label="Database User"
                  value={config.dbUser}
                  onChange={(e) => handleInputChange('dbUser', e.target.value)}
                />
              </div>

              <div className="relative">
                <Input
                  label="Database Password"
                  type={showSensitive.dbPassword ? 'text' : 'password'}
                  value={config.dbPassword}
                  onChange={(e) => handleInputChange('dbPassword', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowSensitive(prev => ({ ...prev, dbPassword: !prev.dbPassword }))}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showSensitive.dbPassword ? <Shield className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Connection Pool Size"
                  type="number"
                  value={config.dbConnectionPool}
                  onChange={(e) => handleInputChange('dbConnectionPool', parseInt(e.target.value))}
                />

                <Input
                  label="Connection Timeout (ms)"
                  type="number"
                  value={config.dbTimeout}
                  onChange={(e) => handleInputChange('dbTimeout', parseInt(e.target.value))}
                />
              </div>

              <Button
                variant="outline"
                onClick={handleTestDatabase}
                leftIcon={<Database className="h-4 w-4" />}
              >
                Test Connection
              </Button>
            </div>
          )}

          {/* Email Tab */}
          {activeTab === 'email' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="SMTP Host"
                  value={config.smtpHost}
                  onChange={(e) => handleInputChange('smtpHost', e.target.value)}
                  placeholder="smtp.gmail.com"
                />

                <Input
                  label="SMTP Port"
                  type="number"
                  value={config.smtpPort}
                  onChange={(e) => handleInputChange('smtpPort', parseInt(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="SMTP Username"
                  value={config.smtpUser}
                  onChange={(e) => handleInputChange('smtpUser', e.target.value)}
                />

                <div className="relative">
                  <Input
                    label="SMTP Password"
                    type={showSensitive.smtpPassword ? 'text' : 'password'}
                    value={config.smtpPassword}
                    onChange={(e) => handleInputChange('smtpPassword', e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSensitive(prev => ({ ...prev, smtpPassword: !prev.smtpPassword }))}
                    className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                  >
                    {showSensitive.smtpPassword ? <Shield className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="From Email"
                  type="email"
                  value={config.emailFrom}
                  onChange={(e) => handleInputChange('emailFrom', e.target.value)}
                  placeholder="noreply@hospital.com"
                />

                <Input
                  label="From Name"
                  value={config.emailFromName}
                  onChange={(e) => handleInputChange('emailFromName', e.target.value)}
                  placeholder="Hospital Management System"
                />
              </div>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.smtpSecure}
                  onChange={() => handleToggle('smtpSecure')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Use Secure Connection (TLS/SSL)</span>
              </label>

              <Button
                variant="outline"
                onClick={handleTestEmail}
                leftIcon={<Mail className="h-4 w-4" />}
              >
                Send Test Email
              </Button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="relative">
                <Input
                  label="JWT Secret Key"
                  type={showSensitive.jwtSecret ? 'text' : 'password'}
                  value={config.jwtSecret}
                  onChange={(e) => handleInputChange('jwtSecret', e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowSensitive(prev => ({ ...prev, jwtSecret: !prev.jwtSecret }))}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showSensitive.jwtSecret ? <Shield className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="JWT Expiry"
                  value={config.jwtExpiry}
                  onChange={(e) => handleInputChange('jwtExpiry', e.target.value)}
                  placeholder="24h"
                />

                <Input
                  label="Session Timeout (seconds)"
                  type="number"
                  value={config.sessionTimeout}
                  onChange={(e) => handleInputChange('sessionTimeout', parseInt(e.target.value))}
                />

                <Input
                  label="Password Min Length"
                  type="number"
                  value={config.passwordMinLength}
                  onChange={(e) => handleInputChange('passwordMinLength', parseInt(e.target.value))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Max Login Attempts"
                  type="number"
                  value={config.maxLoginAttempts}
                  onChange={(e) => handleInputChange('maxLoginAttempts', parseInt(e.target.value))}
                />

                <Input
                  label="Lockout Duration (seconds)"
                  type="number"
                  value={config.lockoutDuration}
                  onChange={(e) => handleInputChange('lockoutDuration', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.passwordRequireSpecial}
                    onChange={() => handleToggle('passwordRequireSpecial')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require Special Characters</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.passwordRequireNumbers}
                    onChange={() => handleToggle('passwordRequireNumbers')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require Numbers</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.passwordRequireUppercase}
                    onChange={() => handleToggle('passwordRequireUppercase')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require Uppercase Letters</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.enableTwoFactor}
                    onChange={() => handleToggle('enableTwoFactor')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Enable Two-Factor Authentication</span>
                </label>
              </div>
            </div>
          )}

          {/* Cache Tab */}
          {activeTab === 'cache' && (
            <div className="space-y-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={config.cacheEnabled}
                  onChange={() => handleToggle('cacheEnabled')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Enable Caching</span>
              </label>

              {config.cacheEnabled && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cache Driver
                    </label>
                    <select
                      value={config.cacheDriver}
                      onChange={(e) => handleInputChange('cacheDriver', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="redis">Redis</option>
                      <option value="memcached">Memcached</option>
                      <option value="memory">In-Memory</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="Cache Host"
                      value={config.cacheHost}
                      onChange={(e) => handleInputChange('cacheHost', e.target.value)}
                    />

                    <Input
                      label="Cache Port"
                      type="number"
                      value={config.cachePort}
                      onChange={(e) => handleInputChange('cachePort', parseInt(e.target.value))}
                    />

                    <Input
                      label="Default TTL (seconds)"
                      type="number"
                      value={config.cacheTTL}
                      onChange={(e) => handleInputChange('cacheTTL', parseInt(e.target.value))}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          {/* Logging Tab */}
          {activeTab === 'logging' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Log Level
                </label>
                <select
                  value={config.logLevel}
                  onChange={(e) => handleInputChange('logLevel', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="error">Error</option>
                  <option value="warn">Warning</option>
                  <option value="info">Info</option>
                  <option value="debug">Debug</option>
                  <option value="verbose">Verbose</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Log Rotation
                  </label>
                  <select
                    value={config.logRotation}
                    onChange={(e) => handleInputChange('logRotation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                  </select>
                </div>

                <Input
                  label="Log Retention (days)"
                  type="number"
                  value={config.logRetentionDays}
                  onChange={(e) => handleInputChange('logRetentionDays', parseInt(e.target.value))}
                />
              </div>

              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.logToFile}
                    onChange={() => handleToggle('logToFile')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Log to File</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.logToConsole}
                    onChange={() => handleToggle('logToConsole')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">Log to Console</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SystemConfiguration;
