import React, { useState, useEffect } from 'react';
import settingsService from '../../services/settingsService';
import Table from '../common/Table';
import Button from '../common/Button';
import Input from '../common/Input';
import DatePicker from '../common/DatePicker';
import { 
  FileText, 
  Search, 
  Filter,
  Download,
  Eye,
  User,
  Calendar,
  Clock,
  Activity,
  AlertTriangle,
  Info,
  CheckCircle,
  XCircle
} from 'lucide-react';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    action: 'all',
    user: 'all',
    severity: 'all',
    startDate: '',
    endDate: ''
  });
  const [selectedLog, setSelectedLog] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchAuditLogs();
  }, [searchTerm, filters]);

  const fetchAuditLogs = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        ...filters
      };

      const response = await settingsService.getAuditLogs(params);
      setLogs(response);
    } catch (err) {
      console.error('Error fetching audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      await settingsService.exportAuditLogs({ ...filters, search: searchTerm });
    } catch (err) {
      console.error('Error exporting audit logs:', err);
    }
  };

  const handleViewDetails = (log) => {
    setSelectedLog(log);
    setShowDetailModal(true);
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'INFO':
        return <Info className="h-4 w-4 text-blue-600" />;
      case 'SUCCESS':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Info className="h-4 w-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800';
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800';
      case 'INFO':
        return 'bg-blue-100 text-blue-800';
      case 'SUCCESS':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('CREATE')) return <CheckCircle className="h-4 w-4 text-green-600" />;
    if (action.includes('UPDATE')) return <Activity className="h-4 w-4 text-blue-600" />;
    if (action.includes('DELETE')) return <XCircle className="h-4 w-4 text-red-600" />;
    return <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getTableColumns = () => [
    {
      key: 'timestamp',
      header: 'Date & Time',
      render: (value) => (
        <div className="text-sm">
          <div className="flex items-center space-x-1 text-gray-900">
            <Calendar className="h-3 w-3 text-gray-400" />
            <span>{new Date(value).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Clock className="h-3 w-3 text-gray-400" />
            <span>{new Date(value).toLocaleTimeString()}</span>
          </div>
        </div>
      )
    },
    {
      key: 'user',
      header: 'User',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-400" />
          <div className="text-sm">
            <div className="font-medium text-gray-900">{row.userName}</div>
            <div className="text-gray-500">{row.userRole}</div>
          </div>
        </div>
      )
    },
    {
      key: 'action',
      header: 'Action',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {getActionIcon(value)}
          <span className="text-sm font-medium text-gray-900">{value}</span>
        </div>
      )
    },
    {
      key: 'module',
      header: 'Module',
      render: (value) => (
        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
          {value}
        </span>
      )
    },
    {
      key: 'description',
      header: 'Description',
      render: (value) => (
        <span className="text-sm text-gray-600 line-clamp-2" title={value}>
          {value}
        </span>
      )
    },
    {
      key: 'ipAddress',
      header: 'IP Address',
      render: (value) => (
        <span className="font-mono text-xs text-gray-600">{value}</span>
      )
    },
    {
      key: 'severity',
      header: 'Severity',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {getSeverityIcon(value)}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(value)}`}>
            {value}
          </span>
        </div>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <Button
          size="xs"
          variant="ghost"
          onClick={() => handleViewDetails(row)}
          leftIcon={<Eye className="h-3 w-3" />}
        >
          Details
        </Button>
      ),
      sortable: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Audit Logs</h3>
              <p className="text-gray-600">View system activity and user actions</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={handleExport}
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export Logs
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Search logs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-gray-400" />}
          />

          <select
            value={filters.action}
            onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Actions</option>
            <option value="CREATE">Create</option>
            <option value="UPDATE">Update</option>
            <option value="DELETE">Delete</option>
            <option value="LOGIN">Login</option>
            <option value="LOGOUT">Logout</option>
          </select>

          <select
            value={filters.severity}
            onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Severity</option>
            <option value="CRITICAL">Critical</option>
            <option value="WARNING">Warning</option>
            <option value="INFO">Info</option>
            <option value="SUCCESS">Success</option>
          </select>

          <DatePicker
            placeholder="Start Date"
            value={filters.startDate}
            onChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
          />

          <DatePicker
            placeholder="End Date"
            value={filters.endDate}
            onChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
          />
        </div>
      </div>

      {/* Audit Logs Table */}
      <Table
        data={logs}
        columns={getTableColumns()}
        loading={loading}
        searchable={false}
        sortable={true}
        pagination={true}
        itemsPerPage={50}
        emptyMessage="No audit logs found"
      />

      {/* Detail Modal */}
      {showDetailModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Audit Log Details</h3>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Timestamp</label>
                  <p className="text-sm text-gray-900">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">User</label>
                  <p className="text-sm text-gray-900">{selectedLog.userName} ({selectedLog.userRole})</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Action</label>
                  <p className="text-sm text-gray-900">{selectedLog.action}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Module</label>
                  <p className="text-sm text-gray-900">{selectedLog.module}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">IP Address</label>
                  <p className="text-sm text-gray-900 font-mono">{selectedLog.ipAddress}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">Severity</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(selectedLog.severity)}`}>
                    {selectedLog.severity}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">Description</label>
                <p className="text-sm text-gray-900 mt-1">{selectedLog.description}</p>
              </div>

              {selectedLog.details && (
                <div>
                  <label className="text-sm font-medium text-gray-600">Additional Details</label>
                  <pre className="text-xs text-gray-900 mt-1 bg-gray-50 p-4 rounded border border-gray-200 overflow-x-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end">
              <Button variant="outline" onClick={() => setShowDetailModal(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
