import React, { useState, useEffect } from 'react';
import { billingService } from '../../services/billingService';
import Button from '../common/Button';
import DatePicker from '../common/DatePicker';
import ChartCard from '../dashboards/components/ChartCard';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  CreditCard,
  Filter,
  RefreshCw
} from 'lucide-react';

const BillingReport = () => {
  const [reportData, setReportData] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
    department: 'all',
    paymentStatus: 'all',
    reportType: 'summary'
  });

  useEffect(() => {
    fetchReportData();
  }, [filters]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockData = {
        summary: {
          totalRevenue: 125000,
          totalBills: 450,
          paidBills: 380,
          unpaidBills: 70,
          averageBillAmount: 278,
          collectionRate: 84.4,
          previousMonthRevenue: 118000,
          revenueGrowth: 5.9
        },
        departmentBreakdown: [
          { department: 'Cardiology', revenue: 35000, bills: 125, avgAmount: 280 },
          { department: 'Orthopedics', revenue: 28000, bills: 95, avgAmount: 295 },
          { department: 'Emergency', revenue: 22000, bills: 110, avgAmount: 200 },
          { department: 'Pediatrics', revenue: 18000, bills: 85, avgAmount: 212 },
          { department: 'General Medicine', revenue: 22000, bills: 35, avgAmount: 629 }
        ],
        paymentMethods: [
          { method: 'Insurance', amount: 65000, percentage: 52 },
          { method: 'Credit Card', amount: 32500, percentage: 26 },
          { method: 'Cash', amount: 18750, percentage: 15 },
          { method: 'Bank Transfer', amount: 8750, percentage: 7 }
        ],
        monthlyTrend: [
          { month: 'Jan', revenue: 105000, bills: 380 },
          { month: 'Feb', revenue: 112000, bills: 420 },
          { month: 'Mar', revenue: 118000, bills: 445 },
          { month: 'Apr', revenue: 125000, bills: 450 }
        ],
        agingReport: [
          { period: '0-30 days', amount: 45000, count: 180 },
          { period: '31-60 days', amount: 15000, count: 45 },
          { period: '61-90 days', amount: 8000, count: 20 },
          { period: '90+ days', amount: 2000, count: 5 }
        ]
      };

      setReportData(mockData);
    } catch (err) {
      console.error('Error fetching report data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleExport = async (format) => {
    try {
      const params = { ...filters, format };
      await billingService.exportBillingReport(params);
    } catch (err) {
      console.error('Error exporting report:', err);
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

  if (loading) {
    return (
      <div className="space-y-6">
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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Billing Reports</h3>
              <p className="text-gray-600">Comprehensive billing analytics and insights</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => fetchReportData()}
              leftIcon={<RefreshCw className="h-4 w-4" />}
            >
              Refresh
            </Button>
            
            <div className="flex items-center space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExport('pdf')}
                leftIcon={<Download className="h-4 w-4" />}
              >
                PDF
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleExport('excel')}
                leftIcon={<Download className="h-4 w-4" />}
              >
                Excel
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <DatePicker
            label="Start Date"
            value={filters.startDate}
            onChange={(date) => handleFilterChange('startDate', date)}
          />
          
          <DatePicker
            label="End Date"
            value={filters.endDate}
            onChange={(date) => handleFilterChange('endDate', date)}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Departments</option>
              <option value="cardiology">Cardiology</option>
              <option value="orthopedics">Orthopedics</option>
              <option value="emergency">Emergency</option>
              <option value="pediatrics">Pediatrics</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
            <select
              value={filters.paymentStatus}
              onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="unpaid">Unpaid</option>
              <option value="partial">Partially Paid</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={filters.reportType}
              onChange={(e) => handleFilterChange('reportType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="summary">Summary</option>
              <option value="detailed">Detailed</option>
              <option value="aging">Aging Report</option>
              <option value="payment_methods">Payment Methods</option>
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(reportData.summary?.totalRevenue || 0)}
              </p>
              <div className="flex items-center mt-1">
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-xs text-green-600">
                  {formatPercentage(reportData.summary?.revenueGrowth || 0)} from last month
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bills</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.summary?.totalBills || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Avg: {formatCurrency(reportData.summary?.averageBillAmount || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CreditCard className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Collection Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatPercentage(reportData.summary?.collectionRate || 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {reportData.summary?.paidBills || 0} of {reportData.summary?.totalBills || 0} paid
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <Calendar className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unpaid Bills</p>
              <p className="text-2xl font-bold text-gray-900">
                {reportData.summary?.unpaidBills || 0}
              </p>
              <p className="text-xs text-red-600 mt-1">
                Requires follow-up
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <ChartCard
          title="Revenue Trend"
          subtitle="Monthly revenue over time"
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

        {/* Payment Methods */}
        <ChartCard
          title="Payment Methods"
          subtitle="Distribution of payment methods"
          loading={loading}
        >
          <div className="space-y-3">
            {reportData.paymentMethods?.map((method, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-blue-500 rounded" style={{
                    backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                  }}></div>
                  <span className="text-sm font-medium text-gray-900">{method.method}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCurrency(method.amount)}
                  </div>
                  <div className="text-xs text-gray-500">
                    {method.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Department Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Breakdown</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Department</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Revenue</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Bills</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">Avg Amount</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">% of Total</th>
              </tr>
            </thead>
            <tbody>
              {reportData.departmentBreakdown?.map((dept, index) => {
                const percentage = (dept.revenue / reportData.summary.totalRevenue) * 100;
                return (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{dept.department}</td>
                    <td className="text-right py-3 px-4 text-gray-900">
                      {formatCurrency(dept.revenue)}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900">{dept.bills}</td>
                    <td className="text-right py-3 px-4 text-gray-900">
                      {formatCurrency(dept.avgAmount)}
                    </td>
                    <td className="text-right py-3 px-4 text-gray-900">
                      {formatPercentage(percentage)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Aging Report */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Accounts Receivable Aging</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {reportData.agingReport?.map((period, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-600">{period.period}</p>
                <p className="text-xl font-bold text-gray-900 mt-1">
                  {formatCurrency(period.amount)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {period.count} bills
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingReport;
