import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { departmentService } from '../../services/departmentService';
import Button from '../common/Button';
import Modal from '../common/Modal';
import EditDepartment from './EditDepartment';
import StaffManagement from './StaffManagement';
import DepartmentStats from './DepartmentStats';
import { 
  Building2, 
  Users, 
  MapPin, 
  Phone, 
  Mail,
  Edit, 
  ArrowLeft,
  Clock,
  DollarSign,
  Activity,
  Calendar,
  Settings,
  BarChart3
} from 'lucide-react';

const DepartmentDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDepartmentDetails();
  }, [id]);

  const fetchDepartmentDetails = async () => {
    try {
      const response = await departmentService.getDepartmentById(id);
      setDepartment(response);
    } catch (err) {
      setError('Failed to fetch department details');
    } finally {
      setLoading(false);
    }
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    fetchDepartmentDetails();
  };

  const canEdit = () => {
    return ['ADMIN', 'MANAGER'].includes(user.role);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MAINTENANCE':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'RENOVATION':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatOperatingHours = (operatingHours) => {
    if (!operatingHours) return 'Not specified';
    
    const openDays = Object.entries(operatingHours)
      .filter(([_, hours]) => hours.isOpen)
      .map(([day, hours]) => ({
        day: day.charAt(0).toUpperCase() + day.slice(1),
        start: hours.start,
        end: hours.end
      }));

    if (openDays.length === 0) return 'Closed all days';

    // Group consecutive days with same hours
    const grouped = openDays.reduce((acc, curr) => {
      const existing = acc.find(g => g.start === curr.start && g.end === curr.end);
      if (existing) {
        existing.days.push(curr.day);
      } else {
        acc.push({ days: [curr.day], start: curr.start, end: curr.end });
      }
      return acc;
    }, []);

    return grouped.map(g => 
      `${g.days.join(', ')}: ${g.start} - ${g.end}`
    ).join('\n');
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
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

  if (error || !department) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-12">
          <Building2 className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Department Not Found'}
          </h2>
          <p className="text-gray-600 mb-6">
            The department you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate('/departments')}>
            Back to Departments
          </Button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Building2 },
    { id: 'staff', label: 'Staff Management', icon: Users },
    { id: 'stats', label: 'Statistics', icon: BarChart3 }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              leftIcon={<ArrowLeft className="h-4 w-4" />}
            >
              Back
            </Button>
            
            <div className="flex items-center space-x-4">
              {department.image ? (
                <img 
                  src={department.image} 
                  alt={department.name}
                  className="h-16 w-16 rounded-lg object-cover"
                />
              ) : (
                <div className="h-16 w-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-blue-600" />
                </div>
              )}
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {department.name}
                </h1>
                <p className="text-gray-600">
                  Department Code: {department.code}
                </p>
                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(department.status)}`}>
                  {department.status}
                </div>
              </div>
            </div>
          </div>

          {canEdit() && (
            <Button
              variant="primary"
              onClick={() => setShowEditModal(true)}
              leftIcon={<Edit className="h-4 w-4" />}
            >
              Edit Department
            </Button>
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
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <Users className="h-8 w-8 text-blue-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-blue-600">Total Staff</p>
                      <p className="text-2xl font-bold text-blue-900">
                        {department.staffCount || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <Activity className="h-8 w-8 text-green-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-green-600">Capacity</p>
                      <p className="text-2xl font-bold text-green-900">
                        {department.capacity || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <Calendar className="h-8 w-8 text-yellow-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-yellow-600">Monthly Patients</p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {department.monthlyPatients || 0}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <div className="flex items-center">
                    <DollarSign className="h-8 w-8 text-purple-600" />
                    <div className="ml-4">
                      <p className="text-sm font-medium text-purple-600">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-purple-900">
                        ${(department.monthlyRevenue || 0).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Information */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Information</h3>
                    
                    <div className="space-y-4">
                      {department.description && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Description</label>
                          <p className="text-gray-900 mt-1">{department.description}</p>
                        </div>
                      )}

                      <div>
                        <label className="text-sm font-medium text-gray-600">Head of Department</label>
                        <p className="text-gray-900 mt-1">{department.headOfDepartment}</p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <div>
                          <label className="text-sm font-medium text-gray-600">Location</label>
                          <p className="text-gray-900">{department.location}</p>
                        </div>
                      </div>

                      {department.phone && (
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <div>
                            <label className="text-sm font-medium text-gray-600">Phone</label>
                            <p className="text-gray-900">{department.phone}</p>
                          </div>
                        </div>
                      )}

                      {department.email && (
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <div>
                            <label className="text-sm font-medium text-gray-600">Email</label>
                            <p className="text-gray-900">{department.email}</p>
                          </div>
                        </div>
                      )}

                      {department.emergencyContact && (
                        <div>
                          <label className="text-sm font-medium text-gray-600">Emergency Contact</label>
                          <p className="text-gray-900 mt-1">{department.emergencyContact}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Operating Hours & Services */}
                <div className="space-y-6">
                  {/* Operating Hours */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Operating Hours</h4>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <pre className="text-sm text-gray-900 whitespace-pre-line">
                        {formatOperatingHours(department.operatingHours)}
                      </pre>
                    </div>
                  </div>

                  {/* Specializations */}
                  {department.specializations && department.specializations.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {department.specializations.map((spec, index) => (
                          <span 
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Services */}
                  {department.services && department.services.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Services Offered</h4>
                      <ul className="space-y-2">
                        {department.services.map((service, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span>{service}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Equipment */}
                  {department.equipment && department.equipment.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-3">Equipment & Facilities</h4>
                      <ul className="space-y-2">
                        {department.equipment.map((item, index) => (
                          <li key={index} className="flex items-center space-x-2 text-sm text-gray-700">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Staff Management Tab */}
          {activeTab === 'staff' && (
            <StaffManagement departmentId={id} departmentName={department.name} />
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <DepartmentStats departmentId={id} departmentName={department.name} />
          )}
        </div>
      </div>

      {/* Edit Department Modal */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Department"
          size="xl"
        >
          <EditDepartment
            departmentId={id}
            onSuccess={handleEditSuccess}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default DepartmentDetails;
