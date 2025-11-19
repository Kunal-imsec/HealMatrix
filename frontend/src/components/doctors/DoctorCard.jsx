import React from 'react';
import { 
  Calendar, 
  Phone, 
  Mail, 
  Star, 
  Users, 
  Eye, 
  Edit, 
  Trash2,
  Stethoscope,
  MapPin,
  Clock,
  Award
} from 'lucide-react';
import Button from '../common/Button';

const DoctorCard = ({ 
  doctor, 
  onView, 
  onEdit, 
  onDelete, 
  onBookAppointment, 
  userRole,
  canViewSchedule 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'ON_LEAVE': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'BUSY': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getAvailabilityColor = (available) => {
    return available 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-red-100 text-red-800 border-red-200';
  };

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<Star key={i} className="h-3 w-3 text-yellow-400 fill-current" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(<Star key={i} className="h-3 w-3 text-yellow-400 fill-current" style={{ clipPath: 'inset(0 50% 0 0)' }} />);
      } else {
        stars.push(<Star key={i} className="h-3 w-3 text-gray-300" />);
      }
    }
    
    return stars;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="relative p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 bg-white rounded-full flex items-center justify-center shadow-sm">
              <Stethoscope className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                Dr. {doctor.firstName} {doctor.lastName}
              </h3>
              <p className="text-sm text-gray-600">{doctor.specialization}</p>
              <p className="text-xs text-gray-500">ID: {doctor.doctorId}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(doctor.status)}`}>
              {doctor.status?.replace('_', ' ')}
            </span>
            
            {doctor.availableToday !== undefined && (
              <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getAvailabilityColor(doctor.availableToday)}`}>
                {doctor.availableToday ? 'Available' : 'Not Available'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Doctor Details */}
      <div className="p-6 space-y-4">
        {/* Rating and Experience */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {renderRating(doctor.rating)}
            </div>
            <span className="text-sm text-gray-600">
              {doctor.rating ? `(${doctor.rating})` : 'No rating'}
            </span>
          </div>
          
          <div className="flex items-center space-x-1 text-sm text-gray-600">
            <Award className="h-4 w-4" />
            <span>{doctor.experience || 0} years</span>
          </div>
        </div>

        {/* Department and Contact */}
        <div className="space-y-2">
          {doctor.department && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span>{doctor.department.name}</span>
            </div>
          )}

          {doctor.phoneNumber && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Phone className="h-4 w-4 text-gray-400" />
              <span>{doctor.phoneNumber}</span>
            </div>
          )}

          {doctor.email && (
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="truncate">{doctor.email}</span>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Users className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-medium text-gray-900">
                {doctor.totalPatients || 0}
              </span>
            </div>
            <p className="text-xs text-gray-500">Patients</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1">
              <Calendar className="h-4 w-4 text-green-500" />
              <span className="text-sm font-medium text-gray-900">
                {doctor.todayAppointments || 0}
              </span>
            </div>
            <p className="text-xs text-gray-500">Today's Appointments</p>
          </div>
        </div>

        {/* Schedule Preview */}
        {doctor.nextAvailableSlot && (
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-900">Next Available</p>
                <p className="text-xs text-blue-700">{doctor.nextAvailableSlot}</p>
              </div>
            </div>
          </div>
        )}

        {/* Specialties/Tags */}
        {doctor.specialties && doctor.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {doctor.specialties.slice(0, 3).map((specialty, index) => (
              <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                {specialty}
              </span>
            ))}
            {doctor.specialties.length > 3 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                +{doctor.specialties.length - 3} more
              </span>
            )}
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
              View Profile
            </Button>
            
            {canViewSchedule && (
              <Button
                size="xs"
                variant="ghost"
                leftIcon={<Calendar className="h-3 w-3" />}
                onClick={() => console.log('View schedule')}
              >
                Schedule
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {onBookAppointment && doctor.availableToday && (
              <Button
                size="xs"
                variant="primary"
                leftIcon={<Calendar className="h-3 w-3" />}
                onClick={onBookAppointment}
              >
                Book
              </Button>
            )}
            
            {onEdit && (
              <Button
                size="xs"
                variant="ghost"
                leftIcon={<Edit className="h-3 w-3" />}
                onClick={onEdit}
              >
                Edit
              </Button>
            )}
            
            {onDelete && (
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

export default DoctorCard;
