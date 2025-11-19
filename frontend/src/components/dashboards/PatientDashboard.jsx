import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import dashboardService from '../../services/dashboardService';
import { 
  Calendar, 
  FileText, 
  Pill, 
  CreditCard, 
  Clock, 
  Heart,
  Droplet,
  User,
  AlertCircle,
  ArrowRight,
  Activity,
  TrendingUp,
  MapPin,
  Edit,
  Plus,
  ChevronRight,
  Stethoscope,
  ClipboardList,
  DollarSign,
  AlertTriangle,
  Mail,
  Phone,
  Shield,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from 'lucide-react';

const PatientDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errorType, setErrorType] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      console.log('📊 Fetching patient dashboard data...');
      
      const data = await dashboardService.getPatientDashboard();
      console.log('✅ Dashboard data received:', data);
      
      setDashboardData(data);
      setError(null);
      setErrorType(null);
    } catch (err) {
      console.error('❌ Dashboard error:', err);
      
      // Check error type
      if (err.response?.status === 404 || err.response?.data?.code === 'PATIENT_RECORD_NOT_FOUND') {
        setErrorType('PATIENT_NOT_FOUND');
        setError('Your patient profile is incomplete');
      } else {
        setErrorType('GENERAL_ERROR');
        setError(err.message || 'Failed to load dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Loading your health dashboard...</p>
        </div>
      </div>
    );
  }

  // Patient Not Found Error
  if (errorType === 'PATIENT_NOT_FOUND') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6">
              <AlertCircle className="h-10 w-10 text-orange-600" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Patient Profile Incomplete
            </h2>
            
            <p className="text-lg text-gray-600 mb-6">
              Your account exists, but your patient profile hasn't been set up yet.
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-blue-900 mb-3 text-lg">What's Next?</h3>
              <ul className="text-left space-y-3 text-blue-800">
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-blue-600 text-white rounded-full flex-shrink-0 mr-3 flex items-center justify-center text-sm font-bold">1</span>
                  <span>Contact the hospital receptionist to complete your patient registration</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-blue-600 text-white rounded-full flex-shrink-0 mr-3 flex items-center justify-center text-sm font-bold">2</span>
                  <span>Visit the reception desk with a valid ID</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-6 h-6 bg-blue-600 text-white rounded-full flex-shrink-0 mr-3 flex items-center justify-center text-sm font-bold">3</span>
                  <span>Once completed, your dashboard will be accessible</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
                  <Phone className="h-5 w-5 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Phone</p>
                    <p className="font-semibold text-gray-900">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center justify-center p-4 bg-white rounded-lg border border-gray-200">
                  <Mail className="h-5 w-5 text-blue-600 mr-3" />
                  <div className="text-left">
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="font-semibold text-gray-900">support@hospital.com</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center space-x-4">
              <button 
                onClick={fetchDashboardData}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg"
              >
                Check Again
              </button>
              <button 
                onClick={() => window.open('tel:+15551234567')}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all duration-200 font-medium"
              >
                Contact Support
              </button>
            </div>

            <p className="text-sm text-gray-500 mt-6">
              User ID: {user?.id} • Email: {user?.email}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // General Error
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const upcomingAppointments = dashboardData?.appointments?.filter(apt => 
    new Date(apt.appointmentDateTime) > new Date() && apt.status === 'SCHEDULED'
  ) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 space-y-6 pb-8">
        
        {/* Welcome Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 rounded-2xl p-8 text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10">
            <Stethoscope className="h-64 w-64 transform rotate-12" />
          </div>
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                {dashboardData?.welcomeMessage || `Welcome, ${user?.firstName}!`}
                <span className="ml-3 text-3xl">👋</span>
              </h1>
              <p className="text-blue-100 text-lg mb-4">
                Your health journey dashboard - All your medical information in one place
              </p>
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {dashboardData?.patientInfo?.email || user?.email}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Member since {new Date().getFullYear()}
                </div>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center">
                    <User className="h-10 w-10 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-xl">
                      {dashboardData?.patientInfo?.firstName || user?.firstName} {dashboardData?.patientInfo?.lastName || user?.lastName}
                    </p>
                    <p className="text-blue-200">
                      Patient ID: P-{String(dashboardData?.patientInfo?.patientId || user?.id || '000000').padStart(6, '0')}
                    </p>
                    <div className="mt-2 px-3 py-1 bg-green-500/30 backdrop-blur-sm rounded-full text-xs font-medium inline-block">
                      ✓ Active Account
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Appointments Card */}
          <div 
            onClick={() => navigate('/appointments')}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group cursor-pointer transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <div className="flex items-center text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-full">
                <TrendingUp className="h-4 w-4 mr-1" />
                {dashboardData?.upcomingAppointments > 0 ? 'Active' : 'None'}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Upcoming Appointments</h3>
            <p className="text-4xl font-bold text-gray-900 mb-2">
              {dashboardData?.upcomingAppointments || 0}
            </p>
            <p className="text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {upcomingAppointments.length > 0 ? `Next: ${new Date(upcomingAppointments[0].appointmentDateTime).toLocaleDateString()}` : 'No scheduled appointments'}
            </p>
          </div>

          {/* Medical Records Card */}
          <div 
            onClick={() => navigate('/patient/medical-records')}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group cursor-pointer transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <FileText className="h-8 w-8 text-white" />
              </div>
              <div className="flex items-center text-blue-600 text-sm font-semibold bg-blue-50 px-3 py-1 rounded-full">
                <Activity className="h-4 w-4 mr-1" />
                {dashboardData?.medicalRecordsCount > 0 ? 'Available' : 'None'}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Medical Records</h3>
            <p className="text-4xl font-bold text-gray-900 mb-2">
              {dashboardData?.medicalRecordsCount || 0}
            </p>
            <p className="text-xs text-gray-500 flex items-center">
              <ClipboardList className="h-3 w-3 mr-1" />
              {dashboardData?.medicalRecordsCount > 0 ? 'View your history' : 'No records yet'}
            </p>
          </div>

          {/* Prescriptions Card */}
          <div 
            onClick={() => navigate('/patient/prescriptions')}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group cursor-pointer transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <Pill className="h-8 w-8 text-white" />
              </div>
              <div className="flex items-center text-purple-600 text-sm font-semibold bg-purple-50 px-3 py-1 rounded-full">
                <Activity className="h-4 w-4 mr-1" />
                {dashboardData?.activePrescriptions > 0 ? 'Active' : 'None'}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Active Prescriptions</h3>
            <p className="text-4xl font-bold text-gray-900 mb-2">
              {dashboardData?.activePrescriptions || 0}
            </p>
            <p className="text-xs text-gray-500 flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {dashboardData?.activePrescriptions > 0 ? '2 refills needed' : 'No active prescriptions'}
            </p>
          </div>

          {/* Billing Card */}
          <div 
            onClick={() => navigate('/patient/billing')}
            className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 group cursor-pointer transform hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="h-16 w-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                <CreditCard className="h-8 w-8 text-white" />
              </div>
              <div className="flex items-center text-orange-600 text-sm font-semibold bg-orange-50 px-3 py-1 rounded-full">
                <DollarSign className="h-4 w-4 mr-1" />
                {dashboardData?.outstandingBills > 0 ? 'Pending' : 'Paid'}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Outstanding Balance</h3>
            <p className="text-4xl font-bold text-gray-900 mb-2">
              ${Number(dashboardData?.outstandingBills || 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-500 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {dashboardData?.outstandingBills > 0 ? 'Payment due soon' : 'All bills paid'}
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center">
                      <Calendar className="h-6 w-6 mr-2 text-blue-600" />
                      Upcoming Appointments
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">Your scheduled medical visits</p>
                  </div>
                  <button 
                    onClick={() => navigate('/appointments')}
                    className="text-blue-600 text-sm font-semibold hover:text-blue-700 flex items-center group"
                  >
                    View All
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                {upcomingAppointments.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments.slice(0, 5).map((appointment, index) => (
                      <div 
                        key={index}
                        onClick={() => navigate(`/appointments/${appointment.appointmentId}`)}
                        className="flex items-center justify-between p-5 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
                      >
                        <div className="flex items-center space-x-4 flex-1">
                          <div className="h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
                            {appointment.doctor?.firstName?.[0]}{appointment.doctor?.lastName?.[0] || 'Dr'}
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-lg">
                              {appointment.doctorName || `Dr. ${appointment.doctor?.firstName} ${appointment.doctor?.lastName}`}
                            </p>
                            <p className="text-sm text-gray-500">{appointment.specialization || appointment.doctor?.specialization}</p>
                            <div className="flex items-center mt-2 space-x-4 text-xs text-gray-400">
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                45 minutes
                              </div>
                              <div className="flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {appointment.reason || 'Regular checkup'}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`px-4 py-1.5 rounded-full text-xs font-semibold mb-3 ${
                            appointment.status === 'SCHEDULED' ? 'bg-green-100 text-green-700' :
                            appointment.status === 'CONFIRMED' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {appointment.status || 'Scheduled'}
                          </div>
                          <p className="text-sm font-semibold text-gray-900">
                            {new Date(appointment.appointmentDateTime).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {new Date(appointment.appointmentDateTime).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400 ml-4 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                      <Calendar className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">No upcoming appointments</h3>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                      Book an appointment with your doctor to get started
                    </p>
                    <button 
                      onClick={() => navigate('/patient/book-appointment')}
                      className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:shadow-xl transition-all duration-200 font-semibold flex items-center mx-auto"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Book Appointment
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
                <p className="text-sm text-gray-500 mt-1">Commonly used features</p>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { icon: Calendar, label: 'Book Appointment', path: '/patient/book-appointment' },
                  { icon: FileText, label: 'Medical Records', path: '/patient/medical-records' },
                  { icon: Pill, label: 'Prescriptions', path: '/patient/prescriptions' },
                  { icon: CreditCard, label: 'Billing', path: '/patient/billing' },
                  { icon: Edit, label: 'Update Profile', path: '/patient/profile' }
                ].map((action, index) => (
                  <button 
                    key={index}
                    onClick={() => navigate(action.path)}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-xl transition-all duration-200 group ${
                      index === 0 
                        ? 'bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700' 
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <action.icon className="h-5 w-5 mr-3" />
                      <span className="font-medium">{action.label}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            {/* Health Tips */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
                <h2 className="text-lg font-bold text-gray-900">Health Tips</h2>
                <p className="text-sm text-gray-500 mt-1">Daily wellness</p>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-start p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200">
                  <Heart className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-green-900">Stay Active</p>
                    <p className="text-xs text-green-700 mt-1">30 min exercise daily</p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                  <Droplet className="h-5 w-5 text-blue-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Stay Hydrated</p>
                    <p className="text-xs text-blue-700 mt-1">8 glasses of water</p>
                  </div>
                </div>
                <div className="flex items-start p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl border border-purple-200">
                  <Clock className="h-5 w-5 text-purple-600 mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-purple-900">Sleep Well</p>
                    <p className="text-xs text-purple-700 mt-1">7-8 hours sleep</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ PROFESSIONAL FOOTER */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* About */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold">HMS</h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Your trusted healthcare partner providing quality medical services with compassion and excellence.
              </p>
              <div className="flex space-x-3 mt-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                  <button key={index} className="w-9 h-9 bg-gray-800 hover:bg-green-500 rounded-lg flex items-center justify-center transition-colors">
                    <Icon className="w-4 h-4" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                {['About Us', 'Services', 'Departments', 'Contact', 'FAQs'].map((link, index) => (
                  <li key={index}>
                    <button className="text-gray-400 hover:text-green-400 transition-colors flex items-center">
                      <ChevronRight className="h-3 w-3 mr-1" />
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Services</h4>
              <ul className="space-y-2 text-sm">
                {['Emergency Care', 'Surgery', 'Pediatrics', 'Cardiology', 'Neurology'].map((service, index) => (
                  <li key={index}>
                    <button className="text-gray-400 hover:text-green-400 transition-colors flex items-center">
                      <ChevronRight className="h-3 w-3 mr-1" />
                      {service}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold mb-4 text-lg">Contact Us</h4>
              <div className="space-y-3 text-sm">
                <div className="flex items-start text-gray-400">
                  <MapPin className="h-5 w-5 mr-3 flex-shrink-0 text-green-400" />
                  <span>123 Healthcare Ave, Medical City, MC 12345</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Phone className="h-5 w-5 mr-3 text-green-400" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Mail className="h-5 w-5 mr-3 text-green-400" />
                  <span>support@hospital.com</span>
                </div>
                <div className="flex items-center text-gray-400">
                  <Clock className="h-5 w-5 mr-3 text-green-400" />
                  <span>24/7 Emergency Service</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© {new Date().getFullYear()} Hospital Management System. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <button className="hover:text-green-400 transition-colors flex items-center">
                <Shield className="h-4 w-4 mr-1" />
                Privacy Policy
              </button>
              <button className="hover:text-green-400 transition-colors">Terms of Service</button>
              <button className="hover:text-green-400 transition-colors">Cookie Policy</button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PatientDashboard;
