import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import settingsService from '../../services/settingsService';
import Button from '../common/Button';
import { 
  Bell, 
  Save,
  Mail,
  MessageSquare,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Calendar,
  FileText,
  DollarSign,
  Users
} from 'lucide-react';

const NotificationSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState({
    // Email Notifications
    emailAppointmentReminders: true,
    emailAppointmentConfirmations: true,
    emailAppointmentCancellations: true,
    emailNewMessages: true,
    emailBillingAlerts: true,
    emailPrescriptionUpdates: true,
    emailSystemUpdates: false,
    emailNewsletters: false,

    // SMS Notifications
    smsAppointmentReminders: true,
    smsAppointmentConfirmations: false,
    smsEmergencyAlerts: true,
    smsBillingAlerts: false,

    // Push Notifications
    pushAppointmentReminders: true,
    pushNewMessages: true,
    pushTaskAssignments: true,
    pushEmergencyAlerts: true,

    // In-App Notifications
    inAppAppointments: true,
    inAppMessages: true,
    inAppBilling: true,
    inAppPrescriptions: true,
    inAppSystemAlerts: true,

    // Notification Preferences
    quietHoursEnabled: false,
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00',
    notificationSound: true,
    emailDigestFrequency: 'DAILY'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      const response = await settingsService.getNotificationSettings(user.id);
      setSettings(prev => ({ ...prev, ...response }));
    } catch (err) {
      setError('Failed to fetch notification settings');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (field) => {
    setSettings(prev => ({ ...prev, [field]: !prev[field] }));
    if (error) setError('');
    if (success) setSuccess('');
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
      await settingsService.updateNotificationSettings(user.id, settings);
      setSuccess('Notification settings saved successfully');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to save notification settings');
    } finally {
      setSaving(false);
    }
  };

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

  const notificationGroups = [
    {
      title: 'Email Notifications',
      icon: Mail,
      color: 'text-blue-600',
      items: [
        { key: 'emailAppointmentReminders', label: 'Appointment Reminders', icon: Calendar },
        { key: 'emailAppointmentConfirmations', label: 'Appointment Confirmations', icon: Calendar },
        { key: 'emailAppointmentCancellations', label: 'Appointment Cancellations', icon: Calendar },
        { key: 'emailNewMessages', label: 'New Messages', icon: MessageSquare },
        { key: 'emailBillingAlerts', label: 'Billing Alerts', icon: DollarSign },
        { key: 'emailPrescriptionUpdates', label: 'Prescription Updates', icon: FileText },
        { key: 'emailSystemUpdates', label: 'System Updates', icon: Bell },
        { key: 'emailNewsletters', label: 'Newsletters', icon: Mail }
      ]
    },
    {
      title: 'SMS Notifications',
      icon: Smartphone,
      color: 'text-green-600',
      items: [
        { key: 'smsAppointmentReminders', label: 'Appointment Reminders', icon: Calendar },
        { key: 'smsAppointmentConfirmations', label: 'Appointment Confirmations', icon: Calendar },
        { key: 'smsEmergencyAlerts', label: 'Emergency Alerts', icon: AlertCircle },
        { key: 'smsBillingAlerts', label: 'Billing Alerts', icon: DollarSign }
      ]
    },
    {
      title: 'Push Notifications',
      icon: Bell,
      color: 'text-purple-600',
      items: [
        { key: 'pushAppointmentReminders', label: 'Appointment Reminders', icon: Calendar },
        { key: 'pushNewMessages', label: 'New Messages', icon: MessageSquare },
        { key: 'pushTaskAssignments', label: 'Task Assignments', icon: Users },
        { key: 'pushEmergencyAlerts', label: 'Emergency Alerts', icon: AlertCircle }
      ]
    },
    {
      title: 'In-App Notifications',
      icon: Bell,
      color: 'text-orange-600',
      items: [
        { key: 'inAppAppointments', label: 'Appointments', icon: Calendar },
        { key: 'inAppMessages', label: 'Messages', icon: MessageSquare },
        { key: 'inAppBilling', label: 'Billing', icon: DollarSign },
        { key: 'inAppPrescriptions', label: 'Prescriptions', icon: FileText },
        { key: 'inAppSystemAlerts', label: 'System Alerts', icon: Bell }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Notification Settings</h3>
              <p className="text-gray-600">Manage how you receive notifications</p>
            </div>
          </div>
          
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

      {/* Notification Groups */}
      {notificationGroups.map((group, groupIndex) => {
        const GroupIcon = group.icon;
        
        return (
          <div key={groupIndex} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <GroupIcon className={`h-5 w-5 ${group.color}`} />
              <h4 className="text-lg font-semibold text-gray-900">{group.title}</h4>
            </div>

            <div className="space-y-4">
              {group.items.map((item, itemIndex) => {
                const ItemIcon = item.icon;
                
                return (
                  <div key={itemIndex} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-3">
                      <ItemIcon className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                      </div>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings[item.key]}
                        onChange={() => handleToggle(item.key)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Additional Preferences */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Additional Preferences</h4>

        <div className="space-y-6">
          {/* Quiet Hours */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-medium text-gray-900">Quiet Hours</p>
                <p className="text-sm text-gray-600">Mute notifications during specific hours</p>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.quietHoursEnabled}
                  onChange={() => handleToggle('quietHoursEnabled')}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {settings.quietHoursEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={settings.quietHoursStart}
                    onChange={(e) => handleInputChange('quietHoursStart', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={settings.quietHoursEnd}
                    onChange={(e) => handleInputChange('quietHoursEnd', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Notification Sound */}
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Notification Sound</p>
              <p className="text-sm text-gray-600">Play sound for notifications</p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notificationSound}
                onChange={() => handleToggle('notificationSound')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Email Digest */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Digest Frequency
            </label>
            <select
              value={settings.emailDigestFrequency}
              onChange={(e) => handleInputChange('emailDigestFrequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="REALTIME">Real-time (as they happen)</option>
              <option value="DAILY">Daily Digest</option>
              <option value="WEEKLY">Weekly Digest</option>
              <option value="NEVER">Never</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationSettings;
