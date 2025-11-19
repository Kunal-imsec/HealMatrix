import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import  prescriptionService  from '../../services/prescriptionService';
import { useNavigate } from 'react-router-dom';
import Table from '../common/Table';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import PrescriptionCard from './PrescriptionCard';
import CreatePrescription from './CreatePrescription';
import { 
  Pill, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download,
  Eye,
  Edit,
  Trash2,
  Calendar,
  User,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

const PrescriptionList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    patientId: '',
    doctorId: user.role === 'DOCTOR' ? user.id : ''
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchPrescriptions();
    fetchStatistics();
  }, [filters, searchTerm]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      let response;
      
      // Role-based data fetching
      if (user.role === 'PATIENT') {
        response = await prescriptionService.getPatientPrescriptions(user.id, { ...filters, search: searchTerm });
      } else if (user.role === 'DOCTOR') {
        response = await prescriptionService.getDoctorPrescriptions(user.id, { ...filters, search: searchTerm });
      } else if (user.role === 'PHARMACIST') {
        response = await prescriptionService.getPharmacyPrescriptions({ ...filters, search: searchTerm });
      } else {
        response = await prescriptionService.getAllPrescriptions({ ...filters, search: searchTerm });
      }
      
      setPrescriptions(response);
    } catch (err) {
      setError('Failed to fetch prescriptions');
      console.error('Error fetching prescriptions:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      let response;
      if (user.role === 'PATIENT') {
        response = await prescriptionService.getPatientPrescriptionStats(user.id);
      } else if (user.role === 'DOCTOR') {
        response = await prescriptionService.getDoctorPrescriptionStats(user.id);
      } else {
        response = await prescriptionService.getPrescriptionStatistics();
      }
      setStatistics(response);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleViewPrescription = (prescription) => {
    navigate(`/prescriptions/${prescription.id}`);
  };

  const handleEditPrescription = (prescription) => {
    navigate(`/prescriptions/${prescription.id}/edit`);
  };

  const handleDeletePrescription = async (prescriptionId) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      try {
        await prescriptionService.deletePrescription(prescriptionId);
        fetchPrescriptions();
        fetchStatistics();
      } catch (err) {
        console.error('Error deleting prescription:', err);
      }
    }
  };

  const handleDispensePrescription = async (prescriptionId) => {
    try {
      await prescriptionService.dispensePrescription(prescriptionId);
      fetchPrescriptions();
      fetchStatistics();
    } catch (err) {
      console.error('Error dispensing prescription:', err);
    }
  };

  const handlePrescriptionCreated = () => {
    setShowCreateModal(false);
    fetchPrescriptions();
    fetchStatistics();
  };

  const handleExport = async () => {
    try {
      const data = await prescriptionService.exportPrescriptions(filters);
      console.log('Export prescriptions:', data);
    } catch (err) {
      console.error('Error exporting prescriptions:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'DISPENSED': return 'bg-blue-100 text-blue-800';
      case 'EXPIRED': return 'bg-red-100 text-red-800';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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
      },
      {
        key: 'patientName',
        header: 'Patient',
        render: (value, row) => (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">Age: {row.patientAge}</div>
            </div>
          </div>
        )
      }
    ];

    if (user.role !== 'DOCTOR') {
      baseColumns.push({
        key: 'doctorName',
        header: 'Doctor',
        render: (value) => (
          <div>
            <div className="font-medium text-gray-900">Dr. {value}</div>
          </div>
        )
      });
    }

    baseColumns.push(
      {
        key: 'medicationCount',
        header: 'Medications',
        render: (value, row) => (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">items</div>
          </div>
        )
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
        key: 'prescribedDate',
        header: 'Prescribed',
        render: (value) => new Date(value).toLocaleDateString()
      },
      {
        key: 'expiryDate',
        header: 'Expires',
        render: (value) => {
          const isExpired = new Date(value) < new Date();
          return (
            <div className={`text-sm ${isExpired ? 'text-red-600 font-medium' : 'text-gray-600'}`}>
              {new Date(value).toLocaleDateString()}
            </div>
          );
        }
      }
    );

    // Add actions column
    baseColumns.push({
      key: 'actions',
      header: 'Actions',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => handleViewPrescription(row)}
            title="View Details"
          >
            <Eye className="h-3 w-3" />
          </Button>
          
          {user.role === 'DOCTOR' && row.status === 'ACTIVE' && (
            <Button
              size="xs"
              variant="ghost"
              onClick={() => handleEditPrescription(row)}
              title="Edit Prescription"
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}

          {user.role === 'PHARMACIST' && row.status === 'ACTIVE' && (
            <Button
              size="xs"
              variant="primary"
              onClick={() => handleDispensePrescription(row.id)}
              title="Dispense Medication"
            >
              <CheckCircle className="h-3 w-3" />
            </Button>
          )}
          
          {(['ADMIN', 'DOCTOR'].includes(user.role) && ['ACTIVE', 'PENDING'].includes(row.status)) && (
            <Button
              size="xs"
              variant="ghost"
              className="text-red-600 hover:text-red-700"
              onClick={() => handleDeletePrescription(row.id)}
              title="Cancel Prescription"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      ),
      sortable: false
    });

    return baseColumns;
  };

  const canCreatePrescription = ['ADMIN', 'DOCTOR'].includes(user.role);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Pill className="h-6 w-6 text-blue-600" />
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
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Prescriptions</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.activePrescriptions || 0}
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
              <p className="text-sm font-medium text-gray-600">Pending Dispensing</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.pendingPrescriptions || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Expiring Soon</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.expiringSoon || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Pill className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.role === 'PATIENT' ? 'My Prescriptions' : 
               user.role === 'DOCTOR' ? 'My Prescriptions' :
               user.role === 'PHARMACIST' ? 'Pharmacy Queue' :
               'Prescription Management'}
            </h1>
            <p className="text-gray-600 text-sm">
              {prescriptions.length} prescriptions found
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>

          {/* Action Buttons */}
          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={handleExport}
          >
            Export
          </Button>

          {canCreatePrescription && (
            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setShowCreateModal(true)}
            >
              New Prescription
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Search prescriptions..."
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
            <option value="ACTIVE">Active</option>
            <option value="PENDING">Pending</option>
            <option value="DISPENSED">Dispensed</option>
            <option value="EXPIRED">Expired</option>
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

          {user.role !== 'PATIENT' && user.role !== 'DOCTOR' && (
            <Input
              placeholder="Patient ID"
              value={filters.patientId}
              onChange={(e) => setFilters(prev => ({ ...prev, patientId: e.target.value }))}
            />
          )}
        </div>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <Table
          data={prescriptions}
          columns={getTableColumns()}
          loading={loading}
          searchable={false}
          sortable={true}
          pagination={true}
          itemsPerPage={15}
          onRowClick={handleViewPrescription}
          emptyMessage="No prescriptions found matching your criteria"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64"></div>
              </div>
            ))
          ) : prescriptions.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Pill className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No prescriptions found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or filters
              </p>
              {canCreatePrescription && (
                <div className="mt-4">
                  <Button
                    variant="primary"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => setShowCreateModal(true)}
                  >
                    Create First Prescription
                  </Button>
                </div>
              )}
            </div>
          ) : (
            prescriptions.map((prescription) => (
              <PrescriptionCard
                key={prescription.id}
                prescription={prescription}
                onView={() => handleViewPrescription(prescription)}
                onEdit={canCreatePrescription ? () => handleEditPrescription(prescription) : undefined}
                onDelete={(['ADMIN', 'DOCTOR'].includes(user.role)) ? () => handleDeletePrescription(prescription.id) : undefined}
                onDispense={user.role === 'PHARMACIST' ? () => handleDispensePrescription(prescription.id) : undefined}
                userRole={user.role}
              />
            ))
          )}
        </div>
      )}

      {/* Create Prescription Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Prescription"
          size="xl"
        >
          <CreatePrescription
            onSuccess={handlePrescriptionCreated}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default PrescriptionList;
