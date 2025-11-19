import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import dashboardService from '../../services/dashboardService';
import { appointmentService } from '../../services/appointmentService';
import { patientService } from '../../services/patientService';
import { Stethoscope, Calendar, Users, Clock, TrendingUp, AlertCircle } from 'lucide-react';

const DoctorDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchTodayAppointments();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getDoctorDashboard();
      setDashboardData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTodayAppointments = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const appointments = await appointmentService.getDoctorAppointmentsByDate(today);
      setTodayAppointments(appointments.slice(0, 5)); // Show only first 5
    } catch (err) {
      console.error('Error fetching today appointments:', err);
    }
  };

  const handleAppointmentStatusUpdate = async (appointmentId, status) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, status);
      fetchTodayAppointments(); // Refresh appointments
    } catch (err) {
      console.error('Error updating appointment status:', err);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">
            <AlertCircle className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </Layout>
    );
  }

  const stats = [
    {
      name: 'Today\'s Appointments',
      value: dashboardData?.todayAppointments || 0,
      icon: Calendar,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      change: '+12%'
    },
    {
      name: 'Total Patients',
      value: dashboardData?.totalPatients || 0,
      icon: Users,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      change: '+3%'
    },
    {
      name: 'Completed Today',
      value: dashboardData?.completedToday || 0,
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      change: '+8%'
    },
    {
      name: 'Average Wait Time',
      value: `${dashboardData?.avgWaitTime || 15} min`,
      icon: Clock,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      change: '-5%'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-3">
            <Stethoscope className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, Dr. {dashboardData?.doctorName || 'Doctor'}
              </h1>
              <p className="text-blue-100 mt-1">
                {dashboardData?.department} • {todayAppointments.length} appointments scheduled today
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className={`${stat.bgColor} border-0`} padding="p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`${stat.color} p-3 rounded-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className={`text-sm font-medium ${stat.textColor}`}>{stat.name}</p>
                      <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                    </div>
                  </div>
                  <div className={`text-sm font-medium ${stat.textColor}`}>{stat.change}</div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Appointments */}
          <div className="lg:col-span-2">
            <Card title="Today's Appointments" subtitle={`${todayAppointments.length} appointments scheduled`}>
              {todayAppointments.length > 0 ? (
                <div className="space-y-4">
                  {todayAppointments.map((appointment, index) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-blue-600">
                            {appointment.patientName?.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{appointment.patientName}</p>
                          <p className="text-sm text-gray-500">{appointment.reason}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(appointment.appointmentDateTime).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'SCHEDULED' ? 'bg-blue-100 text-blue-800' :
                          appointment.status === 'COMPLETED' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status}
                        </span>
                        
                        {appointment.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleAppointmentStatusUpdate(appointment.id, 'COMPLETED')}
                            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <div className="pt-4 border-t">
                    <Button variant="outline" size="sm" className="w-full">
                      View All Appointments
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No appointments today</h3>
                  <p className="mt-1 text-sm text-gray-500">Enjoy your free schedule!</p>
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions & Recent Activity */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card title="Quick Actions" className="h-fit">
              <div className="space-y-3">
                <Button variant="primary" className="w-full justify-start" size="md">
                  <Users className="h-4 w-4 mr-2" />
                  View My Patients
                </Button>
                
                <Button variant="outline" className="w-full justify-start" size="md">
                  <Calendar className="h-4 w-4 mr-2" />
                  Manage Schedule
                </Button>
                
                <Button variant="outline" className="w-full justify-start" size="md">
                  <Stethoscope className="h-4 w-4 mr-2" />
                  Create Prescription
                </Button>
                
                <Button variant="outline" className="w-full justify-start" size="md">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
              </div>
            </Card>

            {/* Patient Alerts */}
            <Card title="Patient Alerts" subtitle="Requires attention">
              <div className="space-y-3">
                {dashboardData?.alerts?.length > 0 ? (
                  dashboardData.alerts.map((alert, index) => (
                    <div key={index} className={`p-3 rounded-lg ${
                      alert.priority === 'HIGH' ? 'bg-red-50 border border-red-200' :
                      alert.priority === 'MEDIUM' ? 'bg-yellow-50 border border-yellow-200' :
                      'bg-blue-50 border border-blue-200'
                    }`}>
                      <p className={`text-sm font-medium ${
                        alert.priority === 'HIGH' ? 'text-red-800' :
                        alert.priority === 'MEDIUM' ? 'text-yellow-800' :
                        'text-blue-800'
                      }`}>
                        {alert.patientName}
                      </p>
                      <p className={`text-xs mt-1 ${
                        alert.priority === 'HIGH' ? 'text-red-600' :
                        alert.priority === 'MEDIUM' ? 'text-yellow-600' :
                        'text-blue-600'
                      }`}>
                        {alert.message}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <AlertCircle className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500 mt-2">No alerts at this time</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DoctorDashboard;
