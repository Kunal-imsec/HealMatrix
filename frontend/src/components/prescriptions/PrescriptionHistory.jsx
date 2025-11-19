import React, { useState, useEffect } from 'react';
import { prescriptionService } from '../../services/prescriptionService';
import { useAuth } from '../../context/AuthContext';
import Table from '../common/Table';
import Button from '../common/Button';
import Input from '../common/Input';
import { 
  FileText, 
  Search, 
  Download, 
  Eye,
  Calendar,
  User,
  Pill,
  Filter
} from 'lucide-react';

const PrescriptionHistory = ({ patientId = null }) => {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    doctor: 'all'
  });
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchPrescriptions();
    fetchStatistics();
  }, [filters, searchTerm, patientId]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      let response;
      
      const params = { 
        ...filters, 
        search: searchTerm,
        limit: 100
      };

      if (patientId) {
        response = await prescriptionService.getPatientPrescriptions(patientId, params);
      } else if (user.role === 'PATIENT') {
        response = await prescriptionService.getPatientPrescriptions(user.id, params);
      } else if (user.role === 'DOCTOR') {
        response = await prescriptionService.getDoctorPrescriptions(user.id, params);
      } else {
        response = await prescriptionService.getAllPrescriptions(params);
      }
      
      setPrescriptions(response);
    } catch (err) {
      console.error('Error fetching prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const params = { patientId };
      const response = await prescriptionService.getPrescriptionStatistics(params);
      setStatistics(response);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'EXPIRED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewPrescription = (prescription) => {
    // Navigate to prescription details
    console.log('View prescription:', prescription);
  };

  const handleExport = async () => {
    try {
      const params = { 
        ...filters, 
        search: searchTerm,
        patientId
      };
      await prescriptionService.exportPrescriptions(params);
    } catch (err) {
      console.error('Error exporting prescriptions:', err);
    }
  };

  const getTableColumns = () => {
    const baseColumns = [
      {
        key: 'prescriptionNumber',
        header: 'Prescription #',
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

    if (user.role !== 'DOCTOR') {
      baseColumns.push({
        key: 'doctorName',
        header: 'Doctor',
        render: (value) => (
          <span className="text-gray-900">Dr. {value}</span>
        )
      });
    }

    baseColumns.push(
      {
        key: 'diagnosis',
        header: 'Diagnosis',
        render: (value) => (
          <span className="text-sm text-gray-600 line-clamp-2" title={value}>
            {value || 'Not specified'}
          </span>
        )
      },
      {
        key: 'medicationCount',
        header: 'Medications',
        render: (value, row) => (
          <div className="flex items-center space-x-2">
            <Pill className="h-4 w-4 text-gray-400" />
            <span className="font-medium text-gray-900">
              {row.medications?.length || 0}
            </span>
          </div>
        )
      },
      {
        key: 'prescribedDate',
        header: 'Date',
        render: (value) => new Date(value).toLocaleDateString()
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
        key: 'actions',
        header: 'Actions',
        render: (value, row) => (
          <div className="flex items-center space-x-2">
            <Button
              size="xs"
              variant="ghost"
              onClick={() => handleViewPrescription(row)}
              leftIcon={<Eye className="h-3 w-3" />}
            >
              View
            </Button>
            
            <Button
              size="xs"
              variant="ghost"
              leftIcon={<Download className="h-3 w-3" />}
            >
              Download
            </Button>
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
            <div className="p-2 bg-blue-100 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Prescriptions</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.totalPrescriptions || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Pill className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.activePrescriptions || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <User className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Unique Doctors</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.uniqueDoctors || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.monthlyPrescriptions || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Prescription History</h1>
            <p className="text-gray-600 text-sm">
              View and manage prescription records
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search prescriptions..."
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
            <option value="ACTIVE">Active</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="EXPIRED">Expired</option>
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
            <option value="year">This Year</option>
          </select>

          {user.role !== 'DOCTOR' && (
            <select
              value={filters.doctor}
              onChange={(e) => setFilters(prev => ({ ...prev, doctor: e.target.value }))}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Doctors</option>
              {/* Add doctor options dynamically */}
            </select>
          )}
        </div>
      </div>

      {/* Prescriptions Table */}
      <Table
        data={prescriptions}
        columns={getTableColumns()}
        loading={loading}
        searchable={false}
        sortable={true}
        pagination={true}
        itemsPerPage={20}
        emptyMessage="No prescription history found"
        onRowClick={handleViewPrescription}
      />
    </div>
  );
};

export default PrescriptionHistory;
