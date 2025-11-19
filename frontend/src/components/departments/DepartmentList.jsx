import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { departmentService } from '../../services/departmentService';
import { useNavigate } from 'react-router-dom';
import Table from '../common/Table';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import DepartmentCard from './DepartmentCard';
import CreateDepartment from './CreateDepartment';
import { 
  Building2, 
  Plus, 
  Search, 
  Grid, 
  List, 
  Download,
  Eye,
  Edit,
  Trash2,
  Users,
  Stethoscope,
  TrendingUp,
  Activity
} from 'lucide-react';

const DepartmentList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'table' or 'grid'
  const [filters, setFilters] = useState({
    status: 'all',
    type: 'all'
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchDepartments();
    fetchStatistics();
  }, [filters, searchTerm]);

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      const response = await departmentService.getAllDepartments({ ...filters, search: searchTerm });
      setDepartments(response);
    } catch (err) {
      setError('Failed to fetch departments');
      console.error('Error fetching departments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await departmentService.getDepartmentStatistics();
      setStatistics(response);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleViewDepartment = (department) => {
    navigate(`/departments/${department.id}`);
  };

  const handleEditDepartment = (department) => {
    navigate(`/departments/${department.id}/edit`);
  };

  const handleDeleteDepartment = async (departmentId) => {
    if (window.confirm('Are you sure you want to delete this department? This action cannot be undone.')) {
      try {
        await departmentService.deleteDepartment(departmentId);
        fetchDepartments();
        fetchStatistics();
      } catch (err) {
        console.error('Error deleting department:', err);
        alert('Failed to delete department. It may have associated staff or patients.');
      }
    }
  };

  const handleDepartmentCreated = () => {
    setShowCreateModal(false);
    fetchDepartments();
    fetchStatistics();
  };

  const handleExport = async () => {
    try {
      const data = await departmentService.exportDepartments(filters);
      console.log('Export departments:', data);
    } catch (err) {
      console.error('Error exporting departments:', err);
    }
  };

  const getTableColumns = () => {
    return [
      {
        key: 'name',
        header: 'Department Name',
        render: (value, row) => (
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">{value}</div>
              <div className="text-sm text-gray-500">{row.code}</div>
            </div>
          </div>
        )
      },
      {
        key: 'description',
        header: 'Description',
        render: (value) => (
          <span className="line-clamp-2 text-sm text-gray-600" title={value}>
            {value || 'No description provided'}
          </span>
        )
      },
      {
        key: 'headOfDepartment',
        header: 'HOD',
        render: (value) => (
          <div>
            <div className="text-sm font-medium text-gray-900">
              {value ? `Dr. ${value.firstName} ${value.lastName}` : 'Not assigned'}
            </div>
            {value && (
              <div className="text-xs text-gray-500">{value.email}</div>
            )}
          </div>
        )
      },
      {
        key: 'totalStaff',
        header: 'Staff',
        render: (value, row) => (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{value || 0}</div>
            <div className="text-xs text-gray-500">
              {row.doctorCount || 0}D / {row.nurseCount || 0}N
            </div>
          </div>
        )
      },
      {
        key: 'totalPatients',
        header: 'Patients',
        render: (value) => (
          <div className="text-center">
            <div className="text-lg font-semibold text-gray-900">{value || 0}</div>
            <div className="text-xs text-gray-500">active</div>
          </div>
        )
      },
      {
        key: 'status',
        header: 'Status',
        render: (value) => (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
            value === 'ACTIVE' ? 'bg-green-100 text-green-800' :
            value === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {value}
          </span>
        )
      },
      {
        key: 'establishedDate',
        header: 'Established',
        render: (value) => value ? new Date(value).toLocaleDateString() : 'N/A'
      }
    ];
  };

  const canManageDepartments = user.role === 'ADMIN';

  if (!canManageDepartments && user.role !== 'DOCTOR' && user.role !== 'NURSE') {
    return (
      <div className="text-center py-12">
        <Building2 className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Access Restricted</h3>
        <p className="mt-1 text-gray-500">You don't have permission to view departments</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Departments</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.totalDepartments || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Staff</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.totalStaff || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Stethoscope className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Patients</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.totalPatients || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Activity className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg. Utilization</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.avgUtilization || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Building2 className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Department Management</h1>
            <p className="text-gray-600 text-sm">
              Manage hospital departments and their resources
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

          {canManageDepartments && (
            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setShowCreateModal(true)}
            >
              Add Department
            </Button>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Input
              placeholder="Search departments..."
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
            <option value="UNDER_RENOVATION">Under Renovation</option>
          </select>

          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="CLINICAL">Clinical</option>
            <option value="DIAGNOSTIC">Diagnostic</option>
            <option value="SURGICAL">Surgical</option>
            <option value="SUPPORT">Support</option>
            <option value="ADMINISTRATIVE">Administrative</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'table' ? (
        <Table
          data={departments}
          columns={getTableColumns()}
          loading={loading}
          searchable={false}
          sortable={true}
          pagination={true}
          itemsPerPage={15}
          onRowClick={handleViewDepartment}
          emptyMessage="No departments found matching your criteria"
          actions={canManageDepartments ? [
            <Button
              key="add"
              size="sm"
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setShowCreateModal(true)}
            >
              Add Department
            </Button>
          ] : []}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64"></div>
              </div>
            ))
          ) : departments.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Building2 className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No departments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or filters
              </p>
              {canManageDepartments && (
                <div className="mt-4">
                  <Button
                    variant="primary"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => setShowCreateModal(true)}
                  >
                    Add First Department
                  </Button>
                </div>
              )}
            </div>
          ) : (
            departments.map((department) => (
              <DepartmentCard
                key={department.id}
                department={department}
                onView={() => handleViewDepartment(department)}
                onEdit={canManageDepartments ? () => handleEditDepartment(department) : undefined}
                onDelete={canManageDepartments ? () => handleDeleteDepartment(department.id) : undefined}
                userRole={user.role}
              />
            ))
          )}
        </div>
      )}

      {/* Create Department Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Add New Department"
          size="lg"
        >
          <CreateDepartment
            onSuccess={handleDepartmentCreated}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default DepartmentList;
