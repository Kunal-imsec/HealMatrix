import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import HeroSection from "../../components/common/HeroSection";
import doctorBg from "/assets/bg-doctor.jpg";
import Card from "../../components/common/Card";
import dashboardService from "../../services/dashboardService";

const DoctorDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getDoctorDashboard()
      .then(setStats)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <HeroSection
        bgImage={doctorBg}
        headline="Doctor Dashboard"
        subtext="View your appointments, patients, and schedule"
      />
      <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          <p>Loading doctor stats...</p>
        ) : stats ? (
          <>
            <Card title="Today's Appointments" value={stats.appointmentsToday} />
            <Card title="Upcoming Appointments" value={stats.upcomingAppointments} />
            <Card title="Patients Assigned" value={stats.patientsAssigned} />
          </>
        ) : (
          <p>No data available</p>
        )}
      </div>
    </Layout>
  );
};

export default DoctorDashboardPage;
