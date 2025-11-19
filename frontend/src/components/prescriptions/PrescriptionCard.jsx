import React from 'react';
import { 
  Pill, 
  User, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Edit, 
  Trash2,
  FileText,
  Stethoscope,
  Package
} from 'lucide-react';
import Button from '../common/Button';

const PrescriptionCard = ({ 
  prescription, 
  onView, 
  onEdit, 
  onDelete, 
  onDispense, 
  userRole 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
      case 'DISPENSED': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'EXPIRED': return 'bg-red-100 text-red-800 border-red-200';
      case 'CANCELLED': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'ACTIVE': return <CheckCircle className="h-4 w-4" />;
      case 'DISPENSED': return <Package className="h-4 w-4" />;
      case 'EXPIRED': return <AlertTriangle className="h-4 w-4" />;
      case 'CANCELLED': return <AlertTriangle className="h-4 w-4" />;
      case 'PENDING': return <Clock className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const isExpired = new Date(prescription.expiryDate) < new Date();
  const isExpiringSoon = !isExpired && (new Date(prescription.expiryDate) - new Date()) / (1000 * 60 * 60 * 24) <= 7;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
      {/* Header */}
      <div className="relative p-4 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="h-12 w-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Pill className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">
                #{prescription.prescriptionNumber}
              </h3>
              <p className="text-sm text-gray-600">{prescription.patientName}</p>
              <p className="text-xs text-gray-500">Age: {prescription.patientAge}</p>
            </div>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            <span className={`flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(prescription.status)}`}>
              {getStatusIcon(prescription.status)}
              <span>{prescription.status}</span>
            </span>
            
            {isExpiringSoon && !isExpired && (
              <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                Expires Soon
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Doctor Information */}
        {prescription.doctorName && userRole !== 'DOCTOR' && (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <Stethoscope className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-900">Prescribed by</p>
              <p className="text-xs text-gray-600">Dr. {prescription.doctorName}</p>
              {prescription.doctorSpecialization && (
                <p className="text-xs text-gray-500">{prescription.doctorSpecialization}</p>
              )}
            </div>
          </div>
        )}

        {/* Medications Summary */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Medications ({prescription.medicationCount})</h4>
          <div className="space-y-2">
            {prescription.medications?.slice(0, 3).map((med, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div>
                  <span className="font-medium text-gray-900">{med.medicationName}</span>
                  <span className="text-gray-500 ml-2">{med.dosage}</span>
                </div>
                <span className="text-xs text-gray-500">{med.frequency}</span>
              </div>
            ))}
            {prescription.medications?.length > 3 && (
              <p className="text-xs text-gray-500">
                +{prescription.medications.length - 3} more medications
              </p>
            )}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Prescribed</span>
            </div>
            <p className="text-gray-900 font-medium">
              {new Date(prescription.prescribedDate).toLocaleDateString()}
            </p>
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-gray-600">Expires</span>
            </div>
            <p className={`font-medium ${isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-600' : 'text-gray-900'}`}>
              {new Date(prescription.expiryDate).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Instructions */}
        {prescription.instructions && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <h5 className="text-sm font-medium text-blue-900 mb-1">Instructions</h5>
            <p className="text-sm text-blue-800 line-clamp-2">{prescription.instructions}</p>
          </div>
        )}

        {/* Diagnosis */}
        {prescription.diagnosis && (
          <div className="text-sm">
            <span className="text-gray-600">Diagnosis: </span>
            <span className="text-gray-900 font-medium">{prescription.diagnosis}</span>
          </div>
        )}

        {/* Dispensing Information */}
        {prescription.dispensedDate && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-900">Dispensed</p>
                <p className="text-xs text-green-700">
                  {new Date(prescription.dispensedDate).toLocaleDateString()} by {prescription.pharmacistName}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Priority Alert */}
        {prescription.priority === 'URGENT' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <span className="text-sm font-medium text-red-900">Urgent Prescription</span>
            </div>
          </div>
        )}
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
              View Details
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            {onDispense && prescription.status === 'ACTIVE' && (
              <Button
                size="xs"
                variant="primary"
                leftIcon={<Package className="h-3 w-3" />}
                onClick={onDispense}
              >
                Dispense
              </Button>
            )}
            
            {onEdit && userRole === 'DOCTOR' && prescription.status === 'ACTIVE' && (
              <Button
                size="xs"
                variant="ghost"
                leftIcon={<Edit className="h-3 w-3" />}
                onClick={onEdit}
              >
                Edit
              </Button>
            )}
            
            {onDelete && ['ADMIN', 'DOCTOR'].includes(userRole) && ['ACTIVE', 'PENDING'].includes(prescription.status) && (
              <Button
                size="xs"
                variant="ghost"
                className="text-red-600 hover:text-red-700"
                leftIcon={<Trash2 className="h-3 w-3" />}
                onClick={onDelete}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionCard;
