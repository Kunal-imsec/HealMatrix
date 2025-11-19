import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import { doctorService } from "../../services/doctorService";
import AppointmentCalendar from "../../components/appointments/AppointmentCalendar";

const SchedulePage = () => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorService.getSchedule()
      .then(setSchedule)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-6">My Schedule</h2>
      {loading ? <p>Loading schedule...</p> : <AppointmentCalendar schedule={schedule} />}
    </Layout>
  );
};

export default SchedulePage;
