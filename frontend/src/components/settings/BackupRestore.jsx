import React, { useState, useEffect } from 'react';
import settingsService from '../../services/settingsService';
import Button from '../common/Button';
import { 
  Database, 
  Download, 
  Upload,
  Calendar,
  Clock,
  HardDrive,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Save,
  Trash2,
  FileText
} from 'lucide-react';

const BackupRestore = () => {
  const [backups, setBackups] = useState([]);
  const [backupSettings, setBackupSettings] = useState({
    autoBackupEnabled: false,
    backupFrequency: 'DAILY',
    backupTime: '02:00',
    retentionDays: 30,
    includeAttachments: true,
    compressBackups: true,
    encryptBackups: true
  });

  const [loading, setLoading] = useState(true);
  const [backingUp, setBackingUp] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  useEffect(() => {
    fetchBackupData();
  }, []);

  const fetchBackupData = async () => {
    try {
      const [backupList, settings] = await Promise.all([
        settingsService.getBackupList(),
        settingsService.getBackupSettings()
      ]);

      setBackups(backupList);
      setBackupSettings(prev => ({ ...prev, ...settings }));
    } catch (err) {
      setError('Failed to fetch backup data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setBackingUp(true);
    setError('');
    setSuccess('');

    try {
      await settingsService.createBackup();
      setSuccess('Backup created successfully');
      fetchBackupData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to create backup');
    } finally {
      setBackingUp(false);
    }
  };

  const handleDownloadBackup = async (backupId) => {
    try {
      await settingsService.downloadBackup(backupId);
    } catch (err) {
      setError('Failed to download backup');
    }
  };

  const handleDeleteBackup = async (backupId) => {
    if (window.confirm('Are you sure you want to delete this backup? This action cannot be undone.')) {
      try {
        await settingsService.deleteBackup(backupId);
        setBackups(prev => prev.filter(b => b.id !== backupId));
        setSuccess('Backup deleted successfully');
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete backup');
      }
    }
  };

  const handleRestoreBackup = async (backupId) => {
    if (window.confirm('Restoring will overwrite current data. Are you sure you want to continue?')) {
      setRestoring(true);
      setError('');
      setSuccess('');

      try {
        await settingsService.restoreBackup(backupId);
        setSuccess('System restored successfully. Please refresh the page.');
      } catch (err) {
        setError('Failed to restore backup');
      } finally {
        setRestoring(false);
      }
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const handleUploadRestore = async () => {
    if (!uploadedFile) return;

    if (window.confirm('Restoring from file will overwrite current data. Continue?')) {
      setRestoring(true);
      setError('');
      setSuccess('');

      try {
        await settingsService.restoreFromFile(uploadedFile);
        setSuccess('System restored successfully. Please refresh the page.');
        setUploadedFile(null);
      } catch (err) {
        setError('Failed to restore from file');
      } finally {
        setRestoring(false);
      }
    }
  };

  const handleSettingChange = (field, value) => {
    setBackupSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      await settingsService.updateBackupSettings(backupSettings);
      setSuccess('Backup settings saved successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save backup settings');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Database className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Backup & Restore</h3>
              <p className="text-gray-600">Manage system backups and restoration</p>
            </div>
          </div>
          
          <Button
            variant="primary"
            onClick={handleCreateBackup}
            loading={backingUp}
            leftIcon={<Save className="h-4 w-4" />}
          >
            Create Backup Now
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

      {/* Backup Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Backup Settings</h4>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Automatic Backups</p>
              <p className="text-sm text-gray-600">Schedule regular automated backups</p>
            </div>
            
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={backupSettings.autoBackupEnabled}
                onChange={(e) => handleSettingChange('autoBackupEnabled', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {backupSettings.autoBackupEnabled && (
            <div className="ml-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Frequency
                  </label>
                  <select
                    value={backupSettings.backupFrequency}
                    onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="HOURLY">Every Hour</option>
                    <option value="DAILY">Daily</option>
                    <option value="WEEKLY">Weekly</option>
                    <option value="MONTHLY">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Time
                  </label>
                  <input
                    type="time"
                    value={backupSettings.backupTime}
                    onChange={(e) => handleSettingChange('backupTime', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Retention Period (days)
                </label>
                <input
                  type="number"
                  value={backupSettings.retentionDays}
                  onChange={(e) => handleSettingChange('retentionDays', parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="1"
                  max="365"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Backups older than this will be automatically deleted
                </p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={backupSettings.includeAttachments}
                onChange={(e) => handleSettingChange('includeAttachments', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Include attachments and files</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={backupSettings.compressBackups}
                onChange={(e) => handleSettingChange('compressBackups', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Compress backups to save space</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={backupSettings.encryptBackups}
                onChange={(e) => handleSettingChange('encryptBackups', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Encrypt backups for security</span>
            </label>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button
              variant="primary"
              onClick={handleSaveSettings}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Save Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Backup List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-gray-900">Available Backups</h4>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchBackupData}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh
          </Button>
        </div>

        {backups.length === 0 ? (
          <div className="text-center py-8">
            <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Backups Available</h3>
            <p className="text-gray-600 mb-4">
              Create your first backup to protect your data
            </p>
            <Button
              variant="primary"
              onClick={handleCreateBackup}
              loading={backingUp}
              leftIcon={<Save className="h-4 w-4" />}
            >
              Create First Backup
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {backups.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <Database className="h-8 w-8 text-blue-600" />
                  
                  <div>
                    <h5 className="font-medium text-gray-900">{backup.name}</h5>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(backup.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{new Date(backup.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <HardDrive className="h-3 w-3" />
                        <span>{formatFileSize(backup.size)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDownloadBackup(backup.id)}
                    leftIcon={<Download className="h-3 w-3" />}
                  >
                    Download
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRestoreBackup(backup.id)}
                    disabled={restoring}
                    leftIcon={<RefreshCw className="h-3 w-3" />}
                  >
                    Restore
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteBackup(backup.id)}
                    leftIcon={<Trash2 className="h-3 w-3" />}
                    className="text-red-600"
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload and Restore */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Restore from File</h4>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Backup File
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex-1 cursor-pointer">
                <div className="flex items-center justify-center px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors">
                  {uploadedFile ? (
                    <div className="text-center">
                      <FileText className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-900">{uploadedFile.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(uploadedFile.size)}</p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">Click to upload backup file</p>
                      <p className="text-xs text-gray-500 mt-1">.backup, .sql, or .zip files</p>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  onChange={handleFileUpload}
                  accept=".backup,.sql,.zip"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {uploadedFile && (
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setUploadedFile(null)}
              >
                Cancel
              </Button>
              
              <Button
                variant="primary"
                onClick={handleUploadRestore}
                loading={restoring}
                leftIcon={<RefreshCw className="h-4 w-4" />}
              >
                Restore from File
              </Button>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">Warning</p>
                <p>Restoring from a backup will overwrite all current data. This action cannot be undone. Make sure you have a recent backup before proceeding.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BackupRestore;
