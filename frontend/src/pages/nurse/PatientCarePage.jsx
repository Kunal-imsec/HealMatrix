import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import HeroSection from "../../components/common/HeroSection";
import patientCareBg from "/assets/bg-nurse.jpg";
import nurseService from "../../services/nurseService";
import Button from "../../components/common/Button";

const PatientCarePage = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [careNotes, setCareNotes] = useState("");
  const [vitalSigns, setVitalSigns] = useState({
    temperature: "",
    bloodPressure: "",
    heartRate: "",
    respiratoryRate: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    nurseService.getAssignedPatients()
      .then(setPatients)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleVitalSignsSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return;
    
    setSaving(true);
    try {
      await nurseService.recordVitalSigns(selectedPatient.id, vitalSigns);
      alert("Vital signs recorded successfully!");
      setVitalSigns({ temperature: "", bloodPressure: "", heartRate: "", respiratoryRate: "" });
    } catch (error) {
      alert("Failed to record vital signs");
    } finally {
      setSaving(false);
    }
  };

  const handleCareNotesSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient || !careNotes.trim()) return;
    
    setSaving(true);
    try {
      await nurseService.addCareNote(selectedPatient.id, careNotes);
      alert("Care note added successfully!");
      setCareNotes("");
    } catch (error) {
      alert("Failed to add care note");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <HeroSection
        bgImage={patientCareBg}
        headline="Patient Care"
        subtext="Monitor and record patient care activities"
      />
      
      <div className="max-w-7xl mx-auto p-6">
        {loading ? (
          <p>Loading assigned patients...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient List */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold mb-4">Assigned Patients</h3>
              <div className="space-y-2">
                {patients.map((patient) => (
                  <div
                    key={patient.id}
                    className={`p-3 rounded cursor-pointer transition ${
                      selectedPatient?.id === patient.id
                        ? "bg-indigo-100 border-2 border-indigo-300"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => setSelectedPatient(patient)}
                  >
                    <p className="font-medium">{patient.firstName} {patient.lastName}</p>
                    <p className="text-sm text-gray-500">Room: {patient.roomNumber}</p>
                    <p className="text-sm text-gray-500">Condition: {patient.condition}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Patient Details & Care Forms */}
            <div className="lg:col-span-2 space-y-6">
              {selectedPatient ? (
                <>
                  {/* Patient Info */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p><strong>Name:</strong> {selectedPatient.firstName} {selectedPatient.lastName}</p>
                        <p><strong>Age:</strong> {selectedPatient.age}</p>
                        <p><strong>Room:</strong> {selectedPatient.roomNumber}</p>
                      </div>
                      <div>
                        <p><strong>Condition:</strong> {selectedPatient.condition}</p>
                        <p><strong>Admitted:</strong> {new Date(selectedPatient.admissionDate).toLocaleDateString()}</p>
                        <p><strong>Doctor:</strong> Dr. {selectedPatient.assignedDoctor}</p>
                      </div>
                    </div>
                  </div>

                  {/* Vital Signs Form */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Record Vital Signs</h3>
                    <form onSubmit={handleVitalSignsSubmit} className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Temperature (°F)</label>
                        <input
                          type="number"
                          step="0.1"
                          className="w-full border border-gray-300 rounded p-2"
                          value={vitalSigns.temperature}
                          onChange={(e) => setVitalSigns({...vitalSigns, temperature: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Blood Pressure</label>
                        <input
                          type="text"
                          placeholder="120/80"
                          className="w-full border border-gray-300 rounded p-2"
                          value={vitalSigns.bloodPressure}
                          onChange={(e) => setVitalSigns({...vitalSigns, bloodPressure: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Heart Rate (bpm)</label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded p-2"
                          value={vitalSigns.heartRate}
                          onChange={(e) => setVitalSigns({...vitalSigns, heartRate: e.target.value})}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Respiratory Rate</label>
                        <input
                          type="number"
                          className="w-full border border-gray-300 rounded p-2"
                          value={vitalSigns.respiratoryRate}
                          onChange={(e) => setVitalSigns({...vitalSigns, respiratoryRate: e.target.value})}
                        />
                      </div>
                      <div className="col-span-2">
                        <Button type="submit" loading={saving} className="w-full">
                          Record Vital Signs
                        </Button>
                      </div>
                    </form>
                  </div>

                  {/* Care Notes Form */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Add Care Note</h3>
                    <form onSubmit={handleCareNotesSubmit}>
                      <textarea
                        className="w-full border border-gray-300 rounded p-3 h-32"
                        placeholder="Enter care notes..."
                        value={careNotes}
                        onChange={(e) => setCareNotes(e.target.value)}
                      ></textarea>
                      <Button type="submit" loading={saving} className="mt-3">
                        Add Care Note
                      </Button>
                    </form>
                  </div>
                </>
              ) : (
                <div className="bg-white rounded-lg shadow p-6 text-center">
                  <p className="text-gray-500">Select a patient to view details and record care information</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default PatientCarePage;
