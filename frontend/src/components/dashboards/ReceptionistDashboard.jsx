import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import dashboardService from '../../services/dashboardService';
import { appointmentService } from '../../services/appointmentService';
import { Phone, Calendar, Users, CreditCard, UserPlus, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const ReceptionistDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchPendingAppointments();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getReceptionistDashboard();
      setDashboardData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingAppointments = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const appointments = await appointmentService.getAppointmentsByStatus('SCHEDULED');
      setPendingAppointments(appointments.filter(apt => 
        apt.appointmentDateTime.startsWith(today)
      ).slice(0, 6));
    } catch (err) {
      console.error('Error fetching pending appointments:', err);
    }
  };

  const handleAppointmentConfirm = async (appointmentId) => {
    try {
      await appointmentService.updateAppointmentStatus(appointmentId, 'CONFIRMED');
      fetchPendingAppointments();
    } catch (err) {
      console.error('Error confirming appointment:', err);
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
            <AlertTriangle className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </Layout>
    );
  }

  const stats = [
    {
      name: 'Today\'s Check-ins',
      value: dashboardData?.todayCheckins || 0,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      name: 'Pending Appointments',
      value: pendingAppointments.length || 0,
      icon: Calendar,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      name: 'Phone Calls',
      value: dashboardData?.phoneCalls || 0,
      icon: Phone,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      name: 'Billing Processed',
      value: dashboardData?.billingProcessed || 0,
      icon: CreditCard,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-3">
            <Phone className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">
                Reception Desk - {dashboardData?.receptionistName || 'Team Member'}
              </h1>
              <p className="text-indigo-100 mt-1">
                Front Desk Operations • {pendingAppointments.length} appointments need confirmation
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
                <div className="flex items-center">
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div className="ml-4">
                    <p className={`text-sm font-medium ${stat.textColor}`}>{stat.name}</p>
                    <p className={`text-2xl font-bold ${stat.textColor}`}>{stat.value}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pending Appointments */}
          <div className="lg:col-span-2">
            <Card title="Pending Confirmations" subtitle={`${pendingAppointments.length} appointments awaiting confirmation`}>
              {pendingAppointments.length > 0 ? (
                <div className="space-y-4">
                  {pendingAppointments.map((appointment, index) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-yellow-600">
                            {appointment.patientName?.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{appointment.patientName}</p>
                          <p className="text-sm text-gray-600">Dr. {appointment.doctorName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {new Date(appointment.appointmentDateTime).toLocaleTimeString('en-US', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span className="text-xs text-gray-500">•</span>
                            <span className="text-xs text-gray-500">{appointment.reason}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleAppointmentConfirm(appointment.id)}
                          className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center space-x-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          <span>Confirm</span>
                        </button>
                        <button className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700">
                          Call
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">All appointments confirmed</h3>
                  <p className="mt-1 text-sm text-gray-500">No pending confirmations at this time.</p>
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions & Today's Summary */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card title="Quick Actions" className="h-fit">
              <div className="space-y-3">
                <Button variant="primary" className="w-full justify-start" size="md">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Register New Patient
                </Button>
                
                <Button variant="outline" className="w-full justify-start" size="md">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Appointment
                </Button>
                
                <Button variant="outline" className="w-full justify-start" size="md">
                  <Phone className="h-4 w-4 mr-2" />
                  Patient Check-in
                </Button>
                
                <Button variant="outline" className="w-full justify-start" size="md">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Process Payment
                </Button>
              </div>
            </Card>

            {/* Today's Summary */}
            <Card title="Today's Summary" className="h-fit">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Total Appointments</span>
                  <span className="text-sm font-medium">{dashboardData?.totalAppointments || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Walk-ins</span>
                  <span className="text-sm font-medium">{dashboardData?.walkIns || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Cancellations</span>
                  <span className="text-sm font-medium text-red-600">{dashboardData?.cancellations || 0}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Revenue Today</span>
                  <span className="text-sm font-medium text-green-600">
                    ${dashboardData?.revenueToday || '0.00'}
                  </span>
                </div>
              </div>
            </Card>

            {/* Urgent Messages */}
            <Card title="Urgent Messages" subtitle="Requires immediate attention">
              <div className="space-y-3">
                {dashboardData?.urgentMessages?.length > 0 ? (
                  dashboardData.urgentMessages.map((message, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-medium text-red-800">{message.title}</p>
                      <p className="text-xs text-red-600 mt-1">{message.description}</p>
                      <p className="text-xs text-red-500 mt-2">{message.timestamp}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Phone className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500 mt-2">No urgent messages</p>
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

export default ReceptionistDashboard;
