import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import HeroSection from "../../components/common/HeroSection";
import prescriptionsBg from "/assets/bg-prescriptions.jpg";
import { patientService } from "../../services/patientService";
import Table from "../../components/common/Table";

const PrescriptionsPage = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    patientService.getPrescriptions()
      .then(setPrescriptions)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { header: "Prescription ID", accessor: "id" },
    { header: "Date", accessor: (p) => new Date(p.date).toLocaleDateString() },
    { header: "Medication", accessor: (p) => p.medicationName },
    { header: "Dosage", accessor: (p) => p.dosage },
  ];

  return (
    <Layout>
      <HeroSection bgImage={prescriptionsBg} headline="Prescriptions" subtext="Access your current and past prescriptions" />
      {loading ? <p>Loading prescriptions...</p> : <Table columns={columns} data={prescriptions} />}
    </Layout>
  );
};

export default PrescriptionsPage;
