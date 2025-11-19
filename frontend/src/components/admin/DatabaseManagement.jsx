import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../common/Button';
import Modal from '../common/Modal';
import { 
  Database, 
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Play,
  Pause,
  Settings,
  AlertCircle,
  CheckCircle,
  HardDrive,
  Clock,
  Activity,
  FileText,
  Zap
} from 'lucide-react';

const DatabaseManagement = () => {
  const [dbStats, setDbStats] = useState({});
  const [tables, setTables] = useState([]);
  const [backups, setBackups] = useState([]);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [showBackupModal, setShowBackupModal] = useState(false);

  useEffect(() => {
    fetchDatabaseData();
  }, []);

  const fetchDatabaseData = async () => {
    try {
      const [stats, tablesData, backupsData, queriesData] = await Promise.all([
        adminService.getDatabaseStats(),
        adminService.getDatabaseTables(),
        adminService.getDatabaseBackups(),
        adminService.getSlowQueries()
      ]);

      setDbStats(stats);
      setTables(tablesData);
      setBackups(backupsData);
      setQueries(queriesData);
    } catch (err) {
      console.error('Error fetching database data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOptimizeTable = async (tableName) => {
    if (window.confirm(`Optimize table "${tableName}"? This may take a few minutes.`)) {
      try {
        await adminService.optimizeTable(tableName);
        alert(`Table "${tableName}" optimized successfully`);
        fetchDatabaseData();
      } catch (err) {
        console.error('Error optimizing table:', err);
      }
    }
  };

  const handleOptimizeAll = async () => {
    if (window.confirm('Optimize all tables? This may take several minutes.')) {
      try {
        await adminService.optimizeAllTables();
        alert('All tables optimized successfully');
        fetchDatabaseData();
      } catch (err) {
        console.error('Error optimizing tables:', err);
      }
    }
  };

  const handleBackupDatabase = async () => {
    try {
      await adminService.createDatabaseBackup();
      alert('Database backup created successfully');
      fetchDatabaseData();
    } catch (err) {
      console.error('Error creating backup:', err);
    }
  };

  const handleRestoreBackup = async (backupId) => {
    if (window.confirm('Restore database from backup? This will overwrite current data.')) {
      try {
        await adminService.restoreDatabaseBackup(backupId);
        alert('Database restored successfully. Please refresh the application.');
      } catch (err) {
        console.error('Error restoring backup:', err);
      }
    }
  };

  const handleDeleteBackup = async (backupId) => {
    if (window.confirm('Delete this backup? This action cannot be undone.')) {
      try {
        await adminService.deleteDatabaseBackup(backupId);
        fetchDatabaseData();
      } catch (err) {
        console.error('Error deleting backup:', err);
      }
    }
  };

  const handleVacuum = async () => {
    if (window.confirm('Run database vacuum? This will reclaim unused space.')) {
      try {
        await adminService.vacuumDatabase();
        alert('Database vacuum completed successfully');
        fetchDatabaseData();
      } catch (err) {
        console.error('Error running vacuum:', err);
      }
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'tables', label: 'Tables' },
    { id: 'backups', label: 'Backups' },
    { id: 'queries', label: 'Slow Queries' }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
              <h3 className="text-lg font-semibold text-gray-900">Database Management</h3>
              <p className="text-gray-600">Monitor and optimize database performance</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              size="sm"
              variant="outline"
              onClick={handleBackupDatabase}
              leftIcon={<Download className="h-4 w-4" />}
            >
              Backup Now
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={fetchDatabaseData}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Database Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <HardDrive className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Database Size</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatBytes(dbStats.size || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <FileText className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tables</p>
              <p className="text-2xl font-bold text-gray-900">{dbStats.totalTables || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Records</p>
              <p className="text-2xl font-bold text-gray-900">
                {(dbStats.totalRecords || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Zap className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Connections</p>
              <p className="text-2xl font-bold text-gray-900">{dbStats.connections || 0}</p>
            </div>
          </div>
        </div>
      </div>

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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Database Information</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Engine:</span>
                      <span className="font-medium text-gray-900">{dbStats.engine || 'PostgreSQL'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Version:</span>
                      <span className="font-medium text-gray-900">{dbStats.version || '14.5'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Character Set:</span>
                      <span className="font-medium text-gray-900">{dbStats.charset || 'UTF8'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Collation:</span>
                      <span className="font-medium text-gray-900">{dbStats.collation || 'en_US.UTF-8'}</span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Performance Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cache Hit Rate:</span>
                      <span className="font-medium text-gray-900">{dbStats.cacheHitRate || 0}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Avg Query Time:</span>
                      <span className="font-medium text-gray-900">{dbStats.avgQueryTime || 0}ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Active Queries:</span>
                      <span className="font-medium text-gray-900">{dbStats.activeQueries || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Backup:</span>
                      <span className="font-medium text-gray-900">
                        {dbStats.lastBackup ? new Date(dbStats.lastBackup).toLocaleDateString() : 'Never'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="primary"
                  onClick={() => setShowOptimizeModal(true)}
                  leftIcon={<Zap className="h-4 w-4" />}
                >
                  Optimize Database
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleVacuum}
                  leftIcon={<RefreshCw className="h-4 w-4" />}
                >
                  Vacuum Database
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleBackupDatabase}
                  leftIcon={<Download className="h-4 w-4" />}
                >
                  Create Backup
                </Button>
              </div>
            </div>
          )}

          {/* Tables Tab */}
          {activeTab === 'tables' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Showing {tables.length} tables
                </p>
                
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleOptimizeAll}
                  leftIcon={<Zap className="h-4 w-4" />}
                >
                  Optimize All
                </Button>
              </div>

              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Table Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Records
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Index Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Updated
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {tables.map((table, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">{table.name}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {(table.rows || 0).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatBytes(table.dataSize || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatBytes(table.indexSize || 0)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {table.lastUpdate ? new Date(table.lastUpdate).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <Button
                            size="xs"
                            variant="outline"
                            onClick={() => handleOptimizeTable(table.name)}
                            leftIcon={<Zap className="h-3 w-3" />}
                          >
                            Optimize
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Backups Tab */}
          {activeTab === 'backups' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {backups.length} backup(s) available
                </p>
                
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleBackupDatabase}
                  leftIcon={<Download className="h-4 w-4" />}
                >
                  Create Backup
                </Button>
              </div>

              {backups.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <Database className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No backups available</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {backups.map((backup) => (
                    <div key={backup.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <Database className="h-8 w-8 text-blue-600" />
                          
                          <div>
                            <h5 className="font-medium text-gray-900">{backup.name}</h5>
                            <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                              <div className="flex items-center space-x-1">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(backup.createdAt).toLocaleString()}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <HardDrive className="h-3 w-3" />
                                <span>{formatBytes(backup.size)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRestoreBackup(backup.id)}
                            leftIcon={<Upload className="h-3 w-3" />}
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
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Slow Queries Tab */}
          {activeTab === 'queries' && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Queries taking longer than 1 second
              </p>

              {queries.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">No slow queries detected</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {queries.map((query, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <AlertCircle className="h-5 w-5 text-yellow-600" />
                          <span className="font-medium text-gray-900">
                            {query.executionTime}ms
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {new Date(query.timestamp).toLocaleString()}
                        </span>
                      </div>
                      
                      <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                        {query.query}
                      </pre>
                      
                      {query.table && (
                        <p className="text-xs text-gray-600 mt-2">
                          Table: <span className="font-medium">{query.table}</span>
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Optimize Modal */}
      {showOptimizeModal && (
        <Modal
          isOpen={showOptimizeModal}
          onClose={() => setShowOptimizeModal(false)}
          title="Optimize Database"
          size="md"
        >
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Warning</p>
                  <p>Optimizing the database may take several minutes and could affect performance temporarily.</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 text-sm">
              <p className="font-medium text-gray-900">This will:</p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>Rebuild indexes for faster queries</li>
                <li>Reclaim unused space</li>
                <li>Update table statistics</li>
                <li>Defragment tables</li>
              </ul>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowOptimizeModal(false)}
              >
                Cancel
              </Button>
              
              <Button
                variant="primary"
                onClick={() => {
                  setShowOptimizeModal(false);
                  handleOptimizeAll();
                }}
                leftIcon={<Zap className="h-4 w-4" />}
              >
                Start Optimization
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DatabaseManagement;
