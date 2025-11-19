import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { billingService } from '../../services/billingService';
import Table from '../common/Table';
import Button from '../common/Button';
import Input from '../common/Input';
import DatePicker from '../common/DatePicker';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  Eye,
  Calendar,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from 'lucide-react';

const PaymentHistory = ({ patientId = null, billId = null }) => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    paymentMethod: 'all',
    dateRange: 'all',
    startDate: '',
    endDate: ''
  });
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchPayments();
    fetchStatistics();
  }, [filters, searchTerm, patientId, billId]);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      let response;
      
      const params = { 
        ...filters, 
        search: searchTerm,
        limit: 100
      };

      if (patientId) {
        response = await billingService.getPatientPayments(patientId, params);
      } else if (billId) {
        response = await billingService.getBillPayments(billId, params);
      } else if (user.role === 'PATIENT') {
        response = await billingService.getPatientPayments(user.id, params);
      } else {
        response = await billingService.getAllPayments(params);
      }
      
      setPayments(response);
    } catch (err) {
      setError('Failed to fetch payment history');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const params = { patientId, billId };
      const response = await billingService.getPaymentStatistics(params);
      setStatistics(response);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'FAILED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'REFUNDED':
        return <RefreshCw className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REFUNDED':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method.toLowerCase()) {
      case 'credit_card':
      case 'debit_card':
        return <CreditCard className="h-4 w-4" />;
      case 'cash':
        return <DollarSign className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const handleViewReceipt = (payment) => {
    // Navigate to receipt view or open modal
    console.log('View receipt for payment:', payment);
  };

  const handleRefund = async (paymentId) => {
    if (window.confirm('Are you sure you want to initiate a refund for this payment?')) {
      try {
        await billingService.initiateRefund(paymentId);
        fetchPayments();
      } catch (err) {
        console.error('Error initiating refund:', err);
      }
    }
  };

  const handleExport = async () => {
    try {
      const params = { 
        ...filters, 
        search: searchTerm,
        patientId,
        billId
      };
      await billingService.exportPayments(params);
    } catch (err) {
      console.error('Error exporting payments:', err);
    }
  };

  const getTableColumns = () => {
    const baseColumns = [
      {
        key: 'transactionId',
        header: 'Transaction ID',
        render: (value) => (
          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
            {value}
          </span>
        )
      }
    ];

    if (!patientId && user.role !== 'PATIENT') {
      baseColumns.push({
        key: 'patientName',
        header: 'Patient',
        render: (value, row) => (
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">ID: {row.patientId}</div>
          </div>
        )
      });
    }

    if (!billId) {
      baseColumns.push({
        key: 'billNumber',
        header: 'Bill Number',
        render: (value) => (
          <span className="font-mono text-sm text-blue-600">
            {value}
          </span>
        )
      });
    }

    baseColumns.push(
      {
        key: 'amount',
        header: 'Amount',
        render: (value) => (
          <span className="font-medium text-gray-900">
            ${parseFloat(value).toFixed(2)}
          </span>
        )
      },
      {
        key: 'paymentMethod',
        header: 'Payment Method',
        render: (value) => (
          <div className="flex items-center space-x-2">
            {getPaymentMethodIcon(value)}
            <span className="capitalize">{value.replace('_', ' ')}</span>
          </div>
        )
      },
      {
        key: 'paymentDate',
        header: 'Date',
        render: (value) => new Date(value).toLocaleDateString()
      },
      {
        key: 'status',
        header: 'Status',
        render: (value) => (
          <div className="flex items-center space-x-2">
            {getStatusIcon(value)}
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
              {value}
            </span>
          </div>
        )
      },
      {
        key: 'actions',
        header: 'Actions',
        render: (value, row) => (
          <div className="flex items-center space-x-2">
            <Button
              size="xs"
              variant="ghost"
              onClick={() => handleViewReceipt(row)}
              leftIcon={<Eye className="h-3 w-3" />}
            >
              Receipt
            </Button>
            
            {row.status === 'COMPLETED' && ['ADMIN', 'RECEPTIONIST'].includes(user.role) && (
              <Button
                size="xs"
                variant="ghost"
                onClick={() => handleRefund(row.id)}
                leftIcon={<RefreshCw className="h-3 w-3" />}
              >
                Refund
              </Button>
            )}
          </div>
        ),
        sortable: false
      }
    );

    return baseColumns;
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Payments</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(statistics.totalAmount || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Successful</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.successfulPayments || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.pendingPayments || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.failedPayments || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CreditCard className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
            <p className="text-gray-600 text-sm">
              Track and manage payment transactions
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          leftIcon={<Download className="h-4 w-4" />}
          onClick={handleExport}
        >
          Export History
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            placeholder="Search by transaction ID, patient name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-gray-400" />}
          />

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          <select
            value={filters.paymentMethod}
            onChange={(e) => setFilters(prev => ({ ...prev, paymentMethod: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Methods</option>
            <option value="CREDIT_CARD">Credit Card</option>
            <option value="DEBIT_CARD">Debit Card</option>
            <option value="CASH">Cash</option>
            <option value="CHECK">Check</option>
            <option value="BANK_TRANSFER">Bank Transfer</option>
            <option value="INSURANCE">Insurance</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {filters.dateRange === 'custom' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(date) => setFilters(prev => ({ ...prev, startDate: date }))}
            />
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(date) => setFilters(prev => ({ ...prev, endDate: date }))}
            />
          </div>
        )}
      </div>

      {/* Payments Table */}
      <Table
        data={payments}
        columns={getTableColumns()}
        loading={loading}
        searchable={false}
        sortable={true}
        pagination={true}
        itemsPerPage={20}
        emptyMessage="No payment history found"
        onRowClick={(payment) => handleViewReceipt(payment)}
      />
    </div>
  );
};

export default PaymentHistory;
