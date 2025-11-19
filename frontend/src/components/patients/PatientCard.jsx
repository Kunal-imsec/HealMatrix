import React from 'react';
import { 
  Calendar, 
  Phone, 
  Mail, 
  MapPin, 
  User, 
  Eye, 
  Edit, 
  Trash2,
  Heart,
  FileText
} from 'lucide-react';
import Button from '../common/Button';

const PatientCard = ({ patient, onView, onEdit, onDelete, userRole }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getGenderIcon = (gender) => {
    switch (gender) {
      case 'MALE': return '👨';
      case 'FEMALE': return '👩';
      default: return '👤';
    }
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header with Status */}
      <div className="relative p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-lg">
              {getGenderIcon(patient.gender)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-lg">
                {patient.firstName} {patient.lastName}
              </h3>
              <p className="text-sm text-gray-600">ID: {patient.patientId}</p>
            </div>
          </div>
          
          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(patient.status)}`}>
            {patient.status}
          </span>
        </div>
      </div>

      {/* Patient Details */}
      <div className="p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Age: {calculateAge(patient.dateOfBirth)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Heart className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{patient.bloodGroup || 'N/A'}</span>
          </div>
        </div>

        {patient.phoneNumber && (
          <div className="flex items-center space-x-2 text-sm">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{patient.phoneNumber}</span>
          </div>
        )}

        {patient.email && (
          <div className="flex items-center space-x-2 text-sm">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600 truncate">{patient.email}</span>
          </div>
        )}

        {patient.address && (
          <div className="flex items-start space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
            <span className="text-gray-600 line-clamp-2">{patient.address}</span>
          </div>
        )}

        {patient.lastVisit && (
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">
              Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Medical Info */}
        <div className="pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-4">
              {patient.chronicConditions > 0 && (
                <span className="text-orange-600 font-medium">
                  {patient.chronicConditions} chronic conditions
                </span>
              )}
              {patient.allergies > 0 && (
                <span className="text-red-600 font-medium">
                  {patient.allergies} allergies
                </span>
              )}
            </div>
            
            {patient.emergencyContact && (
              <span className="text-xs text-gray-500">
                Emergency: {patient.emergencyContact.name}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              size="xs"
              variant="outline"
              leftIcon={<Eye className="h-3 w-3" />}
              onClick={onView}
            >
              View
            </Button>
            
            {onEdit && userRole !== 'PATIENT' && (
              <Button
                size="xs"
                variant="ghost"
                leftIcon={<Edit className="h-3 w-3" />}
                onClick={onEdit}
              >
                Edit
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {userRole === 'DOCTOR' && (
              <Button
                size="xs"
                variant="ghost"
                leftIcon={<FileText className="h-3 w-3" />}
                onClick={() => console.log('View medical records')}
              >
                Records
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

export default PatientCard;
