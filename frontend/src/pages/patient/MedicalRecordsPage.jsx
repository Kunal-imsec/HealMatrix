import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import HeroSection from "../../components/common/HeroSection";
import medicalRecordsBg from "/assets/bg-medical-records.jpg";
import { patientService } from "../../services/patientService";
import Table from "../../components/common/Table";

const MedicalRecordsPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientService.getMedicalRecords()
      .then(setRecords)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { header: "Record ID", accessor: "id" },
    { header: "Date", accessor: (r) => new Date(r.date).toLocaleDateString() },
    { header: "Description", accessor: "description" },
    { header: "Doctor", accessor: (r) => `${r.doctor.firstName} ${r.doctor.lastName}` },
  ];

  return (
    <Layout>
      <HeroSection bgImage={medicalRecordsBg} headline="Medical Records" subtext="View your medical history" />
      {loading ? <p>Loading records...</p> : <Table columns={columns} data={records} />}
    </Layout>
  );
};

export default MedicalRecordsPage;
