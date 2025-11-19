import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import AppointmentList from "../../components/appointments/AppointmentList";
import { doctorService } from "../../services/doctorService";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorService.getAppointments()
      .then(setAppointments)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-6">My Appointments</h2>
      {loading ? <p>Loading appointments...</p> : <AppointmentList appointments={appointments} />}
    </Layout>
  );
};

export default AppointmentsPage;
