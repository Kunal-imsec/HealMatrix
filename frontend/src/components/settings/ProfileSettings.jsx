import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { userService } from '../../services/userService';
import Button from '../common/Button';
import Input from '../common/Input';
import FileUpload from '../common/FileUpload';
import { 
  User, 
  Save, 
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  AlertCircle,
  CheckCircle,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';

const ProfileSettings = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    alternatePhone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    dateOfBirth: '',
    gender: '',
    department: '',
    specialization: '',
    bio: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [profilePhoto, setProfilePhoto] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await userService.getUserProfile(user.id);
      setFormData({
        firstName: response.firstName || '',
        lastName: response.lastName || '',
        email: response.email || '',
        phone: response.phone || '',
        alternatePhone: response.alternatePhone || '',
        address: response.address || '',
        city: response.city || '',
        state: response.state || '',
        zipCode: response.zipCode || '',
        country: response.country || '',
        dateOfBirth: response.dateOfBirth || '',
        gender: response.gender || '',
        department: response.department || '',
        specialization: response.specialization || '',
        bio: response.bio || ''
      });
    } catch (err) {
      setError('Failed to fetch profile data');
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
    if (success) setSuccess('');
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
    
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (error) setError('');
  };

  const validateProfile = () => {
    const errors = {};
    
    if (!formData.firstName.trim()) errors.firstName = 'First name is required';
    if (!formData.lastName.trim()) errors.lastName = 'Last name is required';
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email address';
    }
    if (formData.phone && !/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phone)) {
      errors.phone = 'Invalid phone number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validatePassword = () => {
    const errors = {};
    
    if (!passwordData.currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    if (!passwordData.newPassword) {
      errors.newPassword = 'New password is required';
    } else if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const updateData = { ...formData };
      
      await userService.updateUserProfile(user.id, updateData);
      
      if (profilePhoto.length > 0) {
        await userService.uploadProfilePhoto(user.id, profilePhoto[0]);
      }

      updateUser(updateData);
      setSuccess('Profile updated successfully');
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (!validatePassword()) return;

    setChangingPassword(true);
    setError('');
    setSuccess('');

    try {
      await userService.changePassword(user.id, {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      setSuccess('Password changed successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile Information' },
    { id: 'security', label: 'Security' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <User className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Profile Settings</h3>
              <p className="text-gray-600">Manage your personal information</p>
            </div>
          </div>
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

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Photo */}
              <div className="flex items-center space-x-6">
                <div className="relative">
                  {user.profilePhoto ? (
                    <img
                      src={user.profilePhoto}
                      alt="Profile"
                      className="h-24 w-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>

                <div>
                  <FileUpload
                    accept="image/*"
                    files={profilePhoto}
                    onFileSelect={(files) => setProfilePhoto(Array.isArray(files) ? files : [files])}
                    onFileRemove={() => setProfilePhoto([])}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    JPG, PNG or GIF. Max size 2MB.
                  </p>
                </div>
              </div>

              {/* Personal Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Personal Information</h4>
                
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
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
                    error={validationErrors.phone}
                    leftIcon={<Phone className="h-4 w-4 text-gray-400" />}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    leftIcon={<Calendar className="h-4 w-4 text-gray-400" />}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select gender</option>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Professional Information */}
              {(user.role === 'DOCTOR' || user.role === 'NURSE') && (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-4">Professional Information</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="Department"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                      leftIcon={<Briefcase className="h-4 w-4 text-gray-400" />}
                    />

                    <Input
                      label="Specialization"
                      value={formData.specialization}
                      onChange={(e) => handleInputChange('specialization', e.target.value)}
                    />
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Brief professional biography..."
                    />
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Contact Information</h4>
                
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  leftIcon={<MapPin className="h-4 w-4 text-gray-400" />}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <Input
                    label="City"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                  />

                  <Input
                    label="State"
                    value={formData.state}
                    onChange={(e) => handleInputChange('state', e.target.value)}
                  />

                  <Input
                    label="ZIP Code"
                    value={formData.zipCode}
                    onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  />
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4 border-t border-gray-200">
                <Button
                  variant="primary"
                  onClick={handleSaveProfile}
                  loading={saving}
                  leftIcon={<Save className="h-4 w-4" />}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-4">Change Password</h4>
                
                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      label="Current Password *"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                      error={validationErrors.currentPassword}
                      leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    >
                      {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      label="New Password *"
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                      error={validationErrors.newPassword}
                      leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>

                  <Input
                    label="Confirm New Password *"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    error={validationErrors.confirmPassword}
                    leftIcon={<Lock className="h-4 w-4 text-gray-400" />}
                    required
                  />

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-800">
                      <strong>Password requirements:</strong>
                    </p>
                    <ul className="text-sm text-blue-700 mt-2 space-y-1">
                      <li>• At least 8 characters long</li>
                      <li>• Contains at least one uppercase letter</li>
                      <li>• Contains at least one lowercase letter</li>
                      <li>• Contains at least one number</li>
                      <li>• Contains at least one special character</li>
                    </ul>
                  </div>
                </div>

                <div className="flex justify-end pt-4 mt-4 border-t border-gray-200">
                  <Button
                    variant="primary"
                    onClick={handleChangePassword}
                    loading={changingPassword}
                    leftIcon={<Lock className="h-4 w-4" />}
                  >
                    Change Password
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
