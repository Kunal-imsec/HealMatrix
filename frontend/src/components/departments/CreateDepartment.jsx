import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { departmentService } from '../../services/departmentService';
import { doctorService } from '../../services/doctorService';
import Button from '../common/Button';
import Input from '../common/Input';
import {
  Save,
  X,
  Building2,
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const CreateDepartment = ({ onSuccess, onCancel, editData = null }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    type: 'CLINICAL',
    description: '',
    location: '',
    phoneNumber: '',
    email: '',
    headOfDepartmentId: '',
    capacity: '',
    operatingHours: '',
    establishedDate: '',
    budget: '',
    status: 'ACTIVE'
  });

  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const isEdit = Boolean(editData);

  useEffect(() => {
    fetchAvailableDoctors();
    if (editData) {
      setFormData({
        ...editData,
        headOfDepartmentId: editData.headOfDepartment?.id || '',
        establishedDate: editData.establishedDate ? editData.establishedDate.split('T')[0] : ''
      });
    }
  }, [editData]);

  const fetchAvailableDoctors = async () => {
    try {
      const response = await doctorService.getAvailableHODs();
      setAvailableDoctors(response);
    } catch (err) {
      console.error('Error fetching available doctors:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError(null);
  };

  const generateDepartmentCode = (name) => {
    if (!name) return '';
    return name.toUpperCase()
      .replace(/[^A-Z\s]/g, '')
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .substring(0, 4);
  };

  const handleNameChange = (value) => {
    handleInputChange('name', value);
    if (!isEdit && !formData.code) {
      handleInputChange('code', generateDepartmentCode(value));
    }
  };

  const validateForm = () => {
    const requiredFields = ['name', 'code', 'type'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    if (formData.code.length < 2 || formData.code.length > 10) {
      setError('Department code must be between 2 and 10 characters');
      return false;
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (formData.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(formData.phoneNumber)) {
      setError('Please enter a valid phone number');
      return false;
    }

    if (formData.capacity && (isNaN(formData.capacity) || parseInt(formData.capacity) < 1)) {
      setError('Capacity must be a positive number');
      return false;
    }

    if (formData.budget && (isNaN(formData.budget) || parseFloat(formData.budget) < 0)) {
      setError('Budget must be a positive number');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const departmentData = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        createdBy: isEdit ? formData.createdBy : user.id,
        updatedBy: user.id
      };

      if (isEdit) {
        await departmentService.updateDepartment(editData.id, departmentData);
      } else {
        await departmentService.createDepartment(departmentData);
      }
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} department`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Department {isEdit ? 'Updated' : 'Created'} Successfully!
        </h3>
        <p className="text-gray-600">
          The department has been {isEdit ? 'updated' : 'created'} and is now available in the system.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
          <Building2 className="h-5 w-5" />
          <span>Basic Information</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Department Name *"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g., Cardiology, Emergency, Surgery"
            required
          />

          <Input
            label="Department Code *"
            value={formData.code}
            onChange={(e) => handleInputChange('code', e.target.value.toUpperCase())}
            placeholder="e.g., CARD, EMER, SURG"
            maxLength="10"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department Type *
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="CLINICAL">Clinical</option>
              <option value="SURGICAL">Surgical</option>
              <option value="DIAGNOSTIC">Diagnostic</option>
              <option value="SUPPORT">Support</option>
              <option value="ADMINISTRATIVE">Administrative</option>
              <option value="EMERGENCY">Emergency</option>
              <option value="SPECIALIZED">Specialized</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="UNDER_RENOVATION">Under Renovation</option>
              <option value="TEMPORARILY_CLOSED">Temporarily Closed</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Brief description of the department's services and specialties"
          />
        </div>
      </div>

      {/* Location & Contact */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
          <MapPin className="h-5 w-5" />
          <span>Location & Contact</span>
        </div>

        <Input
          label="Location/Floor"
          value={formData.location}
          onChange={(e) => handleInputChange('location', e.target.value)}
          placeholder="e.g., 3rd Floor, West Wing, Room 301-350"
          leftIcon={<MapPin className="h-4 w-4 text-gray-400" />}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Phone Number"
            value={formData.phoneNumber}
            onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            placeholder="+1 (555) 123-4567"
            leftIcon={<Phone className="h-4 w-4 text-gray-400" />}
          />

          <Input
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="department@hospital.com"
            leftIcon={<Mail className="h-4 w-4 text-gray-400" />}
          />
        </div>
      </div>

      {/* Management & Operations */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
          <User className="h-5 w-5" />
          <span>Management & Operations</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Head of Department
          </label>
          <select
            value={formData.headOfDepartmentId}
            onChange={(e) => handleInputChange('headOfDepartmentId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select Head of Department</option>
            {availableDoctors.map(doctor => (
              <option key={doctor.id} value={doctor.id}>
                Dr. {doctor.firstName} {doctor.lastName} - {doctor.specialization}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Capacity"
            type="number"
            min="1"
            value={formData.capacity}
            onChange={(e) => handleInputChange('capacity', e.target.value)}
            placeholder="50"
            helperText="Maximum patient capacity"
          />

          <Input
            label="Annual Budget ($)"
            type="number"
            min="0"
            step="1000"
            value={formData.budget}
            onChange={(e) => handleInputChange('budget', e.target.value)}
            placeholder="500000"
            helperText="Annual budget allocation"
          />

          <Input
            label="Established Date"
            type="date"
            value={formData.establishedDate}
            onChange={(e) => handleInputChange('establishedDate', e.target.value)}
            leftIcon={<Calendar className="h-4 w-4 text-gray-400" />}
          />
        </div>

        <Input
          label="Operating Hours"
          value={formData.operatingHours}
          onChange={(e) => handleInputChange('operatingHours', e.target.value)}
          placeholder="e.g., 24/7, Mon-Fri 8:00 AM - 6:00 PM, Emergency: 24/7"
          helperText="Specify department operating hours and availability"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          leftIcon={<X className="h-4 w-4" />}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          leftIcon={<Save className="h-4 w-4" />}
        >
          {isEdit ? 'Update Department' : 'Create Department'}
        </Button>
      </div>
    </form>
  );
};

export default CreateDepartment;
