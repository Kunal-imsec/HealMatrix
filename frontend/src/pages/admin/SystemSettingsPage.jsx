import React from "react";
import Layout from "../../components/layout/Layout";

const SystemSettingsPage = () => {
  // You can implement settings forms here later

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">System Settings</h2>
      <p className="max-w-4xl mx-auto bg-white rounded shadow p-6">
        Configure general hospital settings here.
      </p>
    </Layout>
  );
};

export default SystemSettingsPage;
