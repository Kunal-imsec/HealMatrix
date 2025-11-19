import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { 
  Shield, 
  Plus, 
  Edit3, 
  Trash2,
  Check,
  X,
  Copy,
  Users,
  Lock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const RoleManagement = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await adminService.getAllRoles();
      setRoles(response);
    } catch (err) {
      setError('Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await adminService.getAllPermissions();
      setPermissions(response);
    } catch (err) {
      console.error('Error fetching permissions:', err);
    }
  };

  const handleCreateRole = () => {
    setSelectedRole(null);
    setShowCreateModal(true);
  };

  const handleEditRole = (role) => {
    setSelectedRole(role);
    setShowEditModal(true);
  };

  const handleDeleteRole = async (roleId) => {
    if (window.confirm('Are you sure you want to delete this role? Users with this role will lose their permissions.')) {
      try {
        await adminService.deleteRole(roleId);
        setSuccess('Role deleted successfully');
        fetchRoles();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError('Failed to delete role');
      }
    }
  };

  const handleDuplicateRole = async (role) => {
    try {
      await adminService.duplicateRole(role.id);
      setSuccess('Role duplicated successfully');
      fetchRoles();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to duplicate role');
    }
  };

  const permissionCategories = [
    {
      name: 'User Management',
      permissions: ['users.view', 'users.create', 'users.edit', 'users.delete']
    },
    {
      name: 'Patient Management',
      permissions: ['patients.view', 'patients.create', 'patients.edit', 'patients.delete']
    },
    {
      name: 'Appointments',
      permissions: ['appointments.view', 'appointments.create', 'appointments.edit', 'appointments.delete', 'appointments.approve']
    },
    {
      name: 'Medical Records',
      permissions: ['records.view', 'records.create', 'records.edit', 'records.delete']
    },
    {
      name: 'Prescriptions',
      permissions: ['prescriptions.view', 'prescriptions.create', 'prescriptions.edit', 'prescriptions.delete']
    },
    {
      name: 'Billing',
      permissions: ['billing.view', 'billing.create', 'billing.edit', 'billing.delete', 'billing.refund']
    },
    {
      name: 'Reports',
      permissions: ['reports.view', 'reports.create', 'reports.export']
    },
    {
      name: 'System Settings',
      permissions: ['settings.view', 'settings.edit', 'system.manage']
    }
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
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
            <Shield className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Role Management</h3>
              <p className="text-gray-600">Define roles and permissions for system access</p>
            </div>
          </div>
          
          <Button
            variant="primary"
            onClick={handleCreateRole}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Create Role
          </Button>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">{success}</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Roles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div key={role.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  role.isSystem ? 'bg-red-100' : 'bg-blue-100'
                }`}>
                  <Shield className={`h-5 w-5 ${
                    role.isSystem ? 'text-red-600' : 'text-blue-600'
                  }`} />
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900">{role.name}</h4>
                  {role.isSystem && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">
                      System Role
                    </span>
                  )}
                </div>
              </div>

              {!role.isSystem && (
                <div className="flex items-center space-x-1">
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleEditRole(role)}
                    leftIcon={<Edit3 className="h-3 w-3" />}
                  />
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleDuplicateRole(role)}
                    leftIcon={<Copy className="h-3 w-3" />}
                  />
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleDeleteRole(role.id)}
                    leftIcon={<Trash2 className="h-3 w-3" />}
                    className="text-red-600"
                  />
                </div>
              )}
            </div>

            <p className="text-sm text-gray-600 mb-4">{role.description}</p>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Users:</span>
                <span className="font-medium text-gray-900">{role.userCount || 0}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Permissions:</span>
                <span className="font-medium text-gray-900">
                  {role.permissions?.length || 0}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEditRole(role)}
                className="w-full"
              >
                View Permissions
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Role Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create New Role"
          size="xl"
        >
          <RoleForm
            permissions={permissionCategories}
            onSuccess={() => {
              setShowCreateModal(false);
              fetchRoles();
            }}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}

      {/* Edit Role Modal */}
      {showEditModal && selectedRole && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Role"
          size="xl"
        >
          <RoleForm
            role={selectedRole}
            permissions={permissionCategories}
            onSuccess={() => {
              setShowEditModal(false);
              fetchRoles();
            }}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

// Role Form Component
const RoleForm = ({ role, permissions, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: role?.name || '',
    description: role?.description || '',
    permissions: role?.permissions || []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePermissionToggle = (permission) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleCategoryToggle = (category) => {
    const allSelected = category.permissions.every(p => 
      formData.permissions.includes(p)
    );

    if (allSelected) {
      setFormData(prev => ({
        ...prev,
        permissions: prev.permissions.filter(p => 
          !category.permissions.includes(p)
        )
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        permissions: [...new Set([...prev.permissions, ...category.permissions])]
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      setError('Role name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (role) {
        await adminService.updateRole(role.id, formData);
      } else {
        await adminService.createRole(formData);
      }
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save role');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Role Name *"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Senior Doctor"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Describe this role and its responsibilities"
          />
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold text-gray-900 mb-4">Permissions</h4>
        
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {permissions.map((category, index) => {
            const allSelected = category.permissions.every(p => 
              formData.permissions.includes(p)
            );
            const someSelected = category.permissions.some(p => 
              formData.permissions.includes(p)
            );

            return (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={() => handleCategoryToggle(category)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 font-medium text-gray-900">
                      {category.name}
                    </span>
                  </label>
                  
                  {someSelected && !allSelected && (
                    <span className="text-xs text-blue-600">
                      {formData.permissions.filter(p => category.permissions.includes(p)).length} selected
                    </span>
                  )}
                </div>

                <div className="ml-6 grid grid-cols-1 md:grid-cols-2 gap-2">
                  {category.permissions.map((permission) => (
                    <label key={permission} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.permissions.includes(permission)}
                        onChange={() => handlePermissionToggle(permission)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        {permission.split('.')[1]}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="flex justify-between items-center pt-4 border-t">
        <p className="text-sm text-gray-600">
          {formData.permissions.length} permission(s) selected
        </p>
        
        <div className="flex space-x-3">
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
            {role ? 'Update Role' : 'Create Role'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default RoleManagement;
