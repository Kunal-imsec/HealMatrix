import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import HeroSection from "../../components/common/HeroSection";
import bookAppointmentBg from "/assets/bg-book-appointment.jpg";
import { appointmentService } from "../../services/appointmentService";
import Button from "../../components/common/Button";

const BookAppointmentPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    appointmentService.getAvailableDoctors()
      .then(setDoctors)
      .catch(console.error);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !date) return alert("Select doctor and date");
    setLoading(true);
    try {
      await appointmentService.bookAppointment({ doctorId: selectedDoctor, date });
      setSuccess(true);
    } catch (error) {
      alert("Failed to book appointment");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="max-w-lg mx-auto p-6 bg-green-100 rounded text-green-900 mt-10 text-center">
          Appointment booked successfully!
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <HeroSection
        bgImage={bookAppointmentBg}
        headline="Book an Appointment"
        subtext="Schedule a visit with your preferred doctor"
      />
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white rounded shadow p-6 mt-6">
        <label className="block font-semibold mb-1">Doctor</label>
        <select
          className="w-full border border-gray-300 rounded p-2 mb-4"
          value={selectedDoctor}
          onChange={(e) => setSelectedDoctor(e.target.value)}
          required
        >
          <option value="">Select a doctor</option>
          {doctors.map((doc) => (
            <option key={doc.id} value={doc.id}>{doc.firstName} {doc.lastName}</option>
          ))}
        </select>
        <label className="block font-semibold mb-1">Date and Time</label>
        <input
          type="datetime-local"
          className="w-full border border-gray-300 rounded p-2 mb-4"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <Button loading={loading} type="submit" className="w-full" size="lg">Book Appointment</Button>
      </form>
    </Layout>
  );
};

export default BookAppointmentPage;
