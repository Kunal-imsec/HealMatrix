import React, { useState, useEffect } from 'react';
import { departmentService } from '../../services/departmentService';
import ChartCard from '../dashboards/components/ChartCard';
import DatePicker from '../common/DatePicker';
import Button from '../common/Button';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users, 
  Calendar,
  DollarSign,
  Activity,
  Clock,
  Download,
  RefreshCw
} from 'lucide-react';

const DepartmentStats = ({ departmentId, departmentName }) => {
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  });
  const [timeframe, setTimeframe] = useState('month'); // 'week', 'month', 'quarter', 'year'

  useEffect(() => {
    fetchStatistics();
  }, [departmentId, dateRange, timeframe]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockStats = {
        overview: {
          totalPatients: 1250,
          totalRevenue: 485000,
          averageStayDuration: 3.2,
          patientSatisfactionScore: 4.6,
          occupancyRate: 85.5,
          staffUtilization: 78.2,
          monthlyGrowth: 12.5,
          revenueGrowth: 8.3
        },
        patientStats: {
          dailyAdmissions: [
            { date: '2025-10-15', count: 15 },
            { date: '2025-10-16', count: 18 },
            { date: '2025-10-17', count: 12 },
            { date: '2025-10-18', count: 20 },
            { date: '2025-10-19', count: 16 },
            { date: '2025-10-20', count: 14 },
            { date: '2025-10-21', count: 22 }
          ],
          monthlyTrend: [
            { month: 'Jan', patients: 1100, revenue: 425000 },
            { month: 'Feb', patients: 1080, revenue: 438000 },
            { month: 'Mar', patients: 1150, revenue: 465000 },
            { month: 'Apr', patients: 1250, revenue: 485000 }
          ]
        },
        staffPerformance: {
          totalStaff: 35,
          doctorsCount: 12,
          nursesCount: 18,
          techniciansCount: 5,
          averageWorkload: 7.8,
          staffSatisfaction: 4.2
        },
        operationalMetrics: {
          averageWaitTime: 25, // minutes
          treatmentSuccessRate: 94.5,
          readmissionRate: 8.2,
          emergencyResponseTime: 4.5, // minutes
          bedTurnoverRate: 2.1
        },
        financialMetrics: {
          totalRevenue: 485000,
          operationalCosts: 320000,
          netProfit: 165000,
          profitMargin: 34.0,
          costPerPatient: 256,
          revenuePerBed: 12125
        }
      };

      setStatistics(mockStats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const params = { 
        departmentId, 
        ...dateRange,
        timeframe
      };
      // await departmentService.exportStatistics(params);
      console.log('Exporting statistics...', params);
    } catch (err) {
      console.error('Error exporting statistics:', err);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatPercentage = (value) => {
    return `${value.toFixed(1)}%`;
  };

  const getTrendIcon = (growth) => {
    if (growth > 0) return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (growth < 0) return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <div className="h-4 w-4" />;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Department Statistics</h3>
          <p className="text-gray-600">{departmentName} - Performance Analytics</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            onClick={fetchStatistics}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh
          </Button>
          
          <Button
            variant="outline"
            onClick={handleExport}
            leftIcon={<Download className="h-4 w-4" />}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <DatePicker
              label="Start Date"
              value={dateRange.startDate}
              onChange={(date) => setDateRange(prev => ({ ...prev, startDate: date }))}
            />
            
            <DatePicker
              label="End Date"
              value={dateRange.endDate}
              onChange={(date) => setDateRange(prev => ({ ...prev, endDate: date }))}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Timeframe
              </label>
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.overview?.totalPatients?.toLocaleString() || 0}
              </p>
              <div className="flex items-center mt-1">
                {getTrendIcon(statistics.overview?.monthlyGrowth || 0)}
                <span className="text-xs text-gray-600 ml-1">
                  {formatPercentage(statistics.overview?.monthlyGrowth || 0)} from last month
                </span>
              </div>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(statistics.overview?.totalRevenue || 0)}
              </p>
              <div className="flex items-center mt-1">
                {getTrendIcon(statistics.overview?.revenueGrowth || 0)}
                <span className="text-xs text-gray-600 ml-1">
                  {formatPercentage(statistics.overview?.revenueGrowth || 0)} from last month
                </span>
              </div>
            </div>
            <DollarSign className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(statistics.overview?.occupancyRate || 0)}
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Avg stay: {statistics.overview?.averageStayDuration || 0} days
              </p>
            </div>
            <Activity className="h-8 w-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Patient Satisfaction</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.overview?.patientSatisfactionScore || 0}/5.0
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Staff utilization: {formatPercentage(statistics.overview?.staffUtilization || 0)}
              </p>
            </div>
            <Calendar className="h-8 w-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Patient Admissions */}
        <ChartCard
          title="Daily Patient Admissions"
          subtitle="Patient intake over the last 7 days"
          loading={loading}
        >
          <div className="space-y-3">
            {statistics.patientStats?.dailyAdmissions?.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(day.count / 25) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-8 text-right">
                    {day.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Monthly Revenue Trend */}
        <ChartCard
          title="Monthly Revenue Trend"
          subtitle="Revenue performance over time"
          loading={loading}
        >
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <div className="text-center text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>Revenue trend chart would be displayed here</p>
              <p className="text-sm mt-2">Integration with charting library needed</p>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Detailed Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Staff Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Staff Performance</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Staff</span>
              <span className="font-medium text-gray-900">
                {statistics.staffPerformance?.totalStaff || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Doctors</span>
              <span className="font-medium text-gray-900">
                {statistics.staffPerformance?.doctorsCount || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Nurses</span>
              <span className="font-medium text-gray-900">
                {statistics.staffPerformance?.nursesCount || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Technicians</span>
              <span className="font-medium text-gray-900">
                {statistics.staffPerformance?.techniciansCount || 0}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Avg Workload</span>
                <span className="font-medium text-gray-900">
                  {statistics.staffPerformance?.averageWorkload || 0}/10
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">Staff Satisfaction</span>
                <span className="font-medium text-gray-900">
                  {statistics.staffPerformance?.staffSatisfaction || 0}/5.0
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Operational Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Operational Metrics</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Avg Wait Time</span>
              </div>
              <span className="font-medium text-gray-900">
                {statistics.operationalMetrics?.averageWaitTime || 0} min
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Success Rate</span>
              </div>
              <span className="font-medium text-green-600">
                {formatPercentage(statistics.operationalMetrics?.treatmentSuccessRate || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Readmission Rate</span>
              </div>
              <span className="font-medium text-yellow-600">
                {formatPercentage(statistics.operationalMetrics?.readmissionRate || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Emergency Response</span>
              </div>
              <span className="font-medium text-blue-600">
                {statistics.operationalMetrics?.emergencyResponseTime || 0} min
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">Bed Turnover</span>
              </div>
              <span className="font-medium text-gray-900">
                {statistics.operationalMetrics?.bedTurnoverRate || 0}/day
              </span>
            </div>
          </div>
        </div>

        {/* Financial Metrics */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Financial Performance</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total Revenue</span>
              <span className="font-medium text-green-600">
                {formatCurrency(statistics.financialMetrics?.totalRevenue || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Operational Costs</span>
              <span className="font-medium text-red-600">
                {formatCurrency(statistics.financialMetrics?.operationalCosts || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Net Profit</span>
              <span className="font-medium text-blue-600">
                {formatCurrency(statistics.financialMetrics?.netProfit || 0)}
              </span>
            </div>
            <div className="pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Profit Margin</span>
                <span className="font-medium text-gray-900">
                  {formatPercentage(statistics.financialMetrics?.profitMargin || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">Cost per Patient</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(statistics.financialMetrics?.costPerPatient || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm text-gray-600">Revenue per Bed</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(statistics.financialMetrics?.revenuePerBed || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentStats;
