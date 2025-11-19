import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../common/Button';
import Input from '../common/Input';
import Table from '../common/Table';
import Modal from '../common/Modal';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Lock,
  Unlock,
  Search,
  Filter,
  Download,
  Upload,
  UserCheck,
  UserX,
  Mail,
  Phone,
  Shield,
  AlertCircle,
  CheckCircle,
  MoreVertical
} from 'lucide-react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    role: 'all',
    status: 'all',
    department: 'all',
    dateRange: 'all'
  });
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [bulkAction, setBulkAction] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchStatistics();
  }, [searchTerm, filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        ...filters
      };
      const response = await adminService.getAllUsers(params);
      setUsers(response);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await adminService.getUserStatistics();
      setStatistics(response);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setShowCreateModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await adminService.deleteUser(userId);
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await adminService.updateUserStatus(userId, newStatus);
      fetchUsers();
    } catch (err) {
      console.error('Error updating user status:', err);
    }
  };

  const handleLockAccount = async (userId) => {
    try {
      await adminService.lockUserAccount(userId);
      fetchUsers();
    } catch (err) {
      console.error('Error locking account:', err);
    }
  };

  const handleUnlockAccount = async (userId) => {
    try {
      await adminService.unlockUserAccount(userId);
      fetchUsers();
    } catch (err) {
      console.error('Error unlocking account:', err);
    }
  };

  const handleResetPassword = async (userId) => {
    if (window.confirm('Send password reset link to user?')) {
      try {
        await adminService.sendPasswordReset(userId);
        alert('Password reset link sent successfully');
      } catch (err) {
        console.error('Error sending password reset:', err);
      }
    }
  };

  const handleBulkAction = async () => {
    if (selectedUsers.length === 0) return;

    if (window.confirm(`Apply action "${bulkAction}" to ${selectedUsers.length} user(s)?`)) {
      try {
        await adminService.bulkUserAction(bulkAction, selectedUsers);
        setSelectedUsers([]);
        setBulkAction('');
        fetchUsers();
      } catch (err) {
        console.error('Error performing bulk action:', err);
      }
    }
  };

  const handleExport = async () => {
    try {
      await adminService.exportUsers({ ...filters, search: searchTerm });
    } catch (err) {
      console.error('Error exporting users:', err);
    }
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map(u => u.id));
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      ADMIN: 'bg-red-100 text-red-800',
      DOCTOR: 'bg-blue-100 text-blue-800',
      NURSE: 'bg-green-100 text-green-800',
      RECEPTIONIST: 'bg-purple-100 text-purple-800',
      PHARMACIST: 'bg-yellow-100 text-yellow-800',
      PATIENT: 'bg-gray-100 text-gray-800'
    };
    return colors[role] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      INACTIVE: 'bg-red-100 text-red-800',
      LOCKED: 'bg-orange-100 text-orange-800',
      SUSPENDED: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getTableColumns = () => [
    {
      key: 'select',
      header: (
        <input
          type="checkbox"
          checked={selectedUsers.length === users.length && users.length > 0}
          onChange={handleSelectAll}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      ),
      render: (_, row) => (
        <input
          type="checkbox"
          checked={selectedUsers.includes(row.id)}
          onChange={() => handleSelectUser(row.id)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
      ),
      sortable: false
    },
    {
      key: 'user',
      header: 'User',
      render: (_, row) => (
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-gray-600">
              {row.firstName[0]}{row.lastName[0]}
            </span>
          </div>
          <div>
            <div className="font-medium text-gray-900">
              {row.firstName} {row.lastName}
            </div>
            <div className="text-sm text-gray-500">{row.employeeId}</div>
          </div>
        </div>
      )
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (_, row) => (
        <div className="text-sm">
          <div className="flex items-center space-x-1 text-gray-900">
            <Mail className="h-3 w-3 text-gray-400" />
            <span>{row.email}</span>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <Phone className="h-3 w-3 text-gray-400" />
            <span>{row.phone}</span>
          </div>
        </div>
      )
    },
    {
      key: 'role',
      header: 'Role',
      render: (value) => (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(value)}`}>
          {value}
        </span>
      )
    },
    {
      key: 'department',
      header: 'Department',
      render: (value) => value || 'N/A'
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      render: (value) => value ? new Date(value).toLocaleString() : 'Never'
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
      render: (_, row) => (
        <div className="flex items-center space-x-1">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => handleEditUser(row)}
            leftIcon={<Edit3 className="h-3 w-3" />}
          />
          
          {row.status === 'ACTIVE' ? (
            <Button
              size="xs"
              variant="ghost"
              onClick={() => handleToggleStatus(row.id, row.status)}
              leftIcon={<UserX className="h-3 w-3" />}
              title="Deactivate"
            />
          ) : (
            <Button
              size="xs"
              variant="ghost"
              onClick={() => handleToggleStatus(row.id, row.status)}
              leftIcon={<UserCheck className="h-3 w-3" />}
              title="Activate"
            />
          )}
          
          {row.isLocked ? (
            <Button
              size="xs"
              variant="ghost"
              onClick={() => handleUnlockAccount(row.id)}
              leftIcon={<Unlock className="h-3 w-3" />}
              title="Unlock"
            />
          ) : (
            <Button
              size="xs"
              variant="ghost"
              onClick={() => handleLockAccount(row.id)}
              leftIcon={<Lock className="h-3 w-3" />}
              title="Lock"
            />
          )}
          
          <Button
            size="xs"
            variant="ghost"
            onClick={() => handleDeleteUser(row.id)}
            leftIcon={<Trash2 className="h-3 w-3" />}
            className="text-red-600"
            title="Delete"
          />
        </div>
      ),
      sortable: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <UserCheck className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.active || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <UserX className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Inactive</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.inactive || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Lock className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Locked</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.locked || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admins</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.admins || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <p className="text-gray-600">Manage system users and access control</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleExport}
              leftIcon={<Download className="h-4 w-4" />}
            >
              Export
            </Button>
            
            <Button
              variant="primary"
              onClick={handleCreateUser}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add User
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-blue-900">
              {selectedUsers.length} user(s) selected
            </p>
            
            <div className="flex items-center space-x-3">
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Action</option>
                <option value="activate">Activate</option>
                <option value="deactivate">Deactivate</option>
                <option value="lock">Lock</option>
                <option value="unlock">Unlock</option>
                <option value="delete">Delete</option>
              </select>
              
              <Button
                size="sm"
                variant="primary"
                onClick={handleBulkAction}
                disabled={!bulkAction}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-gray-400" />}
          />

          <select
            value={filters.role}
            onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Roles</option>
            <option value="ADMIN">Admin</option>
            <option value="DOCTOR">Doctor</option>
            <option value="NURSE">Nurse</option>
            <option value="RECEPTIONIST">Receptionist</option>
            <option value="PHARMACIST">Pharmacist</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="LOCKED">Locked</option>
            <option value="SUSPENDED">Suspended</option>
          </select>

          <select
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Departments</option>
            <option value="cardiology">Cardiology</option>
            <option value="emergency">Emergency</option>
            <option value="pediatrics">Pediatrics</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <Table
        data={users}
        columns={getTableColumns()}
        loading={loading}
        searchable={false}
        sortable={true}
        pagination={true}
        itemsPerPage={20}
        emptyMessage="No users found"
      />

      {/* Create User Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New User"
          size="lg"
        >
          <UserForm
            onSuccess={() => {
              setShowCreateModal(false);
              fetchUsers();
            }}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit User"
          size="lg"
        >
          <UserForm
            user={selectedUser}
            onSuccess={() => {
              setShowEditModal(false);
              fetchUsers();
            }}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

// User Form Component
const UserForm = ({ user, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    employeeId: user?.employeeId || '',
    role: user?.role || '',
    department: user?.department || '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (!formData.employeeId.trim()) errors.employeeId = 'Employee ID is required';
    if (!formData.role) errors.role = 'Role is required';
    
    if (!user) {
      if (!formData.password) {
        errors.password = 'Password is required';
      } else if (formData.password.length < 8) {
        errors.password = 'Password must be at least 8 characters';
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      if (user) {
        await adminService.updateUser(user.id, formData);
      } else {
        await adminService.createUser(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="First Name *"
          value={formData.firstName}
          onChange={(e) => handleInputChange('firstName', e.target.value)}
          error={validationErrors.firstName}
          required
        />

        <Input
          label="Last Name *"
          value={formData.lastName}
          onChange={(e) => handleInputChange('lastName', e.target.value)}
          error={validationErrors.lastName}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Email *"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          error={validationErrors.email}
          leftIcon={<Mail className="h-4 w-4 text-gray-400" />}
          required
        />

        <Input
          label="Phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          leftIcon={<Phone className="h-4 w-4 text-gray-400" />}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Employee ID *"
          value={formData.employeeId}
          onChange={(e) => handleInputChange('employeeId', e.target.value)}
          error={validationErrors.employeeId}
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role *
          </label>
          <select
            value={formData.role}
            onChange={(e) => handleInputChange('role', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select role</option>
            <option value="ADMIN">Admin</option>
            <option value="DOCTOR">Doctor</option>
            <option value="NURSE">Nurse</option>
            <option value="RECEPTIONIST">Receptionist</option>
            <option value="PHARMACIST">Pharmacist</option>
          </select>
          {validationErrors.role && (
            <p className="text-red-600 text-xs mt-1">{validationErrors.role}</p>
          )}
        </div>
      </div>

      <Input
        label="Department"
        value={formData.department}
        onChange={(e) => handleInputChange('department', e.target.value)}
      />

      {!user && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Password *"
            type="password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            error={validationErrors.password}
            leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
            required
          />

          <Input
            label="Confirm Password *"
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            error={validationErrors.confirmPassword}
            leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
            required
          />
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
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
          {user ? 'Update User' : 'Create User'}
        </Button>
      </div>
    </form>
  );
};

export default UserManagement;
