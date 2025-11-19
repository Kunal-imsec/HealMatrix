import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../common/Button';
import Input from '../common/Input';
import DatePicker from '../common/DatePicker';
import { 
  AlertTriangle, 
  Power,
  PowerOff,
  Clock,
  Calendar,
  Users,
  Bell,
  Save,
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react';

const MaintenanceMode = () => {
  const [maintenanceStatus, setMaintenanceStatus] = useState({
    isActive: false,
    startTime: null,
    endTime: null,
    reason: '',
    message: '',
    allowedIPs: [],
    allowedUsers: [],
    affectedServices: []
  });

  const [settings, setSettings] = useState({
    scheduledStart: '',
    scheduledEnd: '',
    reason: '',
    customMessage: '',
    notifyUsers: true,
    allowAdminAccess: true,
    redirectUrl: '',
    showCountdown: true
  });

  const [allowedIP, setAllowedIP] = useState('');
  const [allowedUser, setAllowedUser] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchMaintenanceStatus();
  }, []);

  const fetchMaintenanceStatus = async () => {
    try {
      const response = await adminService.getMaintenanceStatus();
      setMaintenanceStatus(response);
    } catch (err) {
      setError('Failed to fetch maintenance status');
    } finally {
      setLoading(false);
    }
  };

  const handleEnableMaintenance = async () => {
    if (window.confirm('Enable maintenance mode? All users except admins will be disconnected.')) {
      try {
        await adminService.enableMaintenanceMode({
          reason: settings.reason,
          message: settings.customMessage,
          allowedIPs: maintenanceStatus.allowedIPs,
          allowedUsers: maintenanceStatus.allowedUsers,
          notifyUsers: settings.notifyUsers
        });
        
        setSuccess('Maintenance mode enabled');
        fetchMaintenanceStatus();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to enable maintenance mode');
      }
    }
  };

  const handleDisableMaintenance = async () => {
    if (window.confirm('Disable maintenance mode? System will be accessible to all users.')) {
      try {
        await adminService.disableMaintenanceMode();
        setSuccess('Maintenance mode disabled');
        fetchMaintenanceStatus();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to disable maintenance mode');
      }
    }
  };

  const handleScheduleMaintenance = async () => {
    if (!settings.scheduledStart || !settings.scheduledEnd) {
      setError('Please select start and end times');
      return;
    }

    try {
      await adminService.scheduleMaintenanceMode({
        startTime: settings.scheduledStart,
        endTime: settings.scheduledEnd,
        reason: settings.reason,
        message: settings.customMessage,
        notifyUsers: settings.notifyUsers
      });

      setSuccess('Maintenance scheduled successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to schedule maintenance');
    }
  };

  const handleAddAllowedIP = () => {
    if (allowedIP && !maintenanceStatus.allowedIPs.includes(allowedIP)) {
      setMaintenanceStatus(prev => ({
        ...prev,
        allowedIPs: [...prev.allowedIPs, allowedIP]
      }));
      setAllowedIP('');
    }
  };

  const handleRemoveAllowedIP = (ip) => {
    setMaintenanceStatus(prev => ({
      ...prev,
      allowedIPs: prev.allowedIPs.filter(i => i !== ip)
    }));
  };

  const handleAddAllowedUser = () => {
    if (allowedUser && !maintenanceStatus.allowedUsers.includes(allowedUser)) {
      setMaintenanceStatus(prev => ({
        ...prev,
        allowedUsers: [...prev.allowedUsers, allowedUser]
      }));
      setAllowedUser('');
    }
  };

  const handleRemoveAllowedUser = (user) => {
    setMaintenanceStatus(prev => ({
      ...prev,
      allowedUsers: prev.allowedUsers.filter(u => u !== user)
    }));
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleToggle = (field) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
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
              <h3 className="text-lg font-semibold text-gray-900">Maintenance Mode</h3>
              <p className="text-gray-600">Control system availability and schedule downtime</p>
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

      {/* Current Status */}
      <div className={`rounded-lg p-6 border-2 ${
        maintenanceStatus.isActive 
          ? 'bg-red-50 border-red-200' 
          : 'bg-green-50 border-green-200'
      }`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            {maintenanceStatus.isActive ? (
              <PowerOff className="h-12 w-12 text-red-600" />
            ) : (
              <Power className="h-12 w-12 text-green-600" />
            )}
            
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {maintenanceStatus.isActive ? 'Maintenance Mode Active' : 'System Operational'}
              </h3>
              
              {maintenanceStatus.isActive ? (
                <div className="space-y-2 text-sm">
                  <p className="text-gray-700">
                    <strong>Started:</strong> {new Date(maintenanceStatus.startTime).toLocaleString()}
                  </p>
                  {maintenanceStatus.endTime && (
                    <p className="text-gray-700">
                      <strong>Expected End:</strong> {new Date(maintenanceStatus.endTime).toLocaleString()}
                    </p>
                  )}
                  <p className="text-gray-700">
                    <strong>Reason:</strong> {maintenanceStatus.reason || 'Scheduled maintenance'}
                  </p>
                </div>
              ) : (
                <p className="text-gray-700">System is running normally and accessible to all users</p>
              )}
            </div>
          </div>

          <Button
            variant={maintenanceStatus.isActive ? 'success' : 'danger'}
            onClick={maintenanceStatus.isActive ? handleDisableMaintenance : handleEnableMaintenance}
            leftIcon={maintenanceStatus.isActive ? <Power className="h-4 w-4" /> : <PowerOff className="h-4 w-4" />}
          >
            {maintenanceStatus.isActive ? 'Disable' : 'Enable'} Maintenance
          </Button>
        </div>
      </div>

      {/* Maintenance Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Schedule Maintenance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Calendar className="h-5 w-5 text-gray-400" />
            <h4 className="font-semibold text-gray-900">Schedule Maintenance</h4>
          </div>

          <div className="space-y-4">
            <DatePicker
              label="Start Time"
              value={settings.scheduledStart}
              onChange={(date) => handleInputChange('scheduledStart', date)}
              showTimeSelect
            />

            <DatePicker
              label="End Time"
              value={settings.scheduledEnd}
              onChange={(date) => handleInputChange('scheduledEnd', date)}
              showTimeSelect
            />

            <Input
              label="Reason"
              value={settings.reason}
              onChange={(e) => handleInputChange('reason', e.target.value)}
              placeholder="e.g., Database upgrade, System update"
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Message
              </label>
              <textarea
                value={settings.customMessage}
                onChange={(e) => handleInputChange('customMessage', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Message to display to users during maintenance"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.notifyUsers}
                  onChange={() => handleToggle('notifyUsers')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Notify all users</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.allowAdminAccess}
                  onChange={() => handleToggle('allowAdminAccess')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Allow admin access</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={settings.showCountdown}
                  onChange={() => handleToggle('showCountdown')}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Show countdown timer</span>
              </label>
            </div>

            <Button
              variant="primary"
              onClick={handleScheduleMaintenance}
              leftIcon={<Calendar className="h-4 w-4" />}
              className="w-full"
            >
              Schedule Maintenance
            </Button>
          </div>
        </div>

        {/* Access Control */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <Users className="h-5 w-5 text-gray-400" />
            <h4 className="font-semibold text-gray-900">Access Control</h4>
          </div>

          <div className="space-y-6">
            {/* Allowed IPs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed IP Addresses
              </label>
              
              <div className="flex space-x-2 mb-3">
                <Input
                  value={allowedIP}
                  onChange={(e) => setAllowedIP(e.target.value)}
                  placeholder="192.168.1.1"
                />
                <Button
                  size="sm"
                  onClick={handleAddAllowedIP}
                >
                  Add
                </Button>
              </div>

              {maintenanceStatus.allowedIPs.length > 0 ? (
                <div className="space-y-2">
                  {maintenanceStatus.allowedIPs.map((ip, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm font-mono">{ip}</span>
                      <button
                        onClick={() => handleRemoveAllowedIP(ip)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <AlertCircle className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No allowed IPs configured</p>
              )}
            </div>

            {/* Allowed Users */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed Users (Email)
              </label>
              
              <div className="flex space-x-2 mb-3">
                <Input
                  value={allowedUser}
                  onChange={(e) => setAllowedUser(e.target.value)}
                  placeholder="user@example.com"
                />
                <Button
                  size="sm"
                  onClick={handleAddAllowedUser}
                >
                  Add
                </Button>
              </div>

              {maintenanceStatus.allowedUsers.length > 0 ? (
                <div className="space-y-2">
                  {maintenanceStatus.allowedUsers.map((user, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="text-sm">{user}</span>
                      <button
                        onClick={() => handleRemoveAllowedUser(user)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <AlertCircle className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No allowed users configured</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800">
            <p className="font-medium mb-2">Important Information</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Enabling maintenance mode will disconnect all active users immediately</li>
              <li>Admin users will still have access unless explicitly restricted</li>
              <li>Scheduled maintenance will send notifications to all users 24 hours in advance</li>
              <li>Users on allowed IP addresses or in the allowed users list will bypass maintenance mode</li>
              <li>A custom maintenance page will be displayed to restricted users</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceMode;
