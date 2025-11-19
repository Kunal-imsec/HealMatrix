import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import Table from "../../components/common/Table";
import dashboardService from "../../services/dashboardService";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService.getUserList()
      .then(setUsers)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { header: "ID", accessor: "id" },
    { header: "Name", accessor: (u) => `${u.firstName} ${u.lastName}` },
    { header: "Email", accessor: (u) => u.email },
    { header: "Role", accessor: (u) => u.role },
    { header: "Status", accessor: (u) => u.status }
  ];

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">User Management</h2>
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <Table columns={columns} data={users} />
      )}
    </Layout>
  );
};

export default UserManagementPage;
