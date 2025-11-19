import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import Button from '../common/Button';
import Input from '../common/Input';
import Table from '../common/Table';
import Modal from '../common/Modal';
import { 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Search,
  UserCheck,
  UserX,
  Shield,
  Mail,
  Phone,
  Lock,
  Eye,
  AlertCircle
} from 'lucide-react';

const UserSettings = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleFilter, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        search: searchTerm,
        role: roleFilter !== 'all' ? roleFilter : undefined,
        status: statusFilter !== 'all' ? statusFilter : undefined
      };

      const response = await userService.getAllUsers(params);
      setUsers(response);
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = () => {
    setSelectedUser(null);
    setShowAddModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await userService.deleteUser(userId);
        fetchUsers();
      } catch (err) {
        console.error('Error deleting user:', err);
      }
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await userService.updateUserStatus(userId, newStatus);
      fetchUsers();
    } catch (err) {
      console.error('Error updating user status:', err);
    }
  };

  const handleResetPassword = async (userId) => {
    if (window.confirm('Send password reset link to user?')) {
      try {
        await userService.sendPasswordResetLink(userId);
        alert('Password reset link sent successfully');
      } catch (err) {
        console.error('Error sending password reset:', err);
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800';
      case 'DOCTOR':
        return 'bg-blue-100 text-blue-800';
      case 'NURSE':
        return 'bg-green-100 text-green-800';
      case 'RECEPTIONIST':
        return 'bg-purple-100 text-purple-800';
      case 'PHARMACIST':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800';
      case 'SUSPENDED':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
            <div className="text-sm text-gray-500">{row.email}</div>
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
      key: 'phone',
      header: 'Contact',
      render: (value, row) => (
        <div className="text-sm">
          <div className="flex items-center space-x-1">
            <Phone className="h-3 w-3 text-gray-400" />
            <span>{value}</span>
          </div>
        </div>
      )
    },
    {
      key: 'lastLogin',
      header: 'Last Login',
      render: (value) => value ? new Date(value).toLocaleDateString() : 'Never'
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
        <div className="flex items-center space-x-2">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => handleEditUser(row)}
            leftIcon={<Edit3 className="h-3 w-3" />}
          >
            Edit
          </Button>
          
          {row.id !== currentUser.id && (
            <>
              <Button
                size="xs"
                variant="ghost"
                onClick={() => handleToggleStatus(row.id, row.status)}
                leftIcon={row.status === 'ACTIVE' ? <UserX className="h-3 w-3" /> : <UserCheck className="h-3 w-3" />}
              >
                {row.status === 'ACTIVE' ? 'Disable' : 'Enable'}
              </Button>
              
              <Button
                size="xs"
                variant="ghost"
                onClick={() => handleResetPassword(row.id)}
                leftIcon={<Lock className="h-3 w-3" />}
              >
                Reset
              </Button>
              
              <Button
                size="xs"
                variant="ghost"
                className="text-red-600"
                onClick={() => handleDeleteUser(row.id)}
                leftIcon={<Trash2 className="h-3 w-3" />}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      ),
      sortable: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Users className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <p className="text-gray-600">Manage system users and permissions</p>
            </div>
          </div>
          
          <Button
            variant="primary"
            onClick={handleAddUser}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add User
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search users..."
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
              <option value="ADMIN">Admin</option>
              <option value="DOCTOR">Doctor</option>
              <option value="NURSE">Nurse</option>
              <option value="RECEPTIONIST">Receptionist</option>
              <option value="PHARMACIST">Pharmacist</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="SUSPENDED">Suspended</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            {users.length} user{users.length !== 1 ? 's' : ''}
          </div>
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

      {/* Add User Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New User"
          size="lg"
        >
          <UserForm
            onSuccess={() => {
              setShowAddModal(false);
              fetchUsers();
            }}
            onCancel={() => setShowAddModal(false)}
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
        await userService.updateUser(user.id, formData);
      } else {
        await userService.createUser(formData);
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
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

export default UserSettings;
