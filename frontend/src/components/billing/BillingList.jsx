import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { billingService } from '../../services/billingService';
import { useNavigate } from 'react-router-dom';
import Table from '../common/Table';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  Download,
  Eye,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Clock,
  DollarSign,
  FileText,
  Calendar
} from 'lucide-react';

const BillingList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    paymentStatus: 'all',
    dateRange: 'all',
    patientId: ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchBills();
    fetchStatistics();
  }, [filters, searchTerm]);

  const fetchBills = async () => {
    try {
      setLoading(true);
      let response;
      
      // Role-based data fetching
      if (user.role === 'PATIENT') {
        response = await billingService.getPatientBills(user.id, { ...filters, search: searchTerm });
      } else if (user.role === 'DOCTOR') {
        response = await billingService.getDoctorBills(user.id, { ...filters, search: searchTerm });
      } else {
        response = await billingService.getAllBills({ ...filters, search: searchTerm });
      }
      
      setBills(response);
    } catch (err) {
      setError('Failed to fetch bills');
      console.error('Error fetching bills:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      let response;
      if (user.role === 'PATIENT') {
        response = await billingService.getPatientBillingStats(user.id);
      } else {
        response = await billingService.getBillingStatistics();
      }
      setStatistics(response);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleViewBill = (bill) => {
    navigate(`/billing/${bill.id}`);
  };

  const handleEditBill = (bill) => {
    navigate(`/billing/${bill.id}/edit`);
  };

  const handleDeleteBill = async (billId) => {
    if (window.confirm('Are you sure you want to delete this bill?')) {
      try {
        await billingService.deleteBill(billId);
        fetchBills();
        fetchStatistics();
      } catch (err) {
        console.error('Error deleting bill:', err);
      }
    }
  };

  const handlePayBill = (bill) => {
    navigate(`/billing/${bill.id}/payment`);
  };

  const handleExport = async () => {
    try {
      const data = await billingService.exportBills(filters);
      console.log('Export bills:', data);
    } catch (err) {
      console.error('Error exporting bills:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return 'bg-green-100 text-green-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'OVERDUE': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      case 'PARTIAL': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTableColumns = () => {
    const baseColumns = [
      {
        key: 'billNumber',
        header: 'Bill Number',
        render: (value) => (
          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
            {value}
          </span>
        )
      },
      {
        key: 'patientName',
        header: 'Patient',
        render: (value, row) => (
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">ID: {row.patientId}</div>
          </div>
        )
      },
      {
        key: 'serviceType',
        header: 'Service',
        render: (value) => (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {value}
          </span>
        )
      },
      {
        key: 'totalAmount',
        header: 'Total Amount',
        render: (value) => (
          <span className="font-semibold text-gray-900">
            ${parseFloat(value).toFixed(2)}
          </span>
        )
      },
      {
        key: 'paidAmount',
        header: 'Paid Amount',
        render: (value) => (
          <span className="text-green-600 font-medium">
            ${parseFloat(value || 0).toFixed(2)}
          </span>
        )
      },
      {
        key: 'dueAmount',
        header: 'Due Amount',
        render: (value, row) => {
          const due = parseFloat(row.totalAmount) - parseFloat(row.paidAmount || 0);
          return (
            <span className={`font-medium ${due > 0 ? 'text-red-600' : 'text-green-600'}`}>
              ${due.toFixed(2)}
            </span>
          );
        }
      },
      {
        key: 'status',
        header: 'Status',
        render: (value) => (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
            {value}
          </span>
        )
      },
      {
        key: 'billDate',
        header: 'Bill Date',
        render: (value) => new Date(value).toLocaleDateString()
      },
      {
        key: 'dueDate',
        header: 'Due Date',
        render: (value) => (
          <div className={`text-sm ${
            new Date(value) < new Date() ? 'text-red-600 font-medium' : 'text-gray-600'
          }`}>
            {new Date(value).toLocaleDateString()}
          </div>
        )
      }
    ];

    // Add actions column based on user role
    if (user.role !== 'PATIENT' || user.role === 'PATIENT') {
      baseColumns.push({
        key: 'actions',
        header: 'Actions',
        render: (value, row) => (
          <div className="flex items-center space-x-2">
            <Button
              size="xs"
              variant="ghost"
              onClick={() => handleViewBill(row)}
              title="View Details"
            >
              <Eye className="h-3 w-3" />
            </Button>
            
            {row.status === 'PENDING' && user.role === 'PATIENT' && (
              <Button
                size="xs"
                variant="primary"
                onClick={() => handlePayBill(row)}
                title="Pay Bill"
              >
                <CreditCard className="h-3 w-3" />
              </Button>
            )}
            
            {['ADMIN', 'RECEPTIONIST'].includes(user.role) && (
              <>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={() => handleEditBill(row)}
                  title="Edit Bill"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                
                {user.role === 'ADMIN' && (
                  <Button
                    size="xs"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteBill(row.id)}
                    title="Delete Bill"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </>
            )}
          </div>
        ),
        sortable: false
      });
    }

    return baseColumns;
  };

  const canCreateBill = ['ADMIN', 'RECEPTIONIST', 'DOCTOR'].includes(user.role);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(statistics.totalRevenue || 0).toFixed(2)}
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
              <p className="text-sm font-medium text-gray-600">Pending Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                ${(statistics.pendingAmount || 0).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Overdue Bills</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.overdueBills || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Bills</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.totalBills || 0}
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
            <h1 className="text-2xl font-bold text-gray-900">
              {user.role === 'PATIENT' ? 'My Bills' : 'Billing Management'}
            </h1>
            <p className="text-gray-600 text-sm">
              {bills.length} bills total
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={handleExport}
          >
            Export
          </Button>

          {canCreateBill && (
            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setShowCreateModal(true)}
            >
              Create Bill
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search bills..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4 text-gray-400" />}
            />
          </div>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="OVERDUE">Overdue</option>
            <option value="PARTIAL">Partial</option>
            <option value="CANCELLED">Cancelled</option>
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
          </select>

          {user.role !== 'PATIENT' && (
            <Input
              placeholder="Patient ID"
              value={filters.patientId}
              onChange={(e) => setFilters(prev => ({ ...prev, patientId: e.target.value }))}
            />
          )}
        </div>
      </div>

      {/* Bills Table */}
      <Table
        data={bills}
        columns={getTableColumns()}
        loading={loading}
        searchable={false}
        sortable={true}
        pagination={true}
        itemsPerPage={15}
        onRowClick={handleViewBill}
        emptyMessage="No bills found matching your criteria"
      />

      {/* Create Bill Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Bill"
          size="lg"
        >
          <div className="text-center py-8">
            <p className="text-gray-600">Bill creation form will be implemented here.</p>
            <div className="mt-4">
              <Button onClick={() => setShowCreateModal(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BillingList;
