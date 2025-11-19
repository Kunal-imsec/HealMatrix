import React from 'react';
import { 
  Building2, 
  Users, 
  UserCheck, 
  Activity, 
  MapPin, 
  Phone, 
  Mail, 
  Eye, 
  Edit, 
  Trash2,
  Calendar,
  TrendingUp,
  Stethoscope,
  Heart
} from 'lucide-react';
import Button from '../common/Button';

const DepartmentCard = ({ department, onView, onEdit, onDelete, userRole }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'UNDER_RENOVATION': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'TEMPORARILY_CLOSED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'CLINICAL': return <Stethoscope className="h-5 w-5 text-blue-600" />;
      case 'SURGICAL': return <Activity className="h-5 w-5 text-red-600" />;
      case 'DIAGNOSTIC': return <Activity className="h-5 w-5 text-purple-600" />;
      case 'SUPPORT': return <Users className="h-5 w-5 text-green-600" />;
      case 'ADMINISTRATIVE': return <Building2 className="h-5 w-5 text-gray-600" />;
      default: return <Building2 className="h-5 w-5 text-blue-600" />;
    }
  };

  const getUtilizationColor = (utilization) => {
    if (utilization >= 80) return 'text-red-600';
    if (utilization >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="relative p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
              {getTypeIcon(department.type)}
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                {department.name}
              </h3>
              <p className="text-sm text-gray-600">{department.code}</p>
              <p className="text-xs text-gray-500 mt-1">{department.type?.replace('_', ' ')}</p>
            </div>
          </div>
          
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(department.status)}`}>
            {department.status?.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Department Info */}
      <div className="p-6 space-y-4">
        {/* Description */}
        {department.description && (
          <div>
            <p className="text-sm text-gray-600 line-clamp-3">
              {department.description}
            </p>
          </div>
        )}

        {/* Head of Department */}
        {department.headOfDepartment && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <UserCheck className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Head of Department</p>
              <p className="text-xs text-gray-600">
                Dr. {department.headOfDepartment.firstName} {department.headOfDepartment.lastName}
              </p>
            </div>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-lg font-semibold text-gray-900">
                {department.totalStaff || 0}
              </span>
            </div>
            <p className="text-xs text-gray-500">Staff</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Heart className="h-4 w-4 text-green-500" />
              <span className="text-lg font-semibold text-gray-900">
                {department.totalPatients || 0}
              </span>
            </div>
            <p className="text-xs text-gray-500">Patients</p>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <span className={`text-lg font-semibold ${getUtilizationColor(department.utilization || 0)}`}>
                {department.utilization || 0}%
              </span>
            </div>
            <p className="text-xs text-gray-500">Utilization</p>
          </div>
        </div>

        {/* Staff Breakdown */}
        {(department.doctorCount > 0 || department.nurseCount > 0) && (
          <div className="flex items-center justify-between text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center space-x-4">
              {department.doctorCount > 0 && (
                <div className="flex items-center space-x-1">
                  <Stethoscope className="h-3 w-3" />
                  <span>{department.doctorCount} Doctors</span>
                </div>
              )}
              {department.nurseCount > 0 && (
                <div className="flex items-center space-x-1">
                  <Heart className="h-3 w-3" />
                  <span>{department.nurseCount} Nurses</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="space-y-2 text-sm">
          {department.location && (
            <div className="flex items-center space-x-2 text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{department.location}</span>
            </div>
          )}

          {department.phoneNumber && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{department.phoneNumber}</span>
            </div>
          )}

          {department.email && (
            <div className="flex items-center space-x-2 text-gray-600">
              <Mail className="h-4 w-4 text-gray-400" />
              <span>{department.email}</span>
            </div>
          )}
        </div>

        {/* Established Date */}
        {department.establishedDate && (
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>Established: {new Date(department.establishedDate).toLocaleDateString()}</span>
          </div>
        )}

        {/* Operating Hours */}
        {department.operatingHours && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Activity className="h-4 w-4 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-900">Operating Hours</p>
                <p className="text-xs text-yellow-700">{department.operatingHours}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              size="xs"
              variant="outline"
              leftIcon={<Eye className="h-3 w-3" />}
              onClick={onView}
            >
              View Details
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {onEdit && userRole === 'ADMIN' && (
              <Button
                size="xs"
                variant="ghost"
                leftIcon={<Edit className="h-3 w-3" />}
                onClick={onEdit}
              >
                Edit
              </Button>
            )}
            
            {onDelete && userRole === 'ADMIN' && (
              <Button
                size="xs"
                variant="ghost"
                className="text-red-600 hover:text-red-700"
                leftIcon={<Trash2 className="h-3 w-3" />}
                onClick={onDelete}
              >
                Delete
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentCard;
