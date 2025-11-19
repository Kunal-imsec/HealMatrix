import React, { useState, useEffect } from 'react';
import Layout from '../layout/Layout';
import Card from '../common/Card';
import Button from '../common/Button';
import LoadingSpinner from '../common/LoadingSpinner';
import dashboardService from '../../services/dashboardService';
import { Heart, Clipboard, Users, Activity, Plus, Bell, CheckCircle2, Clock } from 'lucide-react';

const NurseDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [activeTasks, setActiveTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    fetchActiveTasks();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardService.getNurseDashboard();
      setDashboardData(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveTasks = async () => {
    try {
      // This would be replaced with actual nurse task service
      const mockTasks = [
        { id: 1, patientName: 'John Smith', task: 'Vital Signs Check', room: '101A', priority: 'HIGH', time: '10:30 AM' },
        { id: 2, patientName: 'Sarah Johnson', task: 'Medication Administration', room: '203B', priority: 'MEDIUM', time: '11:00 AM' },
        { id: 3, patientName: 'Mike Davis', task: 'Post-Op Monitoring', room: '305C', priority: 'HIGH', time: '11:30 AM' },
      ];
      setActiveTasks(mockTasks);
    } catch (err) {
      console.error('Error fetching tasks:', err);
    }
  };

  const handleTaskComplete = async (taskId) => {
    try {
      setActiveTasks(prev => prev.filter(task => task.id !== taskId));
      // Here you would call the actual API to mark task as complete
    } catch (err) {
      console.error('Error completing task:', err);
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
            <Bell className="mx-auto h-12 w-12" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Dashboard</h3>
          <p className="text-gray-600">{error}</p>
        </div>
      </Layout>
    );
  }

  const stats = [
    {
      name: 'Active Patients',
      value: dashboardData?.activePatients || 0,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700'
    },
    {
      name: 'Tasks Pending',
      value: activeTasks.length || 0,
      icon: Clipboard,
      color: 'bg-yellow-500',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700'
    },
    {
      name: 'Tasks Completed',
      value: dashboardData?.completedTasks || 0,
      icon: CheckCircle2,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700'
    },
    {
      name: 'Critical Alerts',
      value: dashboardData?.criticalAlerts || 0,
      icon: Activity,
      color: 'bg-red-500',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700'
    }
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg p-6 text-white">
          <div className="flex items-center space-x-3">
            <Heart className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">
                Welcome, Nurse {dashboardData?.nurseName || 'Care Provider'}
              </h1>
              <p className="text-pink-100 mt-1">
                {dashboardData?.department} Ward • {activeTasks.filter(t => t.priority === 'HIGH').length} high priority tasks
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
          {/* Active Tasks */}
          <div className="lg:col-span-2">
            <Card title="Active Tasks" subtitle={`${activeTasks.length} tasks requiring attention`}>
              {activeTasks.length > 0 ? (
                <div className="space-y-4">
                  {activeTasks.map((task, index) => (
                    <div key={task.id} className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
                      task.priority === 'HIGH' ? 'bg-red-50 border-red-400' :
                      task.priority === 'MEDIUM' ? 'bg-yellow-50 border-yellow-400' :
                      'bg-blue-50 border-blue-400'
                    }`}>
                      <div className="flex items-center space-x-4">
                        <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                          task.priority === 'HIGH' ? 'bg-red-100' :
                          task.priority === 'MEDIUM' ? 'bg-yellow-100' :
                          'bg-blue-100'
                        }`}>
                          <span className="text-xs font-medium">
                            {task.room}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{task.patientName}</p>
                          <p className="text-sm text-gray-600">{task.task}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{task.time}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                              task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleTaskComplete(task.id)}
                        className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Complete</span>
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clipboard className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">All tasks completed</h3>
                  <p className="mt-1 text-sm text-gray-500">Great work! No pending tasks at this time.</p>
                </div>
              )}
            </Card>
          </div>

          {/* Quick Actions & Patient Alerts */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card title="Quick Actions" className="h-fit">
              <div className="space-y-3">
                <Button variant="primary" className="w-full justify-start" size="md">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vital Signs
                </Button>
                
                <Button variant="outline" className="w-full justify-start" size="md">
                  <Clipboard className="h-4 w-4 mr-2" />
                  Patient Care Plan
                </Button>
                
                <Button variant="outline" className="w-full justify-start" size="md">
                  <Activity className="h-4 w-4 mr-2" />
                  Update Patient Status
                </Button>
                
                <Button variant="outline" className="w-full justify-start" size="md">
                  <Heart className="h-4 w-4 mr-2" />
                  Medication Log
                </Button>
              </div>
            </Card>

            {/* Patient Vitals Alert */}
            <Card title="Critical Vitals" subtitle="Patients requiring immediate attention">
              <div className="space-y-3">
                {dashboardData?.criticalVitals?.length > 0 ? (
                  dashboardData.criticalVitals.map((vital, index) => (
                    <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-red-800">{vital.patientName}</p>
                          <p className="text-xs text-red-600">Room {vital.room}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-red-800">{vital.vitalType}</p>
                          <p className="text-xs text-red-600">{vital.value}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Activity className="mx-auto h-8 w-8 text-gray-400" />
                    <p className="text-sm text-gray-500 mt-2">All vitals within normal range</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Shift Information */}
            <Card title="Shift Information" className="h-fit">
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Current Shift</span>
                  <span className="text-sm font-medium">{dashboardData?.currentShift || 'Day Shift'}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Ward Assignment</span>
                  <span className="text-sm font-medium">{dashboardData?.wardAssignment || 'ICU Ward'}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Shift Ends</span>
                  <span className="text-sm font-medium">{dashboardData?.shiftEnd || '6:00 PM'}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NurseDashboard;
