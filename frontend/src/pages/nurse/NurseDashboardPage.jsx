import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import HeroSection from "../../components/common/HeroSection";
import nurseBg from "/assets/bg-nurse.jpg";
import Card from "../../components/common/Card";
import dashboardService from "../../services/dashboardService";

const NurseDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dashboardService.getNurseDashboard()
      .then(setStats)
      .catch((err) => {
        console.error("Failed to load nurse dashboard:", err);
        setError("Failed to load dashboard data");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <HeroSection
        bgImage={nurseBg}
        headline="Nurse Dashboard"
        subtext="Monitor patient care and manage your daily tasks"
      />
      <div className="max-w-7xl mx-auto p-6">
        {loading && (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2">Loading dashboard...</span>
          </div>
        )}
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card title="Assigned Patients" value={stats.assignedPatients} />
            <Card title="Pending Tasks" value={stats.pendingTasks} />
            <Card title="Completed Tasks" value={stats.completedTasks} />
            <Card title="Critical Alerts" value={stats.criticalAlerts} />
          </div>
        )}
        
        {stats && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
              <div className="space-y-3">
                {stats.recentActivities?.map((activity, index) => (
                  <div key={index} className="flex items-center p-3 bg-gray-50 rounded">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.description}</p>
                      <p className="text-xs text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Today's Schedule</h3>
              <div className="space-y-3">
                {stats.todaySchedule?.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-blue-50 rounded">
                    <div>
                      <p className="text-sm font-medium">{item.task}</p>
                      <p className="text-xs text-gray-500">{item.time}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded ${
                      item.priority === 'high' ? 'bg-red-100 text-red-800' :
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {item.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NurseDashboardPage;
