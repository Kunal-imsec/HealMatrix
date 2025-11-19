import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import HeroSection from "../../components/common/HeroSection";
import appointmentMgmtBg from "/assets/bg-book-appointment.jpg";
import receptionistService from "../../services/receptionistService";
import Button from "../../components/common/Button";
import Modal from "../../components/common/Modal";

const AppointmentManagementPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    loadAppointments();
  }, [selectedDate]);

  useEffect(() => {
    filterAppointments();
  }, [appointments, statusFilter]);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await receptionistService.getAppointmentsByDate(selectedDate);
      setAppointments(data);
    } catch (error) {
      console.error("Failed to load appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;
    if (statusFilter !== "all") {
      filtered = appointments.filter(apt => apt.status === statusFilter);
    }
    setFilteredAppointments(filtered);
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await receptionistService.updateAppointmentStatus(appointmentId, newStatus);
      setAppointments(appointments.map(apt => 
        apt.id === appointmentId ? { ...apt, status: newStatus } : apt
      ));
    } catch (error) {
      alert("Failed to update appointment status");
    }
  };

  const handleReschedule = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  return (
    <Layout>
      <HeroSection
        bgImage={appointmentMgmtBg}
        headline="Appointment Management"
        subtext="View, schedule, and manage patient appointments"
      />
      
      <div className="max-w-7xl mx-auto p-6">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Date</label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded p-2"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Status Filter</label>
              <select
                className="w-full border border-gray-300 rounded p-2"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button onClick={loadAppointments} className="w-full">
                Refresh Appointments
              </Button>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b">
            <h3 className="text-lg font-semibold">
              Appointments for {new Date(selectedDate).toLocaleDateString()}
              <span className="ml-2 text-sm text-gray-500">({filteredAppointments.length} total)</span>
            </h3>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">Loading appointments...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(appointment.dateTime).toLocaleTimeString()}
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-medium">{appointment.patientName}</div>
                          <div className="text-sm text-gray-500">{appointment.patientPhone}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">Dr. {appointment.doctorName}</td>
                      <td className="px-6 py-4">{appointment.appointmentType}</td>
                      <td className="px-6 py-4">
                        <select
                          className={`px-2 py-1 text-xs rounded border-0 ${
                            appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}
                          value={appointment.status}
                          onChange={(e) => handleStatusChange(appointment.id, e.target.value)}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            variant="secondary"
                            onClick={() => handleReschedule(appointment)}
                          >
                            Reschedule
                          </Button>
                          {appointment.status === 'pending' && (
                            <Button 
                              size="sm"
                              onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                            >
                              Confirm
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {filteredAppointments.length === 0 && (
                <div className="p-6 text-center text-gray-500">
                  No appointments found for the selected criteria.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reschedule Modal */}
      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Reschedule Appointment</h3>
            <p className="mb-4">Patient: {selectedAppointment?.patientName}</p>
            <input
              type="datetime-local"
              className="w-full border border-gray-300 rounded p-2 mb-4"
            />
            <div className="flex space-x-3">
              <Button onClick={() => setShowModal(false)} variant="secondary">
                Cancel
              </Button>
              <Button>Save Changes</Button>
            </div>
          </div>
        </Modal>
      )}
    </Layout>
  );
};

export default AppointmentManagementPage;
