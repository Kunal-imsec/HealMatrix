import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import StatCard from './components/StatCard';
import ChartCard from './components/ChartCard';
import RecentItems from './components/RecentItems';
import QuickActions from './components/QuickActions';
import NotificationPanel from './components/NotificationPanel';
import { 
  Pill, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle,
  Clock,
  Users,
  FileText
} from 'lucide-react';

const PharmacistDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      pendingPrescriptions: 12,
      lowStockItems: 8,
      dispensedToday: 45,
      totalInventory: 1247
    },
    recentPrescriptions: [],
    lowStockAlerts: [],
    notifications: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Simulate API call
      setTimeout(() => {
        setDashboardData({
          stats: {
            pendingPrescriptions: 12,
            lowStockItems: 8,
            dispensedToday: 45,
            totalInventory: 1247,
            previousPendingPrescriptions: 8,
            previousLowStockItems: 12,
            previousDispensedToday: 38,
            previousTotalInventory: 1220
          },
          recentPrescriptions: [
            {
              id: 1,
              title: 'Prescription #RX-001234',
              subtitle: 'John Doe - Amoxicillin 500mg',
              date: new Date().toISOString(),
              status: 'pending',
              type: 'prescription'
            },
            {
              id: 2,
              title: 'Prescription #RX-001235',
              subtitle: 'Jane Smith - Lisinopril 10mg',
              date: new Date(Date.now() - 3600000).toISOString(),
              status: 'pending',
              type: 'prescription'
            },
            {
              id: 3,
              title: 'Prescription #RX-001233',
              subtitle: 'Robert Johnson - Metformin 850mg',
              date: new Date(Date.now() - 7200000).toISOString(),
              status: 'completed',
              type: 'prescription'
            }
          ],
          lowStockAlerts: [
            {
              id: 1,
              title: 'Amoxicillin 500mg',
              subtitle: 'Only 15 units remaining',
              status: 'low',
              priority: 'high',
              type: 'medication'
            },
            {
              id: 2,
              title: 'Ibuprofen 400mg',
              subtitle: 'Only 8 units remaining',
              status: 'critical',
              priority: 'high',
              type: 'medication'
            }
          ],
          notifications: [
            {
              id: 1,
              title: 'Low Stock Alert',
              message: 'Ibuprofen 400mg is running low (8 units remaining)',
              type: 'warning',
              priority: 'high',
              timestamp: new Date().toISOString(),
              read: false
            },
            {
              id: 2,
              title: 'New Prescription',
              message: 'New prescription received for John Doe',
              type: 'info',
              timestamp: new Date(Date.now() - 1800000).toISOString(),
              read: false
            }
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const quickActions = [
    {
      id: 'dispense-prescription',
      label: 'Dispense Prescription',
      icon: Pill,
      color: 'blue',
      onClick: () => console.log('Dispense Prescription')
    },
    {
      id: 'check-inventory',
      label: 'Check Inventory',
      icon: Package,
      color: 'green',
      onClick: () => console.log('Check Inventory')
    },
    {
      id: 'restock-medication',
      label: 'Restock Medication',
      icon: TrendingUp,
      color: 'purple',
      onClick: () => console.log('Restock Medication')
    },
    {
      id: 'drug-interaction',
      label: 'Check Drug Interactions',
      icon: AlertTriangle,
      color: 'yellow',
      onClick: () => console.log('Check Drug Interactions')
    }
  ];

  const chartData = [
    { name: 'Mon', prescriptions: 32, dispensed: 28 },
    { name: 'Tue', prescriptions: 45, dispensed: 42 },
    { name: 'Wed', prescriptions: 38, dispensed: 35 },
    { name: 'Thu', prescriptions: 52, dispensed: 48 },
    { name: 'Fri', prescriptions: 61, dispensed: 58 },
    { name: 'Sat', prescriptions: 28, dispensed: 25 },
    { name: 'Sun', prescriptions: 22, dispensed: 20 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-sm">
        <div className="px-6 py-8 sm:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user?.firstName}!
              </h1>
              <p className="text-blue-100 mt-2">
                You have {dashboardData.stats.pendingPrescriptions} pending prescriptions and {dashboardData.stats.lowStockItems} items need restocking.
              </p>
            </div>
            <div className="hidden sm:block">
              <div className="bg-white bg-opacity-20 rounded-lg p-4">
                <Pill className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Prescriptions"
          value={dashboardData.stats.pendingPrescriptions}
          previousValue={dashboardData.stats.previousPendingPrescriptions}
          icon={Clock}
          color="yellow"
          subtitle="awaiting dispensing"
          loading={loading}
        />
        
        <StatCard
          title="Low Stock Items"
          value={dashboardData.stats.lowStockItems}
          previousValue={dashboardData.stats.previousLowStockItems}
          icon={AlertTriangle}
          color="red"
          subtitle="need restocking"
          loading={loading}
        />
        
        <StatCard
          title="Dispensed Today"
          value={dashboardData.stats.dispensedToday}
          previousValue={dashboardData.stats.previousDispensedToday}
          icon={CheckCircle}
          color="green"
          subtitle="prescriptions"
          loading={loading}
        />
        
        <StatCard
          title="Total Inventory"
          value={dashboardData.stats.totalInventory}
          previousValue={dashboardData.stats.previousTotalInventory}
          icon={Package}
          color="blue"
          subtitle="medications"
          loading={loading}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prescription Activity Chart */}
          <ChartCard
            title="Prescription Activity"
            subtitle="Weekly overview of prescriptions received vs dispensed"
            loading={loading}
          >
            <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
              {loading ? (
                <div className="animate-pulse text-gray-400">Loading chart...</div>
              ) : (
                <div className="text-center text-gray-500">
                  <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>Prescription activity chart would be displayed here</p>
                  <p className="text-sm mt-2">Integration with charting library needed</p>
                </div>
              )}
            </div>
          </ChartCard>

          {/* Quick Actions */}
          <QuickActions
            title="Pharmacy Quick Actions"
            actions={quickActions}
            layout="grid"
            size="md"
          />

          {/* Recent Prescriptions */}
          <RecentItems
            title="Recent Prescriptions"
            items={dashboardData.recentPrescriptions}
            type="prescription"
            loading={loading}
            onItemClick={(item) => console.log('Clicked prescription:', item)}
            onViewAll={() => console.log('View all prescriptions')}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Notifications */}
          <NotificationPanel
            notifications={dashboardData.notifications}
            loading={loading}
            onMarkAsRead={(id) => console.log('Mark as read:', id)}
            onMarkAllAsRead={() => console.log('Mark all as read')}
            onNotificationClick={(notification) => console.log('Clicked notification:', notification)}
          />

          {/* Low Stock Alerts */}
          <RecentItems
            title="Low Stock Alerts"
            items={dashboardData.lowStockAlerts}
            type="medication"
            loading={loading}
            onItemClick={(item) => console.log('Clicked medication:', item)}
            onViewAll={() => console.log('View all low stock items')}
            showViewAll={true}
            maxItems={5}
          />

          {/* Today's Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Summary</h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Prescriptions Dispensed</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {loading ? '...' : dashboardData.stats.dispensedToday}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Pending Prescriptions</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {loading ? '...' : dashboardData.stats.pendingPrescriptions}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Critical Stock Items</span>
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {loading ? '...' : Math.floor(dashboardData.stats.lowStockItems / 2)}
                </span>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">Efficiency Rate</span>
                  <span className="text-sm font-medium text-green-600">
                    {loading ? '...' : '94%'}
                  </span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacistDashboard;
