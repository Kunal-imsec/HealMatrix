import React, { useEffect, useState } from "react";
import Layout from "../../components/layout/Layout";
import HeroSection from "../../components/common/HeroSection";
import billingBg from "/assets/bg-billing.jpg";
import { billingService } from "../../services/billingService";
import Table from "../../components/common/Table";

const BillingPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    billingService.getBillingHistory()
      .then(setBills)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { header: "Bill ID", accessor: "id" },
    { header: "Date", accessor: (b) => new Date(b.issueDate).toLocaleDateString() },
    { header: "Amount", accessor: (b) => `$${b.amount}` },
    { header: "Status", accessor: "status" },
  ];

  return (
    <Layout>
      <HeroSection bgImage={billingBg} headline="Billing" subtext="View your payment history and status" />
      {loading ? <p>Loading bills...</p> : <Table columns={columns} data={bills} />}
    </Layout>
  );
};

export default BillingPage;
