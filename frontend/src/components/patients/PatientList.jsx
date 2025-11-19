import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { patientService } from '../../services/patientService';
import { useNavigate } from 'react-router-dom';
import Table from '../common/Table';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import PatientCard from './PatientCard';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Download,
  UserPlus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';

const PatientList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'grid'
  const [filters, setFilters] = useState({
    status: 'all',
    gender: 'all',
    ageRange: 'all',
    department: 'all'
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [departments, setDepartments] = useState([]);

  useEffect(() => {
    fetchPatients();
    fetchDepartments();
  }, [filters, searchTerm]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      let response;
      
      // Role-based data fetching
      if (user.role === 'DOCTOR') {
        response = await patientService.getDoctorPatients(user.id, { ...filters, search: searchTerm });
      } else if (user.role === 'NURSE') {
        response = await patientService.getWardPatients(user.wardId, { ...filters, search: searchTerm });
      } else {
        response = await patientService.getAllPatients({ ...filters, search: searchTerm });
      }
      
      setPatients(response);
    } catch (err) {
      setError('Failed to fetch patients');
      console.error('Error fetching patients:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await patientService.getDepartments();
      setDepartments(response);
    } catch (err) {
      console.error('Error fetching departments:', err);
    }
  };

  const handleViewPatient = (patient) => {
    navigate(`/patients/${patient.id}`);
  };

  const handleEditPatient = (patient) => {
    navigate(`/patients/${patient.id}/edit`);
  };

  const handleDeletePatient = async (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
        await patientService.deletePatient(patientId);
        fetchPatients();
      } catch (err) {
        console.error('Error deleting patient:', err);
      }
    }
  };

  const handleExport = async () => {
    try {
      const data = await patientService.exportPatients(filters);
      // Handle export logic
      console.log('Export patients:', data);
    } catch (err) {
      console.error('Error exporting patients:', err);
    }
  };

  const getTableColumns = () => {
    const baseColumns = [
      {
        key: 'patientId',
        header: 'Patient ID',
        render: (value) => (
          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
            {value}
          </span>
        )
      },
      {
        key: 'fullName',
        header: 'Name',
        render: (value, row) => (
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-600">
                {row.firstName?.[0]}{row.lastName?.[0]}
              </span>
            </div>
            <div>
              <div className="font-medium text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{row.email}</div>
            </div>
          </div>
        )
      },
      {
        key: 'age',
        header: 'Age',
        render: (value, row) => `${value} years`
      },
      {
        key: 'gender',
        header: 'Gender',
        type: 'badge',
        getBadgeColor: (value) => 
          value === 'MALE' ? 'bg-blue-100 text-blue-800' : 
          value === 'FEMALE' ? 'bg-pink-100 text-pink-800' :
          'bg-gray-100 text-gray-800'
      },
      {
        key: 'phoneNumber',
        header: 'Contact',
        render: (value) => value || 'Not provided'
      },
      {
        key: 'lastVisit',
        header: 'Last Visit',
        type: 'date',
        render: (value) => value ? new Date(value).toLocaleDateString() : 'No visits'
      },
      {
        key: 'status',
        header: 'Status',
        type: 'badge',
        getBadgeColor: (value) => 
          value === 'ACTIVE' ? 'bg-green-100 text-green-800' :
          value === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
          'bg-yellow-100 text-yellow-800'
      }
    ];

    if (user.role !== 'PATIENT') {
      baseColumns.push({
        key: 'actions',
        header: 'Actions',
        render: (value, row) => (
          <div className="flex items-center space-x-2">
            <Button
              size="xs"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                handleViewPatient(row);
              }}
            >
              <Eye className="h-3 w-3" />
            </Button>
            {(user.role === 'ADMIN' || user.role === 'DOCTOR') && (
              <>
                <Button
                  size="xs"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditPatient(row);
                  }}
                >
                  <Edit className="h-3 w-3" />
                </Button>
                {user.role === 'ADMIN' && (
                  <Button
                    size="xs"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeletePatient(row.id);
                    }}
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.role === 'DOCTOR' ? 'My Patients' : 
               user.role === 'NURSE' ? 'Ward Patients' : 'Patient Management'}
            </h1>
            <p className="text-gray-600 text-sm">
              {patients.length} patients total
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

          {(user.role === 'ADMIN' || user.role === 'RECEPTIONIST') && (
            <Button
              variant="primary"
              leftIcon={<UserPlus className="h-4 w-4" />}
              onClick={() => setShowAddModal(true)}
            >
              Add Patient
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="lg:col-span-2">
            <Input
              placeholder="Search patients..."
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
            <option value="INACTIVE">Inactive</option>
          </select>

          <select
            value={filters.gender}
            onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Genders</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>

          <select
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <Table
          data={patients}
          columns={getTableColumns()}
          loading={loading}
          searchable={false}
          sortable={true}
          pagination={true}
          itemsPerPage={15}
          onRowClick={user.role !== 'PATIENT' ? handleViewPatient : undefined}
          emptyMessage="No patients found matching your criteria"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-48"></div>
              </div>
            ))
          ) : patients.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No patients found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or filters
              </p>
            </div>
          ) : (
            patients.map((patient) => (
              <PatientCard
                key={patient.id}
                patient={patient}
                onView={() => handleViewPatient(patient)}
                onEdit={user.role !== 'PATIENT' ? () => handleEditPatient(patient) : undefined}
                onDelete={user.role === 'ADMIN' ? () => handleDeletePatient(patient.id) : undefined}
                userRole={user.role}
              />
            ))
          )}
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Patient"
          size="lg"
        >
          {/* Add patient form would go here */}
          <div className="text-center py-8">
            <p className="text-gray-600">Patient registration form will be implemented here.</p>
            <div className="mt-4">
              <Button onClick={() => setShowAddModal(false)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default PatientList;
