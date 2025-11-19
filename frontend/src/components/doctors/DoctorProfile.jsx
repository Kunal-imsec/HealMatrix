import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import DoctorSchedule from './DoctorSchedule';
import {
  Stethoscope,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  Award,
  Users,
  Clock,
  Edit,
  AlertTriangle,
  Activity,
  BookOpen,
  GraduationCap
} from 'lucide-react';

const DoctorProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDoctorDetails();
  }, [id]);

  const fetchDoctorDetails = async () => {
    try {
      setLoading(true);
      const response = await doctorService.getDoctorById(id);
      setDoctor(response);
    } catch (err) {
      setError('Failed to fetch doctor details');
      console.error('Error fetching doctor:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800';
      case 'ON_LEAVE': return 'bg-yellow-100 text-yellow-800';
      case 'BUSY': return 'bg-red-100 text-red-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star 
          key={i} 
          className={`h-4 w-4 ${i < fullStars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
        />
      );
    }
    
    return stars;
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Stethoscope },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'patients', label: 'Patients', icon: Users },
    { id: 'reviews', label: 'Reviews', icon: Star }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Error Loading Doctor Profile</h3>
        <p className="mt-1 text-gray-500">{error || 'Doctor not found'}</p>
        <Button
          className="mt-4"
          onClick={() => navigate('/doctors')}
        >
          Back to Doctors
        </Button>
      </div>
    );
  }

  const canEdit = user.role === 'ADMIN' || (user.role === 'DOCTOR' && user.id === doctor.id);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-6">
            <div className="h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Stethoscope className="h-10 w-10 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Dr. {doctor.firstName} {doctor.lastName}
              </h1>
              <p className="text-lg text-gray-600 mb-2">{doctor.specialization}</p>
              <div className="flex items-center space-x-4 mb-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(doctor.status)}`}>
                  {doctor.status?.replace('_', ' ')}
                </span>
                <div className="flex items-center space-x-1">
                  {renderRating(doctor.rating)}
                  <span className="text-sm text-gray-600 ml-2">
                    ({doctor.totalReviews || 0} reviews)
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4" />
                  <span>{doctor.experience || 0} years experience</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{doctor.totalPatients || 0} patients</span>
                </div>
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{doctor.department?.name || 'General'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {user.role === 'PATIENT' && doctor.availableToday && (
              <Button
                variant="primary"
                leftIcon={<Calendar className="h-4 w-4" />}
                onClick={() => navigate(`/appointments/book?doctorId=${doctor.id}`)}
              >
                Book Appointment
              </Button>
            )}
            
            {canEdit && (
              <Button
                variant="outline"
                leftIcon={<Edit className="h-4 w-4" />}
                onClick={() => navigate(`/doctors/${doctor.id}/edit`)}
              >
                Edit Profile
              </Button>
            )}
          </div>
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
                <Card title="Professional Information">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Contact Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-3">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{doctor.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{doctor.phoneNumber || 'Not provided'}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{doctor.office || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Professional Details</h4>
                      <div className="space-y-2">
                        <div>
                          <p className="text-sm text-gray-500">License Number</p>
                          <p className="text-sm text-gray-900">{doctor.licenseNumber || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Department</p>
                          <p className="text-sm text-gray-900">{doctor.department?.name || 'General'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Joining Date</p>
                          <p className="text-sm text-gray-900">
                            {doctor.joiningDate ? new Date(doctor.joiningDate).toLocaleDateString() : 'Not specified'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Education */}
                {doctor.education && doctor.education.length > 0 && (
                  <Card title="Education & Qualifications">
                    <div className="space-y-4">
                      {doctor.education.map((edu, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <GraduationCap className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                            <p className="text-sm text-gray-600">{edu.institution}</p>
                            <p className="text-xs text-gray-500">{edu.year}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* About */}
                {doctor.about && (
                  <Card title="About">
                    <p className="text-gray-600 leading-relaxed">{doctor.about}</p>
                  </Card>
                )}
              </div>

              {/* Statistics and Quick Info */}
              <div className="space-y-6">
                <Card title="Statistics">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Total Patients</span>
                      </div>
                      <span className="text-lg font-bold text-blue-600">{doctor.totalPatients || 0}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-5 w-5 text-green-600" />
                        <span className="text-sm font-medium text-green-900">Appointments Today</span>
                      </div>
                      <span className="text-lg font-bold text-green-600">{doctor.todayAppointments || 0}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Clock className="h-5 w-5 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-900">Avg. Consultation</span>
                      </div>
                      <span className="text-lg font-bold text-yellow-600">{doctor.avgConsultationTime || 30} min</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Star className="h-5 w-5 text-purple-600" />
                        <span className="text-sm font-medium text-purple-900">Rating</span>
                      </div>
                      <span className="text-lg font-bold text-purple-600">{doctor.rating || 'N/A'}</span>
                    </div>
                  </div>
                </Card>

                {/* Specialties */}
                {doctor.specialties && doctor.specialties.length > 0 && (
                  <Card title="Specialties">
                    <div className="flex flex-wrap gap-2">
                      {doctor.specialties.map((specialty, index) => (
                        <span key={index} className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Languages */}
                {doctor.languages && doctor.languages.length > 0 && (
                  <Card title="Languages">
                    <div className="flex flex-wrap gap-2">
                      {doctor.languages.map((language, index) => (
                        <span key={index} className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">
                          {language}
                        </span>
                      ))}
                    </div>
                  </Card>
                )}

                {/* Availability */}
                <Card title="Availability">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(doctor.status)}`}>
                        {doctor.status?.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Available Today</span>
                      <span className={`text-sm font-medium ${doctor.availableToday ? 'text-green-600' : 'text-red-600'}`}>
                        {doctor.availableToday ? 'Yes' : 'No'}
                      </span>
                    </div>
                    
                    {doctor.nextAvailableSlot && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Next Available</span>
                        <span className="text-sm text-gray-900">{doctor.nextAvailableSlot}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <DoctorSchedule doctorId={doctor.id} />
          )}

          {activeTab === 'patients' && (
            <div className="text-center py-8">
              <Users className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-gray-600 mt-2">Patient list will be implemented here</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="text-center py-8">
              <Star className="mx-auto h-12 w-12 text-gray-400" />
              <p className="text-gray-600 mt-2">Reviews and feedback will be displayed here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
