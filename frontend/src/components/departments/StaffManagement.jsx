import React, { useState, useEffect } from 'react';
import { departmentService } from '../../services/departmentService';
import { doctorService } from '../../services/doctorService';
import nurseService from '../../services/nurseService';
import Button from '../common/Button';
import Input from '../common/Input';
import Table from '../common/Table';
import Modal from '../common/Modal';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  Mail,
  Phone,
  Edit3,
  Trash2,
  Eye,
  UserCheck,
  UserX,
  Award
} from 'lucide-react';

const StaffManagement = ({ departmentId, departmentName }) => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);

  useEffect(() => {
    fetchStaff();
  }, [departmentId, searchTerm, roleFilter, statusFilter]);

  const fetchStaff = async () => {
    try {
      // Mock data - replace with actual API call
      const mockStaff = [
        {
          id: 1,
          employeeId: 'EMP001',
          firstName: 'John',
          lastName: 'Smith',
          role: 'DOCTOR',
          specialization: 'Cardiology',
          email: 'john.smith@hospital.com',
          phone: '+1-555-0101',
          status: 'ACTIVE',
          joinDate: '2023-01-15',
          experience: 10,
          qualifications: 'MD, FACC',
          shift: 'DAY'
        },
        {
          id: 2,
          employeeId: 'EMP002',
          firstName: 'Sarah',
          lastName: 'Johnson',
          role: 'NURSE',
          specialization: 'ICU Nursing',
          email: 'sarah.johnson@hospital.com',
          phone: '+1-555-0102',
          status: 'ACTIVE',
          joinDate: '2023-03-20',
          experience: 5,
          qualifications: 'RN, BSN',
          shift: 'NIGHT'
        },
        {
          id: 3,
          employeeId: 'EMP003',
          firstName: 'Michael',
          lastName: 'Brown',
          role: 'TECHNICIAN',
          specialization: 'Radiology',
          email: 'michael.brown@hospital.com',
          phone: '+1-555-0103',
          status: 'ACTIVE',
          joinDate: '2022-08-10',
          experience: 7,
          qualifications: 'RT, ARRT',
          shift: 'DAY'
        }
      ];

      let filteredStaff = mockStaff;

      if (searchTerm) {
        filteredStaff = filteredStaff.filter(member =>
          `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (roleFilter !== 'all') {
        filteredStaff = filteredStaff.filter(member => member.role === roleFilter);
      }

      if (statusFilter !== 'all') {
        filteredStaff = filteredStaff.filter(member => member.status === statusFilter);
      }

      setStaff(filteredStaff);
    } catch (err) {
      console.error('Error fetching staff:', err);
    } finally {
      setLoading(false);
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'DOCTOR':
        return <UserCheck className="h-4 w-4 text-blue-600" />;
      case 'NURSE':
        return <Users className="h-4 w-4 text-green-600" />;
      case 'TECHNICIAN':
        return <Award className="h-4 w-4 text-purple-600" />;
      default:
        return <Users className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      case 'ON_LEAVE':
        return 'bg-yellow-100 text-yellow-800';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewStaff = (member) => {
    setSelectedStaff(member);
    // Could open a detailed view modal
  };

  const handleEditStaff = (member) => {
    // Navigate to edit staff page or open edit modal
    console.log('Edit staff:', member);
  };

  const handleDeleteStaff = async (memberId) => {
    if (window.confirm('Are you sure you want to remove this staff member from the department?')) {
      try {
        // await departmentService.removeStaffMember(departmentId, memberId);
        setStaff(prev => prev.filter(member => member.id !== memberId));
      } catch (err) {
        console.error('Error removing staff member:', err);
      }
    }
  };

  const handleStatusChange = async (memberId, newStatus) => {
    try {
      // await departmentService.updateStaffStatus(departmentId, memberId, newStatus);
      setStaff(prev => prev.map(member => 
        member.id === memberId ? { ...member, status: newStatus } : member
      ));
    } catch (err) {
      console.error('Error updating staff status:', err);
    }
  };

  const getTableColumns = () => [
    {
      key: 'employeeId',
      header: 'Employee ID',
      render: (value) => (
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
          {value}
        </span>
      )
    },
    {
      key: 'name',
      header: 'Name',
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {row.firstName[0]}{row.lastName[0]}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {row.firstName} {row.lastName}
            </div>
            <div className="text-sm text-gray-500">{row.specialization}</div>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {getRoleIcon(value)}
          <span className="capitalize">{value.toLowerCase()}</span>
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (_, row) => (
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-3 w-3 text-gray-400" />
            <span className="text-gray-900">{row.email}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-3 w-3 text-gray-400" />
            <span className="text-gray-900">{row.phone}</span>
          </div>
        </div>
      )
    },
    {
      key: 'experience',
      header: 'Experience',
      render: (value) => `${value} years`
    },
    {
      key: 'shift',
      header: 'Shift',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
          value === 'DAY' ? 'bg-yellow-100 text-yellow-800' :
          value === 'NIGHT' ? 'bg-blue-100 text-blue-800' :
          'bg-purple-100 text-purple-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (value, row) => (
        <select
          value={value}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className={`px-2 py-1 text-xs font-medium rounded border-0 ${getStatusColor(value)}`}
        >
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="ON_LEAVE">On Leave</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      )
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (_, row) => (
        <div className="flex items-center space-x-2">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => handleViewStaff(row)}
            leftIcon={<Eye className="h-3 w-3" />}
          >
            View
          </Button>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => handleEditStaff(row)}
            leftIcon={<Edit3 className="h-3 w-3" />}
          >
            Edit
          </Button>
          <Button
            size="xs"
            variant="ghost"
            className="text-red-600 hover:text-red-700"
            onClick={() => handleDeleteStaff(row.id)}
            leftIcon={<Trash2 className="h-3 w-3" />}
          >
            Remove
          </Button>
        </div>
      ),
      sortable: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Staff Management</h3>
          <p className="text-gray-600">Manage staff members for {departmentName}</p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          leftIcon={<UserPlus className="h-4 w-4" />}
        >
          Add Staff Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <UserCheck className="h-6 w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Doctors</p>
              <p className="text-xl font-bold text-blue-900">
                {staff.filter(s => s.role === 'DOCTOR').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Nurses</p>
              <p className="text-xl font-bold text-green-900">
                {staff.filter(s => s.role === 'NURSE').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <div className="flex items-center">
            <Award className="h-6 w-6 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Technicians</p>
              <p className="text-xl font-bold text-purple-900">
                {staff.filter(s => s.role === 'TECHNICIAN').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 rounded-lg p-4">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Total Staff</p>
              <p className="text-xl font-bold text-yellow-900">{staff.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Roles</option>
              <option value="DOCTOR">Doctors</option>
              <option value="NURSE">Nurses</option>
              <option value="TECHNICIAN">Technicians</option>
              <option value="ADMINISTRATOR">Administrators</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            {staff.length} staff member{staff.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <Table
        data={staff}
        columns={getTableColumns()}
        loading={loading}
        searchable={false}
        sortable={true}
        pagination={true}
        itemsPerPage={20}
        emptyMessage="No staff members found"
        onRowClick={handleViewStaff}
      />

      {/* Add Staff Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add Staff Member"
          size="lg"
        >
          <AddStaffForm
            departmentId={departmentId}
            onSuccess={() => {
              setShowAddModal(false);
              fetchStaff();
            }}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

// Add Staff Form Component
const AddStaffForm = ({ departmentId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    employeeId: '',
    role: '',
    shift: 'DAY'
  });
  const [availableStaff, setAvailableStaff] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAvailableStaff();
  }, [formData.role]);

  const fetchAvailableStaff = async () => {
    if (!formData.role) return;

    try {
      // Mock data - replace with actual API call to get unassigned staff
      const mockStaff = [
        {
          id: 1,
          employeeId: 'EMP004',
          firstName: 'Alice',
          lastName: 'Wilson',
          role: 'DOCTOR',
          specialization: 'Emergency Medicine'
        },
        {
          id: 2,
          employeeId: 'EMP005',
          firstName: 'Bob',
          lastName: 'Davis',
          role: 'NURSE',
          specialization: 'General Nursing'
        }
      ].filter(staff => staff.role === formData.role);

      setAvailableStaff(mockStaff);
    } catch (err) {
      console.error('Error fetching available staff:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.employeeId || !formData.role) {
      setError('Please select staff member and role');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const assignmentData = {
        ...formData,
        departmentId,
        assignedAt: new Date().toISOString()
      };

      // await departmentService.assignStaff(assignmentData);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to assign staff member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role *
        </label>
        <select
          value={formData.role}
          onChange={(e) => handleInputChange('role', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          required
        >
          <option value="">Select role</option>
          <option value="DOCTOR">Doctor</option>
          <option value="NURSE">Nurse</option>
          <option value="TECHNICIAN">Technician</option>
          <option value="ADMINISTRATOR">Administrator</option>
        </select>
      </div>

      {formData.role && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Staff Member *
          </label>
          <select
            value={formData.employeeId}
            onChange={(e) => handleInputChange('employeeId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          >
            <option value="">Select staff member</option>
            {availableStaff.map(staff => (
              <option key={staff.id} value={staff.employeeId}>
                {staff.firstName} {staff.lastName} ({staff.employeeId}) - {staff.specialization}
              </option>
            ))}
          </select>
          {availableStaff.length === 0 && formData.role && (
            <p className="text-sm text-gray-500 mt-1">
              No unassigned {formData.role.toLowerCase()}s available
            </p>
          )}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Shift
        </label>
        <select
          value={formData.shift}
          onChange={(e) => handleInputChange('shift', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="DAY">Day Shift</option>
          <option value="NIGHT">Night Shift</option>
          <option value="ROTATING">Rotating Shift</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          Assign Staff Member
        </Button>
      </div>
    </form>
  );
};

export default StaffManagement;
