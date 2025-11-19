import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../common/Button';
import Table from '../common/Table';
import DatePicker from '../common/DatePicker';
import { 
  Shield, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  Download,
  RefreshCw,
  Lock,
  Unlock,
  Eye,
  Activity,
  TrendingUp,
  UserX
} from 'lucide-react';

const SecurityAudit = () => {
  const [auditData, setAuditData] = useState({});
  const [threats, setThreats] = useState([]);
  const [suspiciousActivity, setSuspiciousActivity] = useState([]);
  const [failedLogins, setFailedLogins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });

  useEffect(() => {
    fetchSecurityData();
  }, [dateRange]);

  const fetchSecurityData = async () => {
    try {
      const [audit, threatsData, suspiciousData, loginData] = await Promise.all([
        adminService.getSecurityAudit(dateRange),
        adminService.getSecurityThreats(dateRange),
        adminService.getSuspiciousActivity(dateRange),
        adminService.getFailedLogins(dateRange)
      ]);

      setAuditData(audit);
      setThreats(threatsData);
      setSuspiciousActivity(suspiciousData);
      setFailedLogins(loginData);
    } catch (err) {
      console.error('Error fetching security data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockIP = async (ip) => {
    if (window.confirm(`Block IP address ${ip}?`)) {
      try {
        await adminService.blockIPAddress(ip);
        alert(`IP ${ip} blocked successfully`);
        fetchSecurityData();
      } catch (err) {
        console.error('Error blocking IP:', err);
      }
    }
  };

  const handleUnblockIP = async (ip) => {
    try {
      await adminService.unblockIPAddress(ip);
      alert(`IP ${ip} unblocked successfully`);
      fetchSecurityData();
    } catch (err) {
      console.error('Error unblocking IP:', err);
    }
  };

  const handleLockUser = async (userId) => {
    if (window.confirm('Lock this user account?')) {
      try {
        await adminService.lockUserAccount(userId);
        alert('User account locked successfully');
        fetchSecurityData();
      } catch (err) {
        console.error('Error locking user:', err);
      }
    }
  };

  const handleExportAudit = async () => {
    try {
      await adminService.exportSecurityAudit(dateRange);
    } catch (err) {
      console.error('Error exporting audit:', err);
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'CRITICAL':
      case 'HIGH':
        return <XCircle className="h-5 w-5" />;
      case 'MEDIUM':
        return <AlertTriangle className="h-5 w-5" />;
      case 'LOW':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'threats', label: 'Threats' },
    { id: 'suspicious', label: 'Suspicious Activity' },
    { id: 'failed-logins', label: 'Failed Logins' }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
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
            <Shield className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Security Audit</h3>
              <p className="text-gray-600">Monitor security events and threats</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <DatePicker
              value={dateRange.startDate}
              onChange={(date) => setDateRange(prev => ({ ...prev, startDate: date }))}
              placeholder="Start Date"
            />
            
            <DatePicker
              value={dateRange.endDate}
              onChange={(date) => setDateRange(prev => ({ ...prev, endDate: date }))}
              placeholder="End Date"
            />
            
            <Button
              size="sm"
              variant="outline"
              onClick={fetchSecurityData}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Refresh
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportAudit}
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Security Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Critical Threats</p>
              <p className="text-2xl font-bold text-gray-900">{auditData.criticalThreats || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Eye className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Suspicious Activity</p>
              <p className="text-2xl font-bold text-gray-900">{auditData.suspiciousActivity || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <UserX className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Failed Logins</p>
              <p className="text-2xl font-bold text-gray-900">{auditData.failedLogins || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Lock className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Blocked IPs</p>
              <p className="text-2xl font-bold text-gray-900">{auditData.blockedIPs || 0}</p>
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
                  <h4 className="font-semibold text-gray-900 mb-4">Security Score</h4>
                  <div className="flex items-center justify-center">
                    <div className="relative w-32 h-32">
                      <svg className="transform -rotate-90 w-32 h-32">
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          className="text-gray-200"
                        />
                        <circle
                          cx="64"
                          cy="64"
                          r="56"
                          stroke="currentColor"
                          strokeWidth="8"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 56}`}
                          strokeDashoffset={`${2 * Math.PI * 56 * (1 - (auditData.securityScore || 0) / 100)}`}
                          className={`${
                            (auditData.securityScore || 0) >= 80 ? 'text-green-500' :
                            (auditData.securityScore || 0) >= 60 ? 'text-yellow-500' :
                            'text-red-500'
                          }`}
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold">{auditData.securityScore || 0}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-center text-sm text-gray-600 mt-4">
                    {(auditData.securityScore || 0) >= 80 ? 'Excellent' :
                     (auditData.securityScore || 0) >= 60 ? 'Good' :
                     'Needs Improvement'}
                  </p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    {auditData.recentActivity?.slice(0, 5).map((activity, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <div className={`p-1.5 rounded ${getSeverityColor(activity.severity)}`}>
                          {getSeverityIcon(activity.severity)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">{activity.description}</p>
                          <p className="text-xs text-gray-500">
                            {new Date(activity.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Security Recommendations</h4>
                <div className="space-y-2">
                  {auditData.recommendations?.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-700">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Threats Tab */}
          {activeTab === 'threats' && (
            <div className="space-y-4">
              {threats.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">No security threats detected</p>
                </div>
              ) : (
                threats.map((threat, index) => (
                  <div key={index} className={`border rounded-lg p-4 ${getSeverityColor(threat.severity)}`}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        {getSeverityIcon(threat.severity)}
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="font-semibold">{threat.title}</h5>
                            <span className="text-xs px-2 py-0.5 rounded border">
                              {threat.severity}
                            </span>
                          </div>
                          
                          <p className="text-sm mb-2">{threat.description}</p>
                          
                          <div className="flex items-center space-x-4 text-xs">
                            <span>IP: {threat.ipAddress}</span>
                            <span>{new Date(threat.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handleBlockIP(threat.ipAddress)}
                        leftIcon={<Lock className="h-3 w-3" />}
                      >
                        Block IP
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Suspicious Activity Tab */}
          {activeTab === 'suspicious' && (
            <div className="space-y-4">
              {suspiciousActivity.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <p className="text-gray-600">No suspicious activity detected</p>
                </div>
              ) : (
                <Table
                  data={suspiciousActivity}
                  columns={[
                    {
                      key: 'timestamp',
                      header: 'Time',
                      render: (value) => new Date(value).toLocaleString()
                    },
                    {
                      key: 'user',
                      header: 'User',
                      render: (value) => value || 'Unknown'
                    },
                    {
                      key: 'activity',
                      header: 'Activity',
                      render: (value) => value
                    },
                    {
                      key: 'ipAddress',
                      header: 'IP Address',
                      render: (value) => <span className="font-mono text-sm">{value}</span>
                    },
                    {
                      key: 'riskScore',
                      header: 'Risk',
                      render: (value) => (
                        <span className={`px-2 py-1 text-xs rounded ${
                          value >= 7 ? 'bg-red-100 text-red-800' :
                          value >= 4 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {value}/10
                        </span>
                      )
                    },
                    {
                      key: 'actions',
                      header: 'Actions',
                      render: (_, row) => (
                        <div className="flex space-x-2">
                          <Button
                            size="xs"
                            variant="ghost"
                            onClick={() => handleBlockIP(row.ipAddress)}
                            leftIcon={<Lock className="h-3 w-3" />}
                          >
                            Block
                          </Button>
                          {row.userId && (
                            <Button
                              size="xs"
                              variant="ghost"
                              onClick={() => handleLockUser(row.userId)}
                              leftIcon={<UserX className="h-3 w-3" />}
                            >
                              Lock User
                            </Button>
                          )}
                        </div>
                      ),
                      sortable: false
                    }
                  ]}
                  pagination={true}
                  itemsPerPage={10}
                />
              )}
            </div>
          )}

          {/* Failed Logins Tab */}
          {activeTab === 'failed-logins' && (
            <div className="space-y-4">
              <Table
                data={failedLogins}
                columns={[
                  {
                    key: 'timestamp',
                    header: 'Time',
                    render: (value) => new Date(value).toLocaleString()
                  },
                  {
                    key: 'username',
                    header: 'Username',
                    render: (value) => value
                  },
                  {
                    key: 'ipAddress',
                    header: 'IP Address',
                    render: (value) => <span className="font-mono text-sm">{value}</span>
                  },
                  {
                    key: 'attempts',
                    header: 'Attempts',
                    render: (value) => (
                      <span className={`font-medium ${
                        value >= 5 ? 'text-red-600' :
                        value >= 3 ? 'text-yellow-600' :
                        'text-gray-900'
                      }`}>
                        {value}
                      </span>
                    )
                  },
                  {
                    key: 'reason',
                    header: 'Reason',
                    render: (value) => value || 'Invalid credentials'
                  },
                  {
                    key: 'actions',
                    header: 'Actions',
                    render: (_, row) => (
                      <Button
                        size="xs"
                        variant="ghost"
                        onClick={() => handleBlockIP(row.ipAddress)}
                        leftIcon={<Lock className="h-3 w-3" />}
                      >
                        Block IP
                      </Button>
                    ),
                    sortable: false
                  }
                ]}
                pagination={true}
                itemsPerPage={10}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SecurityAudit;
