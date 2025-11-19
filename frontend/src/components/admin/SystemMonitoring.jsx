import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../common/Button';
import { 
  Activity, 
  Cpu,
  HardDrive,
  Database,
  Users,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Server,
  Zap,
  Clock,
  Download
} from 'lucide-react';

const SystemMonitoring = () => {
  const [metrics, setMetrics] = useState({});
  const [services, setServices] = useState([]);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    fetchMetrics();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(fetchMetrics, 10000); // Refresh every 10 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const fetchMetrics = async () => {
    try {
      const [metricsData, servicesData, logsData] = await Promise.all([
        adminService.getSystemMetrics(),
        adminService.getServiceStatus(),
        adminService.getSystemLogs({ limit: 10 })
      ]);

      setMetrics(metricsData);
      setServices(servicesData);
      setLogs(logsData);
    } catch (err) {
      console.error('Error fetching metrics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportMetrics = async () => {
    try {
      await adminService.exportMetrics();
    } catch (err) {
      console.error('Error exporting metrics:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'HEALTHY':
      case 'RUNNING':
        return 'text-green-600 bg-green-100';
      case 'WARNING':
        return 'text-yellow-600 bg-yellow-100';
      case 'ERROR':
      case 'STOPPED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = (status) => {
    switch (status) {
      case 'HEALTHY':
      case 'RUNNING':
        return <CheckCircle className="h-5 w-5" />;
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5" />;
      case 'ERROR':
      case 'STOPPED':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const formatUptime = (seconds) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

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
            <Activity className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">System Monitoring</h3>
              <p className="text-gray-600">Real-time system health and performance</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-700">Auto-refresh</span>
            </label>
            
            <Button
              size="sm"
              variant="outline"
              onClick={fetchMetrics}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Refresh
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={handleExportMetrics}
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* CPU Usage */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Cpu className="h-8 w-8 text-blue-600" />
            <div className={`flex items-center space-x-1 ${
              metrics.cpu?.usage > 80 ? 'text-red-600' : 
              metrics.cpu?.usage > 60 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {metrics.cpu?.trend === 'up' ? 
                <TrendingUp className="h-4 w-4" /> : 
                <TrendingDown className="h-4 w-4" />
              }
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">CPU Usage</h4>
            <p className="text-3xl font-bold text-gray-900">{metrics.cpu?.usage || 0}%</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  metrics.cpu?.usage > 80 ? 'bg-red-500' : 
                  metrics.cpu?.usage > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${metrics.cpu?.usage || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Memory Usage */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <HardDrive className="h-8 w-8 text-green-600" />
            <div className={`flex items-center space-x-1 ${
              metrics.memory?.usagePercent > 80 ? 'text-red-600' : 
              metrics.memory?.usagePercent > 60 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {metrics.memory?.trend === 'up' ? 
                <TrendingUp className="h-4 w-4" /> : 
                <TrendingDown className="h-4 w-4" />
              }
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Memory</h4>
            <p className="text-3xl font-bold text-gray-900">
              {metrics.memory?.usagePercent || 0}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatBytes(metrics.memory?.used || 0)} / {formatBytes(metrics.memory?.total || 0)}
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  metrics.memory?.usagePercent > 80 ? 'bg-red-500' : 
                  metrics.memory?.usagePercent > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${metrics.memory?.usagePercent || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Disk Usage */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Database className="h-8 w-8 text-purple-600" />
            <div className={`flex items-center space-x-1 ${
              metrics.disk?.usagePercent > 80 ? 'text-red-600' : 
              metrics.disk?.usagePercent > 60 ? 'text-yellow-600' : 'text-green-600'
            }`}>
              {metrics.disk?.trend === 'up' ? 
                <TrendingUp className="h-4 w-4" /> : 
                <TrendingDown className="h-4 w-4" />
              }
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Disk Space</h4>
            <p className="text-3xl font-bold text-gray-900">
              {metrics.disk?.usagePercent || 0}%
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {formatBytes(metrics.disk?.used || 0)} / {formatBytes(metrics.disk?.total || 0)}
            </p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  metrics.disk?.usagePercent > 80 ? 'bg-red-500' : 
                  metrics.disk?.usagePercent > 60 ? 'bg-yellow-500' : 'bg-green-500'
                }`}
                style={{ width: `${metrics.disk?.usagePercent || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-orange-600" />
            <div className="flex items-center space-x-1 text-green-600">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-600 mb-1">Active Users</h4>
            <p className="text-3xl font-bold text-gray-900">{metrics.activeUsers || 0}</p>
            <p className="text-xs text-gray-500 mt-1">
              {metrics.totalSessions || 0} active sessions
            </p>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Server className="h-5 w-5 text-gray-400" />
            <h4 className="font-medium text-gray-900">System Info</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">OS:</span>
              <span className="font-medium text-gray-900">{metrics.system?.os}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform:</span>
              <span className="font-medium text-gray-900">{metrics.system?.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="font-medium text-gray-900">{metrics.system?.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Uptime:</span>
              <span className="font-medium text-gray-900">
                {formatUptime(metrics.system?.uptime || 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="h-5 w-5 text-gray-400" />
            <h4 className="font-medium text-gray-900">Performance</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Requests/min:</span>
              <span className="font-medium text-gray-900">{metrics.performance?.requestsPerMin || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Avg Response:</span>
              <span className="font-medium text-gray-900">{metrics.performance?.avgResponseTime || 0}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Error Rate:</span>
              <span className="font-medium text-gray-900">{metrics.performance?.errorRate || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Queue Size:</span>
              <span className="font-medium text-gray-900">{metrics.performance?.queueSize || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Database className="h-5 w-5 text-gray-400" />
            <h4 className="font-medium text-gray-900">Database</h4>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Connections:</span>
              <span className="font-medium text-gray-900">{metrics.database?.connections || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Queries/sec:</span>
              <span className="font-medium text-gray-900">{metrics.database?.queriesPerSec || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Cache Hit:</span>
              <span className="font-medium text-gray-900">{metrics.database?.cacheHitRate || 0}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Size:</span>
              <span className="font-medium text-gray-900">
                {formatBytes(metrics.database?.size || 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Services Status */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Services Status</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map((service, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-900">{service.name}</span>
                <div className={`p-1 rounded ${getStatusColor(service.status)}`}>
                  {getHealthIcon(service.status)}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <div className="flex items-center space-x-1 mb-1">
                  <Clock className="h-3 w-3" />
                  <span>Uptime: {formatUptime(service.uptime || 0)}</span>
                </div>
                {service.responseTime && (
                  <p className="text-xs">Response: {service.responseTime}ms</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Logs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Recent System Logs</h4>
        
        <div className="space-y-2">
          {logs.map((log, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded">
              <div className={`mt-0.5 ${
                log.level === 'ERROR' ? 'text-red-600' :
                log.level === 'WARNING' ? 'text-yellow-600' :
                log.level === 'INFO' ? 'text-blue-600' : 'text-gray-600'
              }`}>
                {log.level === 'ERROR' ? <AlertTriangle className="h-4 w-4" /> :
                 log.level === 'WARNING' ? <AlertTriangle className="h-4 w-4" /> :
                 <CheckCircle className="h-4 w-4" />}
              </div>
              
              <div className="flex-1">
                <p className="text-sm text-gray-900">{log.message}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(log.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SystemMonitoring;
