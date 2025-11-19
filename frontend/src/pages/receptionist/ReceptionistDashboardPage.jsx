import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import HeroSection from "../../components/common/HeroSection";
import receptionistBg from "/assets/bg-receptionist.jpg";
import Card from "../../components/common/Card";
import dashboardService from "../../services/dashboardService";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";

const ReceptionistDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      dashboardService.getReceptionistDashboard(),
      dashboardService.getTodayAppointments()
    ])
      .then(([statsData, appointmentsData]) => {
        setStats(statsData);
        setTodayAppointments(appointmentsData);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <HeroSection
        bgImage={receptionistBg}
        headline="Receptionist Dashboard"
        subtext="Manage appointments, patient registrations, and front desk operations"
      />
      
      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2">Loading dashboard...</span>
          </div>
        ) : (
          <>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats && (
                <>
                  <Card title="Today's Appointments" value={stats.todayAppointments} />
                  <Card title="Pending Check-ins" value={stats.pendingCheckIns} />
                  <Card title="New Registrations" value={stats.newRegistrations} />
                  <Card title="Waiting Patients" value={stats.waitingPatients} />
                </>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button 
                  onClick={() => navigate("/receptionist/appointment-management")}
                  className="p-4 h-auto flex flex-col items-center space-y-2"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Manage Appointments</span>
                </Button>
                
                <Button 
                  onClick={() => navigate("/receptionist/patient-registration")}
                  className="p-4 h-auto flex flex-col items-center space-y-2"
                  variant="secondary"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                  <span>Register New Patient</span>
                </Button>
                
                <Button 
                  variant="secondary"
                  className="p-4 h-auto flex flex-col items-center space-y-2"
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Generate Reports</span>
                </Button>
              </div>
            </div>

            {/* Today's Appointments */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-semibold mb-4">Today's Appointments</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Time</th>
                      <th className="text-left py-2">Patient</th>
                      <th className="text-left py-2">Doctor</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-left py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {todayAppointments.map((appointment) => (
                      <tr key={appointment.id} className="border-b hover:bg-gray-50">
                        <td className="py-3">{new Date(appointment.dateTime).toLocaleTimeString()}</td>
                        <td className="py-3">{appointment.patientName}</td>
                        <td className="py-3">Dr. {appointment.doctorName}</td>
                        <td className="py-3">
                          <span className={`px-2 py-1 text-xs rounded ${
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <Button size="sm" variant="secondary">
                            Check In
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
};

export default ReceptionistDashboardPage;
