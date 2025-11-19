import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import settingsService from '../../services/settingsService';
import Button from '../common/Button';
import Table from '../common/Table';
import { 
  Shield, 
  Lock,
  Smartphone,
  Key,
  AlertCircle,
  CheckCircle,
  LogOut,
  Trash2,
  MapPin,
  Clock,
  Monitor,
  Download
} from 'lucide-react';

const SecuritySettings = () => {
  const { user } = useAuth();
  const [activeSessions, setActiveSessions] = useState([]);
  const [loginHistory, setLoginHistory] = useState([]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('sessions');

  useEffect(() => {
    fetchSecurityData();
  }, []);

  const fetchSecurityData = async () => {
    try {
      const [sessionsData, historyData, securityData] = await Promise.all([
        settingsService.getActiveSessions(user.id),
        settingsService.getLoginHistory(user.id),
        settingsService.getSecuritySettings(user.id)
      ]);

      setActiveSessions(sessionsData);
      setLoginHistory(historyData);
      setTwoFactorEnabled(securityData.twoFactorEnabled || false);
    } catch (err) {
      setError('Failed to fetch security data');
    } finally {
      setLoading(false);
    }
  };

  const handleEnableTwoFactor = async () => {
    try {
      const response = await settingsService.enableTwoFactor(user.id);
      setQrCode(response.qrCode);
      setSuccess('Scan the QR code with your authenticator app');
    } catch (err) {
      setError('Failed to enable two-factor authentication');
    }
  };

  const handleVerifyTwoFactor = async () => {
    try {
      await settingsService.verifyTwoFactor(user.id, verificationCode);
      setTwoFactorEnabled(true);
      setQrCode('');
      setVerificationCode('');
      setSuccess('Two-factor authentication enabled successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Invalid verification code');
    }
  };

  const handleDisableTwoFactor = async () => {
    if (window.confirm('Are you sure you want to disable two-factor authentication?')) {
      try {
        await settingsService.disableTwoFactor(user.id);
        setTwoFactorEnabled(false);
        setSuccess('Two-factor authentication disabled');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to disable two-factor authentication');
      }
    }
  };

  const handleTerminateSession = async (sessionId) => {
    if (window.confirm('Terminate this session?')) {
      try {
        await settingsService.terminateSession(sessionId);
        setActiveSessions(prev => prev.filter(s => s.id !== sessionId));
        setSuccess('Session terminated');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to terminate session');
      }
    }
  };

  const handleTerminateAllSessions = async () => {
    if (window.confirm('This will log you out from all devices except the current one. Continue?')) {
      try {
        await settingsService.terminateAllSessions(user.id);
        fetchSecurityData();
        setSuccess('All other sessions terminated');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to terminate sessions');
      }
    }
  };

  const handleExportLoginHistory = async () => {
    try {
      await settingsService.exportLoginHistory(user.id);
    } catch (err) {
      setError('Failed to export login history');
    }
  };

  const getDeviceIcon = (deviceType) => {
    switch (deviceType) {
      case 'MOBILE':
        return <Smartphone className="h-4 w-4" />;
      case 'DESKTOP':
        return <Monitor className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const getSessionsColumns = () => [
    {
      key: 'device',
      header: 'Device',
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          <div className="text-gray-400">
            {getDeviceIcon(row.deviceType)}
          </div>
          <div>
            <div className="font-medium text-gray-900">{row.deviceName}</div>
            <div className="text-sm text-gray-500">{row.browser}</div>
          </div>
        </div>
      )
    },
    {
      key: 'location',
      header: 'Location',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {row.city}, {row.country}
          </span>
        </div>
      )
    },
    {
      key: 'ipAddress',
      header: 'IP Address',
      render: (value) => (
        <span className="font-mono text-sm text-gray-600">{value}</span>
      )
    },
    {
      key: 'lastActivity',
      header: 'Last Activity',
      render: (value) => (
        <div className="flex items-center space-x-2">
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {new Date(value).toLocaleString()}
          </span>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (_, row) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          row.isCurrent 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {row.isCurrent ? 'Current' : 'Active'}
        </span>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        !row.isCurrent && (
          <Button
            size="xs"
            variant="ghost"
            onClick={() => handleTerminateSession(row.id)}
            leftIcon={<LogOut className="h-3 w-3" />}
            className="text-red-600"
          >
            Terminate
          </Button>
        )
      ),
      sortable: false
    }
  ];

  const getLoginHistoryColumns = () => [
    {
      key: 'timestamp',
      header: 'Date & Time',
      render: (value) => (
        <div className="text-sm">
          <div className="font-medium text-gray-900">
            {new Date(value).toLocaleDateString()}
          </div>
          <div className="text-gray-500">
            {new Date(value).toLocaleTimeString()}
          </div>
        </div>
      )
    },
    {
      key: 'device',
      header: 'Device',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          {getDeviceIcon(row.deviceType)}
          <div className="text-sm">
            <div className="text-gray-900">{row.deviceName}</div>
            <div className="text-gray-500">{row.browser}</div>
          </div>
        </div>
      )
    },
    {
      key: 'location',
      header: 'Location',
      render: (_, row) => (
        <div className="text-sm">
          <div className="text-gray-900">{row.city}, {row.country}</div>
          <div className="text-gray-500 font-mono">{row.ipAddress}</div>
        </div>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'SUCCESS' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'reason',
      header: 'Details',
      render: (value) => value || 'Successful login'
    }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'sessions', label: 'Active Sessions' },
    { id: 'history', label: 'Login History' },
    { id: '2fa', label: 'Two-Factor Auth' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
              <p className="text-gray-600">Manage your account security</p>
            </div>
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
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Active Sessions Tab */}
          {activeTab === 'sessions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Manage devices where you're currently logged in
                </p>
                <Button
                  variant="outline"
                  onClick={handleTerminateAllSessions}
                  leftIcon={<LogOut className="h-4 w-4" />}
                  className="text-red-600"
                >
                  Terminate All Other Sessions
                </Button>
              </div>

              <Table
                data={activeSessions}
                columns={getSessionsColumns()}
                loading={false}
                pagination={false}
                emptyMessage="No active sessions"
              />
            </div>
          )}

          {/* Login History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  View your recent login activity
                </p>
                <Button
                  variant="outline"
                  onClick={handleExportLoginHistory}
                  leftIcon={<Download className="h-4 w-4" />}
                >
                  Export History
                </Button>
              </div>

              <Table
                data={loginHistory}
                columns={getLoginHistoryColumns()}
                loading={false}
                pagination={true}
                itemsPerPage={10}
                emptyMessage="No login history"
              />
            </div>
          )}

          {/* Two-Factor Auth Tab */}
          {activeTab === '2fa' && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <Key className="h-8 w-8 text-blue-600" />
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900">Two-Factor Authentication</h4>
                  <p className="text-sm text-blue-700">
                    Add an extra layer of security to your account
                  </p>
                </div>
                
                {twoFactorEnabled ? (
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                      Enabled
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleDisableTwoFactor}
                      className="text-red-600"
                    >
                      Disable
                    </Button>
                  </div>
                ) : (
                  <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                    Disabled
                  </span>
                )}
              </div>

              {!twoFactorEnabled && !qrCode && (
                <div className="text-center py-8">
                  <Lock className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Enable Two-Factor Authentication
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Protect your account with an additional security layer. You'll need an authenticator 
                    app like Google Authenticator or Authy.
                  </p>
                  <Button
                    variant="primary"
                    onClick={handleEnableTwoFactor}
                    leftIcon={<Key className="h-4 w-4" />}
                  >
                    Enable Two-Factor Authentication
                  </Button>
                </div>
              )}

              {qrCode && !twoFactorEnabled && (
                <div className="max-w-md mx-auto">
                  <div className="text-center mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">
                      Scan QR Code
                    </h4>
                    <p className="text-sm text-gray-600">
                      Open your authenticator app and scan this QR code
                    </p>
                  </div>

                  <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-6">
                    <img src={qrCode} alt="QR Code" className="w-64 h-64 mx-auto" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Verification Code
                      </label>
                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="000000"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-widest focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={6}
                      />
                    </div>

                    <Button
                      variant="primary"
                      onClick={handleVerifyTwoFactor}
                      disabled={verificationCode.length !== 6}
                      className="w-full"
                    >
                      Verify and Enable
                    </Button>
                  </div>
                </div>
              )}

              {twoFactorEnabled && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium text-green-900 mb-2">
                        Two-Factor Authentication is Active
                      </h4>
                      <p className="text-sm text-green-700 mb-4">
                        Your account is protected with two-factor authentication. You'll need to 
                        enter a code from your authenticator app when logging in.
                      </p>
                      <div className="space-y-2 text-sm text-green-800">
                        <p>• Keep your authenticator app accessible</p>
                        <p>• Don't share your verification codes with anyone</p>
                        <p>• Save backup codes in a secure location</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
