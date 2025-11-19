import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Table from "../../components/common/Table";
import { doctorService } from "../../services/doctorService";

const PatientListPage = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    doctorService.getPatientList()
      .then(setPatients)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: (p) => `${p.firstName} ${p.lastName}` },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phoneNumber" },
    { header: "Last Visit", accessor: "lastVisitDate" }
  ];

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">My Patients</h2>
      {loading ? (
        <p>Loading patients...</p>
      ) : (
        <Table columns={columns} data={patients} />
      )}
    </Layout>
  );
};

export default PatientListPage;
