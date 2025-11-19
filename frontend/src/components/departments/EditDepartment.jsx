import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { departmentService } from '../../services/departmentService';
import Button from '../common/Button';
import Input from '../common/Input';
import FileUpload from '../common/FileUpload';
import { 
  AlertCircle, 
  CheckCircle, 
  Save, 
  Building2,
  Users,
  Phone,
  Mail,
  MapPin,
  Clock
} from 'lucide-react';

const EditDepartment = ({ departmentId, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [department, setDepartment] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    headOfDepartment: '',
    location: '',
    phone: '',
    email: '',
    capacity: '',
    operatingHours: {
      monday: { start: '08:00', end: '17:00', isOpen: true },
      tuesday: { start: '08:00', end: '17:00', isOpen: true },
      wednesday: { start: '08:00', end: '17:00', isOpen: true },
      thursday: { start: '08:00', end: '17:00', isOpen: true },
      friday: { start: '08:00', end: '17:00', isOpen: true },
      saturday: { start: '09:00', end: '13:00', isOpen: false },
      sunday: { start: '09:00', end: '13:00', isOpen: false }
    },
    emergencyContact: '',
    budget: '',
    status: 'ACTIVE',
    specializations: [],
    equipment: [],
    services: []
  });

  const [departmentImage, setDepartmentImage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [activeTab, setActiveTab] = useState('basic');

  const weekDays = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' }
  ];

  useEffect(() => {
    fetchDepartment();
  }, [departmentId]);

  const fetchDepartment = async () => {
    try {
      const response = await departmentService.getDepartmentById(departmentId);
      setDepartment(response);
      setFormData({
        ...response,
        operatingHours: response.operatingHours || formData.operatingHours,
        specializations: response.specializations || [],
        equipment: response.equipment || [],
        services: response.services || []
      });
    } catch (err) {
      setError('Failed to fetch department details');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (error) setError('');
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handleArrayFieldChange = (fieldName, index, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (fieldName) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...prev[fieldName], '']
    }));
  };

  const removeArrayField = (fieldName, index) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name?.trim()) errors.name = 'Department name is required';
    if (!formData.code?.trim()) errors.code = 'Department code is required';
    if (!formData.headOfDepartment?.trim()) errors.headOfDepartment = 'Head of department is required';
    if (!formData.location?.trim()) errors.location = 'Location is required';
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (formData.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      errors.phone = 'Please enter a valid phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setSaving(true);
    setError('');

    try {
      const updateData = {
        ...formData,
        updatedBy: user.id,
        updatedAt: new Date().toISOString(),
        specializations: formData.specializations.filter(s => s.trim()),
        equipment: formData.equipment.filter(e => e.trim()),
        services: formData.services.filter(s => s.trim())
      };

      await departmentService.updateDepartment(departmentId, updateData);
      
      if (departmentImage.length > 0) {
        try {
          await departmentService.uploadDepartmentImage(departmentId, departmentImage[0]);
        } catch (photoErr) {
          console.error('Error uploading department image:', photoErr);
        }
      }

      setSuccess(true);
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update department');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Department Updated Successfully!
        </h3>
        <p className="text-gray-600">
          The department information has been updated.
        </p>
      </div>
    );
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: Building2 },
    { id: 'operations', label: 'Operations', icon: Clock },
    { id: 'services', label: 'Services & Equipment', icon: Users }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Edit Department</h3>
            <p className="text-gray-600">Update department information and settings</p>
          </div>
          
          {department && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Department Code</p>
              <p className="font-mono text-lg font-semibold text-gray-900">
                {department.code}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors
                    ${activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }
                  `}
                >
                  <IconComponent className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Basic Information Tab */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* Department Image */}
              <div className="flex justify-center">
                <FileUpload
                  variant="avatar"
                  accept="image/*"
                  files={departmentImage}
                  onFileSelect={(files) => setDepartmentImage(Array.isArray(files) ? files : [files])}
                  onFileRemove={() => setDepartmentImage([])}
                  label="Update Department Image"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Department Name *"
                  value={formData.name || ''}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={validationErrors.name}
                  required
                />

                <Input
                  label="Department Code *"
                  value={formData.code || ''}
                  onChange={(e) => handleInputChange('code', e.target.value)}
                  error={validationErrors.code}
                  required
                  disabled // Usually codes shouldn't be changed
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Brief description of the department"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Head of Department *"
                  value={formData.headOfDepartment || ''}
                  onChange={(e) => handleInputChange('headOfDepartment', e.target.value)}
                  error={validationErrors.headOfDepartment}
                  leftIcon={<Users className="h-4 w-4 text-gray-400" />}
                  required
                />

                <Input
                  label="Location *"
                  value={formData.location || ''}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  error={validationErrors.location}
                  leftIcon={<MapPin className="h-4 w-4 text-gray-400" />}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  error={validationErrors.phone}
                  leftIcon={<Phone className="h-4 w-4 text-gray-400" />}
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  error={validationErrors.email}
                  leftIcon={<Mail className="h-4 w-4 text-gray-400" />}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  label="Capacity"
                  type="number"
                  value={formData.capacity || ''}
                  onChange={(e) => handleInputChange('capacity', e.target.value)}
                  placeholder="Number of beds/rooms"
                />

                <Input
                  label="Emergency Contact"
                  value={formData.emergencyContact || ''}
                  onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status || 'ACTIVE'}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                    <option value="MAINTENANCE">Under Maintenance</option>
                    <option value="RENOVATION">Under Renovation</option>
                  </select>
                </div>
              </div>

              <Input
                label="Annual Budget"
                type="number"
                step="0.01"
                value={formData.budget || ''}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="Annual budget in USD"
                leftIcon={<span className="text-gray-400">$</span>}
              />
            </div>
          )}

          {/* Operations Tab */}
          {activeTab === 'operations' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">Operating Hours</h4>
                <div className="space-y-4">
                  {weekDays.map((day) => (
                    <div key={day.key} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
                      <div className="w-24">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formData.operatingHours[day.key]?.isOpen || false}
                            onChange={(e) => handleOperatingHoursChange(day.key, 'isOpen', e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm font-medium text-gray-700">
                            {day.label}
                          </span>
                        </label>
                      </div>
                      
                      {formData.operatingHours[day.key]?.isOpen && (
                        <div className="flex items-center space-x-3">
                          <Input
                            type="time"
                            value={formData.operatingHours[day.key]?.start || '08:00'}
                            onChange={(e) => handleOperatingHoursChange(day.key, 'start', e.target.value)}
                            className="w-32"
                          />
                          <span className="text-gray-500">to</span>
                          <Input
                            type="time"
                            value={formData.operatingHours[day.key]?.end || '17:00'}
                            onChange={(e) => handleOperatingHoursChange(day.key, 'end', e.target.value)}
                            className="w-32"
                          />
                        </div>
                      )}
                      
                      {!formData.operatingHours[day.key]?.isOpen && (
                        <span className="text-gray-500 text-sm">Closed</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Services & Equipment Tab */}
          {activeTab === 'services' && (
            <div className="space-y-6">
              {/* Specializations */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Specializations
                </label>
                {formData.specializations.map((specialization, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      value={specialization}
                      onChange={(e) => handleArrayFieldChange('specializations', index, e.target.value)}
                      placeholder="e.g., Cardiothoracic Surgery"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeArrayField('specializations', index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addArrayField('specializations')}
                >
                  Add Specialization
                </Button>
              </div>

              {/* Services */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services Offered
                </label>
                {formData.services.map((service, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      value={service}
                      onChange={(e) => handleArrayFieldChange('services', index, e.target.value)}
                      placeholder="e.g., Emergency Surgery, Consultation"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeArrayField('services', index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addArrayField('services')}
                >
                  Add Service
                </Button>
              </div>

              {/* Equipment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Equipment & Facilities
                </label>
                {formData.equipment.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <Input
                      value={item}
                      onChange={(e) => handleArrayFieldChange('equipment', index, e.target.value)}
                      placeholder="e.g., MRI Machine, X-Ray Equipment"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => removeArrayField('equipment', index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => addArrayField('equipment')}
                >
                  Add Equipment
                </Button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={handleSave}
          loading={saving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditDepartment;
