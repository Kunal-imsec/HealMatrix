import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import Button from '../common/Button';
import Modal from '../common/Modal';
import CheckInOut from './CheckInOut';
import EditAppointment from './EditAppointment';
import { 
  Calendar, 
  User, 
  Clock, 
  FileText, 
  Phone, 
  Mail,
  MapPin,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Download,
  MessageSquare,
  Bell
} from 'lucide-react';

const AppointmentDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);

  useEffect(() => {
    fetchAppointmentDetails();
  }, [id]);

  const fetchAppointmentDetails = async () => {
    try {
      const response = await appointmentService.getAppointmentById(id);
      setAppointment(response);
    } catch (err) {
      setError('Failed to fetch appointment details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (newStatus) => {
    setAppointment(prev => ({ ...prev, status: newStatus }));
    setShowCheckInModal(false);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    fetchAppointmentDetails();
  };

  const handleCancelAppointment = async () => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await appointmentService.cancelAppointment(id, 'Cancelled by user');
        setAppointment(prev => ({ ...prev, status: 'CANCELLED' }));
      } catch (err) {
        console.error('Error cancelling appointment:', err);
      }
    }
  };

  const handleSendReminder = async () => {
    try {
      await appointmentService.sendReminder(id);
      alert('Reminder sent successfully!');
    } catch (err) {
      console.error('Error sending reminder:', err);
      alert('Failed to send reminder');
    }
  };

  const canEdit = () => {
    if (!appointment) return false;
    if (user.role === 'ADMIN') return true;
    if (user.role === 'RECEPTIONIST') return true;
    if (user.role === 'DOCTOR' && appointment.doctorId === user.id) return true;
    return false;
  };

  const canCheckIn = () => {
    if (!appointment) return false;
    if (!['RECEPTIONIST', 'NURSE', 'ADMIN'].includes(user.role)) return false;
    return ['CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS'].includes(appointment.status);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'CHECKED_IN':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'IN_PROGRESS':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'NO_SHOW':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-5 w-5" />;
      case 'CANCELLED':
      case 'NO_SHOW':
        return <XCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
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

  if (error || !appointment) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error || 'Appointment Not Found'}
          </h2>
          <p className="text-gray-600 mb-6">
            The appointment you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button onClick={() => navigate('/appointments')}>
            Back to Appointments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Appointment Details
            </h1>
            <p className="text-gray-600">
              {appointment.appointmentId || `Appointment #${appointment.id}`}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {canCheckIn() && (
            <Button
              variant="primary"
              onClick={() => setShowCheckInModal(true)}
              leftIcon={<CheckCircle className="h-4 w-4" />}
            >
              Check-In/Out
            </Button>
          )}

          {canEdit() && appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && (
            <Button
              variant="outline"
              onClick={() => setShowEditModal(true)}
              leftIcon={<Edit className="h-4 w-4" />}
            >
              Edit
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Appointment Overview */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Appointment Overview</h3>
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getStatusColor(appointment.status)}`}>
                {getStatusIcon(appointment.status)}
                <span className="font-medium">{appointment.status?.replace('_', ' ')}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Date & Time</p>
                    <p className="font-medium text-gray-900">
                      {new Date(appointment.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                    <p className="text-sm text-gray-600">{appointment.timeSlot}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium text-gray-900">{appointment.duration || 30} minutes</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Type</p>
                    <p className="font-medium text-gray-900">
                      {appointment.appointmentType?.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FileText className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Reason for Visit</p>
                    <p className="font-medium text-gray-900">{appointment.reason}</p>
                  </div>
                </div>

                {appointment.notes && (
                  <div className="flex items-start space-x-3">
                    <FileText className="h-5 w-5 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm text-gray-600">Notes</p>
                      <p className="text-gray-900">{appointment.notes}</p>
                    </div>
                  </div>
                )}

                {appointment.priority && appointment.priority !== 'NORMAL' && (
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                      <div className={`w-3 h-3 rounded-full ${
                        appointment.priority === 'HIGH' ? 'bg-orange-500' : 
                        appointment.priority === 'URGENT' ? 'bg-red-500' : 'bg-gray-400'
                      }`}></div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Priority</p>
                      <p className="font-medium text-gray-900">{appointment.priority}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Patient Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Information</h3>
            
            <div className="flex items-start space-x-4">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-blue-600" />
              </div>
              
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  {appointment.patientName}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600">Patient ID:</span>
                      <span className="font-medium text-gray-900">{appointment.patientId}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium text-gray-900">{appointment.patientAge || 'N/A'}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium text-gray-900">{appointment.patientGender || 'N/A'}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {appointment.patientPhone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{appointment.patientPhone}</span>
                      </div>
                    )}
                    
                    {appointment.patientEmail && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{appointment.patientEmail}</span>
                      </div>
                    )}
                    
                    {appointment.patientAddress && (
                      <div className="flex items-start space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                        <span className="text-gray-900">{appointment.patientAddress}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Information */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Information</h3>
            
            <div className="flex items-start space-x-4">
              <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-green-600" />
              </div>
              
              <div className="flex-1">
                <h4 className="text-xl font-semibold text-gray-900 mb-2">
                  Dr. {appointment.doctorName}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600">Specialization:</span>
                      <span className="font-medium text-gray-900">{appointment.doctorSpecialization}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="text-gray-600">Department:</span>
                      <span className="font-medium text-gray-900">{appointment.doctorDepartment}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {appointment.doctorPhone && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{appointment.doctorPhone}</span>
                      </div>
                    )}
                    
                    {appointment.doctorEmail && (
                      <div className="flex items-center space-x-2 text-sm">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{appointment.doctorEmail}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Actions & Timeline */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            
            <div className="space-y-3">
              {appointment.status === 'SCHEDULED' && (
                <Button
                  variant="success"
                  fullWidth
                  leftIcon={<CheckCircle className="h-4 w-4" />}
                  onClick={() => appointmentService.updateAppointment(id, { status: 'CONFIRMED' })}
                >
                  Confirm Appointment
                </Button>
              )}

              <Button
                variant="outline"
                fullWidth
                leftIcon={<Bell className="h-4 w-4" />}
                onClick={handleSendReminder}
              >
                Send Reminder
              </Button>

              <Button
                variant="outline"
                fullWidth
                leftIcon={<MessageSquare className="h-4 w-4" />}
                onClick={() => console.log('Send message')}
              >
                Send Message
              </Button>

              <Button
                variant="outline"
                fullWidth
                leftIcon={<Download className="h-4 w-4" />}
                onClick={() => console.log('Download receipt')}
              >
                Download Receipt
              </Button>

              {['SCHEDULED', 'CONFIRMED'].includes(appointment.status) && (
                <Button
                  variant="danger"
                  fullWidth
                  leftIcon={<XCircle className="h-4 w-4" />}
                  onClick={handleCancelAppointment}
                >
                  Cancel Appointment
                </Button>
              )}
            </div>
          </div>

          {/* Appointment Timeline */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Appointment Scheduled</p>
                  <p className="text-xs text-gray-500">
                    {appointment.createdAt ? new Date(appointment.createdAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
              </div>

              {appointment.confirmedAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Appointment Confirmed</p>
                    <p className="text-xs text-gray-500">
                      {new Date(appointment.confirmedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {appointment.checkedInAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Patient Checked In</p>
                    <p className="text-xs text-gray-500">
                      {new Date(appointment.checkedInAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}

              {appointment.completedAt && (
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Appointment Completed</p>
                    <p className="text-xs text-gray-500">
                      {new Date(appointment.completedAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEditModal && (
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Appointment"
          size="xl"
        >
          <EditAppointment
            appointmentId={id}
            onSuccess={handleEditSuccess}
            onCancel={() => setShowEditModal(false)}
          />
        </Modal>
      )}

      {showCheckInModal && (
        <Modal
          isOpen={showCheckInModal}
          onClose={() => setShowCheckInModal(false)}
          title="Check-In/Check-Out"
          size="lg"
        >
          <CheckInOut
            appointmentId={id}
            onStatusChange={handleStatusChange}
          />
        </Modal>
      )}
    </div>
  );
};

export default AppointmentDetails;
