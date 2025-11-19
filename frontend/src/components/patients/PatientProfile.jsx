import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { patientService } from '../../services/patientService';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import MedicalHistory from './MedicalHistory';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Heart,
  AlertTriangle,
  Edit,
  FileText,
  Clock,
  Users,
  Activity
} from 'lucide-react';

const PatientProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchPatientDetails();
  }, [id]);

  const fetchPatientDetails = async () => {
    try {
      setLoading(true);
      const response = await patientService.getPatientById(id);
      setPatient(response);
    } catch (err) {
      setError('Failed to fetch patient details');
      console.error('Error fetching patient:', err);
    } finally {
      setLoading(false);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'CRITICAL': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'medical', label: 'Medical History', icon: FileText },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'vitals', label: 'Vital Signs', icon: Activity }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Error Loading Patient</h3>
        <p className="mt-1 text-gray-500">{error || 'Patient not found'}</p>
        <Button
          className="mt-4"
          onClick={() => navigate('/patients')}
        >
          Back to Patients
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl">
              {patient.gender === 'MALE' ? '👨' : patient.gender === 'FEMALE' ? '👩' : '👤'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {patient.firstName} {patient.lastName}
              </h1>
              <p className="text-gray-600">Patient ID: {patient.patientId}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(patient.status)}`}>
                  {patient.status}
                </span>
                <span className="text-sm text-gray-500">
                  Age: {calculateAge(patient.dateOfBirth)} years
                </span>
                <span className="text-sm text-gray-500">
                  Gender: {patient.gender}
                </span>
              </div>
            </div>
          </div>

          {user.role !== 'PATIENT' && (
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                leftIcon={<Edit className="h-4 w-4" />}
                onClick={() => navigate(`/patients/${patient.id}/edit`)}
              >
                Edit Profile
              </Button>
              <Button
                variant="primary"
                leftIcon={<Calendar className="h-4 w-4" />}
                onClick={() => navigate(`/appointments/book?patientId=${patient.id}`)}
              >
                Book Appointment
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
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
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Personal Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card title="Personal Information">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3">
                      <User className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Full Name</p>
                        <p className="text-sm text-gray-600">{patient.firstName} {patient.lastName}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Date of Birth</p>
                        <p className="text-sm text-gray-600">
                          {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'Not provided'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Email</p>
                        <p className="text-sm text-gray-600">{patient.email || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phone</p>
                        <p className="text-sm text-gray-600">{patient.phoneNumber || 'Not provided'}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3 md:col-span-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Address</p>
                        <p className="text-sm text-gray-600">{patient.address || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Emergency Contact */}
                {patient.emergencyContact && (
                  <Card title="Emergency Contact">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Name</p>
                        <p className="text-sm text-gray-600">{patient.emergencyContact.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Relationship</p>
                        <p className="text-sm text-gray-600">{patient.emergencyContact.relationship}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Phone</p>
                        <p className="text-sm text-gray-600">{patient.emergencyContact.phoneNumber}</p>
                      </div>
                    </div>
                  </Card>
                )}
              </div>

              {/* Medical Summary */}
              <div className="space-y-6">
                <Card title="Medical Summary">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Heart className="h-4 w-4 text-red-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Blood Group</p>
                        <p className="text-sm text-gray-600">{patient.bloodGroup || 'Not specified'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3">
                      <Activity className="h-4 w-4 text-blue-400" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Height/Weight</p>
                        <p className="text-sm text-gray-600">
                          {patient.height ? `${patient.height} cm` : 'N/A'} / {patient.weight ? `${patient.weight} kg` : 'N/A'}
                        </p>
                      </div>
                    </div>

                    {patient.chronicConditions && patient.chronicConditions.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Chronic Conditions</p>
                        <div className="space-y-1">
                          {patient.chronicConditions.map((condition, index) => (
                            <span key={index} className="inline-block px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full mr-2">
                              {condition}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {patient.allergies && patient.allergies.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Allergies</p>
                        <div className="space-y-1">
                          {patient.allergies.map((allergy, index) => (
                            <span key={index} className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full mr-2">
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                <Card title="Recent Activity">
                  <div className="space-y-3">
                    {patient.recentActivity && patient.recentActivity.length > 0 ? (
                      patient.recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Clock className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{activity.type}</p>
                            <p className="text-xs text-gray-500">{activity.date}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No recent activity</p>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'medical' && (
            <MedicalHistory patientId={patient.id} />
          )}

          {activeTab === 'appointments' && (
            <div className="text-center py-8">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-gray-600 mt-2">Appointments component will be integrated here</p>
            </div>
          )}

          {activeTab === 'vitals' && (
            <div className="text-center py-8">
              <Activity className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-gray-600 mt-2">Vital signs tracking will be implemented here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientProfile;
