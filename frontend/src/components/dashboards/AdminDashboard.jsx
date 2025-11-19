import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  Stethoscope, 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  UserPlus,
  Clock,
  Star,
  ChevronRight,
  ChevronLeft,
  Database,
  Shield,
  Settings as SettingsIcon,
  Heart,
  Pill,
  Beaker,
  AlertCircle,
  X
} from 'lucide-react';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalNurses: 0,
    totalReceptionists: 0,
    totalPharmacists: 0,
    totalLabTechnicians: 0,
    totalPatients: 0,
    activePatients: 0,
    admittedPatients: 0,
    dischargedPatients: 0,
    criticalPatients: 0,
    totalAppointments: 0,
    todayAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    pendingPayments: 0,
    pendingLabReports: 0,
    completedLabReports: 0,
    pendingPrescriptions: 0,
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    loading: true
  });

  const [topDoctors, setTopDoctors] = useState([]);
  const [recentPatients, setRecentPatients] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [currentDoctorIndex, setCurrentDoctorIndex] = useState(0);
  const [patientStats, setPatientStats] = useState({
    curedRate: 85,
    mortalityRate: 3,
    recoveryRate: 92,
    readmissionRate: 8
  });

  // Modal states
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [staffType, setStaffType] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [staffForm, setStaffForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phone: '',
    specialization: '',
    department: '',
    role: ''
  });

  useEffect(() => {
    fetchDashboardData();
    fetchTopDoctors();
    fetchRecentPatients();
    fetchRecentActivities();
  }, []);

  // ✅ Fetch real data from backend (tries both v1 and normal)
  const fetchDashboardData = async () => {
    try {
      setDashboardData(prev => ({ ...prev, loading: true }));
      
      // Try v1 first
      let response = await fetch('http://localhost:8080/api/v1/dashboard/admin', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      
      // Fallback to normal
      if (!response.ok) {
        response = await fetch('http://localhost:8080/api/dashboard/admin', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
        });
      }
      
      if (response.ok) {
        const result = await response.json();
        const data = result.data || result; // Handle ApiResponse wrapper
        
        setDashboardData({
          totalUsers: data.totalUsers || 0,
          totalDoctors: data.totalDoctors || 0,
          totalNurses: data.totalNurses || 0,
          totalReceptionists: data.totalReceptionists || 0,
          totalPharmacists: data.totalPharmacists || 0,
          totalLabTechnicians: data.totalLabTechnicians || 0,
          totalPatients: data.totalPatients || 0,
          activePatients: data.activePatients || 0,
          admittedPatients: data.admittedPatients || 0,
          dischargedPatients: data.dischargedPatients || 0,
          criticalPatients: data.criticalPatients || 0,
          totalAppointments: data.totalAppointments || 0,
          todayAppointments: data.todayAppointments || 0,
          pendingAppointments: data.pendingAppointments || 0,
          completedAppointments: data.completedAppointments || 0,
          totalRevenue: data.totalRevenue || 0,
          todayRevenue: data.todayRevenue || 0,
          pendingPayments: data.pendingPayments || 0,
          pendingLabReports: data.pendingLabReports || 0,
          completedLabReports: data.completedLabReports || 0,
          pendingPrescriptions: data.pendingPrescriptions || 0,
          totalBeds: data.totalBeds || 0,
          occupiedBeds: data.occupiedBeds || 0,
          availableBeds: data.availableBeds || 0,
          loading: false
        });
      } else {
        console.error('Failed to fetch dashboard data');
        setDashboardData(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setDashboardData(prev => ({ ...prev, loading: false }));
    }
  };

  const fetchTopDoctors = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/admin/doctors', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        const data = result.data || result;
        setTopDoctors(data.slice(0, 6) || mockDoctors);
      } else {
        setTopDoctors(mockDoctors);
      }
    } catch (error) {
      setTopDoctors(mockDoctors);
    }
  };

  const fetchRecentPatients = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/v1/patients?limit=5', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      
      if (response.ok) {
        const result = await response.json();
        const data = result.data || result;
        setRecentPatients(data.slice(0, 5) || mockRecentPatients);
      } else {
        setRecentPatients(mockRecentPatients);
      }
    } catch (error) {
      setRecentPatients(mockRecentPatients);
    }
  };

  const fetchRecentActivities = () => {
    setRecentActivities([
      { id: 1, action: 'New doctor registered', user: 'Dr. Wilson James', time: '2 min ago', type: 'doctor', icon: Stethoscope },
      { id: 2, action: 'Patient admitted to ICU', user: 'John Doe (#P-1234)', time: '15 min ago', type: 'patient', icon: UserCheck },
      { id: 3, action: 'Lab report completed', user: 'Lab Tech Sarah', time: '25 min ago', type: 'lab', icon: Beaker },
      { id: 4, action: 'Prescription dispensed', user: 'Pharmacy Counter 2', time: '35 min ago', type: 'pharmacy', icon: Pill },
      { id: 5, action: 'Payment received', user: 'Patient #P-5678', time: '1 hour ago', type: 'billing', icon: DollarSign },
      { id: 6, action: 'Appointment scheduled', user: 'Dr. Smith - Patient #P-9012', time: '1 hour ago', type: 'appointment', icon: Calendar }
    ]);
  };

  // ✅ Open Add Staff Modal
  const handleAddStaffClick = (type) => {
    setStaffType(type);
    setStaffForm({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phone: '',
      specialization: '',
      department: '',
      role: type
    });
    setShowAddStaffModal(true);
  };

  const handleFormChange = (field, value) => {
    setStaffForm(prev => ({ ...prev, [field]: value }));
  };

  // ✅ Submit staff registration to backend
  const handleStaffSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:8080/api/v1/admin/staff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(staffForm)
      });

      if (response.ok) {
        const result = await response.json();
        alert(`${staffType} added successfully!`);
        setShowAddStaffModal(false);
        fetchDashboardData(); // Refresh dashboard
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to add staff'}`);
      }
    } catch (error) {
      console.error('Error adding staff:', error);
      alert('Failed to add staff. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const mockDoctors = [
    { id: 1, name: 'Dr. Alexandro Jr.', specialty: 'Cardiology', rating: 4.8, patients: 234 },
    { id: 2, name: 'Dr. Samantha Lee', specialty: 'Pediatrics', rating: 4.9, patients: 312 },
    { id: 3, name: 'Dr. Michael Chen', specialty: 'Neurology', rating: 4.7, patients: 189 },
    { id: 4, name: 'Dr. Sarah Johnson', specialty: 'Orthopedics', rating: 4.6, patients: 267 },
    { id: 5, name: 'Dr. Robert Brown', specialty: 'Dermatology', rating: 4.5, patients: 198 },
    { id: 6, name: 'Dr. Emily Davis', specialty: 'Gynecology', rating: 4.8, patients: 245 }
  ];

  const mockRecentPatients = [
    { id: 1, name: 'Alice Cooper', age: 34, condition: 'Diabetes', status: 'stable', admittedDate: '2024-11-05' },
    { id: 2, name: 'Bob Martin', age: 56, condition: 'Heart Disease', status: 'critical', admittedDate: '2024-11-06' },
    { id: 3, name: 'Carol White', age: 28, condition: 'Pregnancy', status: 'stable', admittedDate: '2024-11-07' },
    { id: 4, name: 'David Lee', age: 45, condition: 'Kidney Stones', status: 'recovering', admittedDate: '2024-11-06' },
    { id: 5, name: 'Emma Wilson', age: 62, condition: 'Pneumonia', status: 'stable', admittedDate: '2024-11-05' }
  ];

  const mainStats = [
    {
      title: 'Total Patients',
      value: dashboardData.totalPatients,
      change: 12,
      icon: UserCheck,
      gradient: 'from-pink-400 via-pink-500 to-pink-600',
      link: '/patients'
    },
    {
      title: 'Total Doctors',
      value: dashboardData.totalDoctors,
      change: 3,
      icon: Stethoscope,
      gradient: 'from-blue-400 via-blue-500 to-blue-600',
      link: '/doctors'
    },
    {
      title: 'Appointments',
      value: dashboardData.todayAppointments,
      change: -5,
      icon: Calendar,
      gradient: 'from-green-400 via-green-500 to-green-600',
      link: '/appointments'
    },
    {
      title: 'Revenue Today',
      value: `$${(dashboardData.todayRevenue / 1000).toFixed(1)}k`,
      change: 8,
      icon: DollarSign,
      gradient: 'from-purple-400 via-purple-500 to-purple-600',
      link: '/billing'
    }
  ];

  const staffStats = [
    { title: 'Nurses', value: dashboardData.totalNurses, icon: Users, color: 'text-teal-600', bgColor: 'bg-teal-50' },
    { title: 'Receptionists', value: dashboardData.totalReceptionists, icon: UserPlus, color: 'text-orange-600', bgColor: 'bg-orange-50' },
    { title: 'Pharmacists', value: dashboardData.totalPharmacists, icon: Pill, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { title: 'Lab Technicians', value: dashboardData.totalLabTechnicians, icon: Beaker, color: 'text-purple-600', bgColor: 'bg-purple-50' }
  ];

  const operationalMetrics = [
    { 
      title: 'Active Patients', 
      value: dashboardData.activePatients, 
      total: dashboardData.totalPatients,
      icon: Heart, 
      color: 'text-red-600',
      percentage: dashboardData.totalPatients > 0 ? Math.round((dashboardData.activePatients / dashboardData.totalPatients) * 100) : 0
    },
    { 
      title: 'Admitted Patients', 
      value: dashboardData.admittedPatients,
      total: dashboardData.totalPatients,
      icon: UserCheck, 
      color: 'text-blue-600',
      percentage: dashboardData.totalPatients > 0 ? Math.round((dashboardData.admittedPatients / dashboardData.totalPatients) * 100) : 0
    },
    { 
      title: 'Pending Lab Reports', 
      value: dashboardData.pendingLabReports,
      total: dashboardData.completedLabReports + dashboardData.pendingLabReports,
      icon: Beaker, 
      color: 'text-yellow-600',
      percentage: (dashboardData.completedLabReports + dashboardData.pendingLabReports) > 0 ? Math.round((dashboardData.pendingLabReports / (dashboardData.completedLabReports + dashboardData.pendingLabReports)) * 100) : 0
    },
    { 
      title: 'Critical Patients', 
      value: dashboardData.criticalPatients,
      total: dashboardData.admittedPatients,
      icon: AlertCircle, 
      color: 'text-red-600',
      percentage: dashboardData.admittedPatients > 0 ? Math.round((dashboardData.criticalPatients / dashboardData.admittedPatients) * 100) : 0
    }
  ];

  const bedOccupancy = {
    occupied: dashboardData.occupiedBeds,
    available: dashboardData.availableBeds,
    total: dashboardData.totalBeds,
    percentage: dashboardData.totalBeds > 0 ? Math.round((dashboardData.occupiedBeds / dashboardData.totalBeds) * 100) : 0
  };

  const nextDoctor = () => {
    setCurrentDoctorIndex((prev) => (prev + 3 >= topDoctors.length ? 0 : prev + 3));
  };

  const prevDoctor = () => {
    setCurrentDoctorIndex((prev) => (prev - 3 < 0 ? Math.max(0, topDoctors.length - 3) : prev - 3));
  };

  const visibleDoctors = topDoctors.slice(currentDoctorIndex, currentDoctorIndex + 3);

  const getStatusColor = (status) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'stable': return 'text-green-600 bg-green-50';
      case 'recovering': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (dashboardData.loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-green-400 to-green-500 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-3xl font-bold">Welcome to Hospital Management System!</h1>
        <p className="mt-2 text-green-50">Here's what's happening in your hospital today</p>
        <div className="mt-4 flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5" />
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5" />
            <span>{new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Main Stats Cards - ✅ Real data from backend */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStats.map((stat, index) => (
          <Link 
            key={index}
            to={stat.link}
            className={`bg-gradient-to-br ${stat.gradient} rounded-3xl p-6 text-white shadow-lg hover:shadow-xl transition-all relative overflow-hidden group`}
          >
            <div className="relative z-10">
              <p className="text-white/90 text-sm font-medium mb-2">{stat.title}</p>
              <h3 className="text-4xl font-bold mb-3">{stat.value}</h3>
              <div className="flex items-center space-x-1">
                {stat.change > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                <span className="text-sm font-medium">{Math.abs(stat.change)}% vs last month</span>
              </div>
            </div>
            <div className="absolute top-4 right-4 bg-white/20 p-4 rounded-2xl group-hover:scale-110 transition-transform">
              <stat.icon className="w-10 h-10 text-white" strokeWidth={1.5} />
            </div>
          </Link>
        ))}
      </div>

      {/* Staff Overview */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Staff Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {staffStats.map((stat, index) => (
            <div key={index} className={`${stat.bgColor} rounded-xl p-4 flex items-center space-x-4`}>
              <div className={`p-3 ${stat.color} bg-white rounded-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-600">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Operational Metrics & Bed Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Operational Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {operationalMetrics.map((metric, index) => (
                <div key={index} className="border border-gray-100 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 ${metric.color} bg-opacity-10 rounded-lg`}>
                        <metric.icon className={`w-5 h-5 ${metric.color}`} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{metric.title}</p>
                        <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${metric.color}`}>{metric.percentage}%</p>
                      <p className="text-xs text-gray-500">of {metric.total}</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${metric.color.replace('text', 'bg')}`}
                      style={{ width: `${metric.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Bed Occupancy</h3>
          <div className="flex items-center justify-center mb-6">
            <div className="relative w-40 h-40">
              <svg className="transform -rotate-90 w-40 h-40">
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-200" />
                <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - bedOccupancy.percentage / 100)}`}
                  className="text-blue-500 transition-all duration-500" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <span className="text-3xl font-bold text-gray-900">{bedOccupancy.percentage}%</span>
                <span className="text-sm text-gray-500">Occupied</span>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-blue-900">Occupied</span>
              <span className="text-lg font-bold text-blue-600">{bedOccupancy.occupied}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <span className="text-sm font-medium text-green-900">Available</span>
              <span className="text-lg font-bold text-green-600">{bedOccupancy.available}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-900">Total Beds</span>
              <span className="text-lg font-bold text-gray-600">{bedOccupancy.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Cure Statistics */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Patient Care Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Cure Rate', value: patientStats.curedRate, color: 'text-green-500' },
            { label: 'Recovery Rate', value: patientStats.recoveryRate, color: 'text-blue-500' },
            { label: 'Mortality Rate', value: patientStats.mortalityRate, color: 'text-red-500' },
            { label: 'Readmission Rate', value: patientStats.readmissionRate, color: 'text-orange-500' }
          ].map((stat, idx) => (
            <div key={idx} className="text-center">
              <div className="w-24 h-24 mx-auto mb-3 relative">
                <svg className="transform -rotate-90 w-24 h-24">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - stat.value / 100)}`}
                    className={stat.color} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-xl font-bold ${stat.color}`}>{stat.value}%</span>
                </div>
              </div>
              <p className="text-sm font-medium text-gray-900">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Top Doctors & Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Top Performing Doctors</h3>
            <div className="flex items-center space-x-2">
              <button onClick={prevDoctor} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" disabled={currentDoctorIndex === 0}>
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <button onClick={nextDoctor} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors" disabled={currentDoctorIndex + 3 >= topDoctors.length}>
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {visibleDoctors.map((doctor, index) => (
              <div key={doctor.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {currentDoctorIndex + index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{doctor.name}</p>
                    <p className="text-sm text-green-600">{doctor.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 text-yellow-500 mb-1">
                    <Star className="w-4 h-4 fill-yellow-500" />
                    <span className="text-sm font-semibold text-gray-900">{doctor.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500">{doctor.patients} patients</p>
                </div>
              </div>
            ))}
          </div>
          
          <Link to="/doctors" className="mt-4 flex items-center justify-center text-green-500 text-sm font-medium hover:text-green-600">
            View all doctors <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Recently Admitted Patients</h3>
            <Link to="/patients" className="text-green-500 text-sm font-medium hover:text-green-600">View all</Link>
          </div>
          
          <div className="space-y-3">
  {recentPatients.map((patient) => (
    <div key={patient.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
          {/* ✅ FIXED: Safe handling of undefined name */}
          {patient.name 
            ? patient.name.split(' ').map(n => n[0]).join('') 
            : '??'
          }
        </div>
        <div>
          {/* ✅ FIXED: Safe display of name */}
          <p className="font-medium text-gray-900">
            {patient.name || 'Unknown Patient'}
          </p>
          <p className="text-xs text-gray-500">
            {patient.age || 'N/A'} years • {patient.condition || 'No condition'}
          </p>
        </div>
      </div>
      <div className="text-right">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
          {patient.status || 'Unknown'}
        </span>
        <p className="text-xs text-gray-500 mt-1">
          {patient.admittedDate 
            ? new Date(patient.admittedDate).toLocaleDateString() 
            : 'N/A'
          }
        </p>
      </div>
    </div>
  ))}
</div>

        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Recent Activities</h3>
          <Link to="/activities" className="text-green-500 text-sm font-medium hover:text-green-600">View all</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
              <div className="flex-shrink-0 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                <activity.icon className="w-5 h-5 text-green-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                <p className="text-sm text-gray-600 truncate">{activity.user}</p>
                <p className="text-xs text-gray-400 mt-1 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {activity.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Updated Quick Actions */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <button onClick={() => handleAddStaffClick('DOCTOR')} className="flex flex-col items-center p-4 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors group">
            <Stethoscope className="w-8 h-8 text-blue-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-blue-900">Add Doctor</span>
          </button>
          
          <button onClick={() => handleAddStaffClick('NURSE')} className="flex flex-col items-center p-4 bg-teal-50 rounded-xl hover:bg-teal-100 transition-colors group">
            <Users className="w-8 h-8 text-teal-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-teal-900">Add Nurse</span>
          </button>
          
          <button onClick={() => handleAddStaffClick('PHARMACIST')} className="flex flex-col items-center p-4 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors group">
            <Pill className="w-8 h-8 text-indigo-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-indigo-900">Add Pharmacist</span>
          </button>
          
          <button onClick={() => handleAddStaffClick('RECEPTIONIST')} className="flex flex-col items-center p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group">
            <UserPlus className="w-8 h-8 text-orange-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-orange-900">Add Receptionist</span>
          </button>
          
          <Link to="/admin/database" className="flex flex-col items-center p-4 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors group">
            <Database className="w-8 h-8 text-purple-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-purple-900">Database</span>
          </Link>
          
          <Link to="/admin/security" className="flex flex-col items-center p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors group">
            <Shield className="w-8 h-8 text-red-600 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm font-medium text-red-900">Security</span>
          </Link>
        </div>
      </div>

      {/* ✅ Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Add {staffType}</h2>
              <button onClick={() => setShowAddStaffModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleStaffSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input type="text" required value={staffForm.firstName} onChange={(e) => handleFormChange('firstName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="John" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input type="text" required value={staffForm.lastName} onChange={(e) => handleFormChange('lastName', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Doe" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                <input type="email" required value={staffForm.email} onChange={(e) => handleFormChange('email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="john.doe@hospital.com" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <input type="password" required value={staffForm.password} onChange={(e) => handleFormChange('password', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Min. 8 characters" minLength={8} />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                <input type="tel" value={staffForm.phone} onChange={(e) => handleFormChange('phone', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="+1 234 567 8900" />
              </div>

              {staffType === 'DOCTOR' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Specialization *</label>
                  <input type="text" required value={staffForm.specialization} onChange={(e) => handleFormChange('specialization', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Cardiology" />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                <input type="text" value={staffForm.department} onChange={(e) => handleFormChange('department', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Emergency" />
              </div>

              <div className="flex space-x-3 pt-4">
                <button type="button" onClick={() => setShowAddStaffModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-lg hover:shadow-lg transition-shadow disabled:opacity-50">
                  {submitting ? 'Adding...' : `Add ${staffType}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
