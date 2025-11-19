import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import dashboardService from "../../services/dashboardService";

const StaffRegistrationPage = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    role: "DOCTOR",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.firstName) errs.firstName = "Required";
    if (!form.lastName) errs.lastName = "Required";
    if (!form.email) errs.email = "Required";
    if (!form.password) errs.password = "Required";
    if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords must match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await dashboardService.registerStaff(form);
      setSuccess(true);
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        role: "DOCTOR",
        password: "",
        confirmPassword: ""
      });
    } catch (err) {
      setErrors({ submit: err.message || "Registration failed." });
    } finally {
      setLoading(false);
    }
  };

  if (success) return (
    <Layout>
      <p className="max-w-md mx-auto p-4 bg-green-100 text-green-800 rounded mt-6 text-center">
        Staff registered successfully!
      </p>
    </Layout>
  );

  return (
    <Layout>
      <h2 className="text-2xl font-semibold mb-4">Register Staff</h2>
      <form className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4" onSubmit={handleSubmit}>
        <Input label="First Name" name="firstName" value={form.firstName} onChange={handleChange} error={errors.firstName} required />
        <Input label="Last Name" name="lastName" value={form.lastName} onChange={handleChange} error={errors.lastName} required />
        <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} error={errors.email} required />
        <label className="block font-semibold">Role</label>
        <select name="role" value={form.role} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 mb-4">
          <option value="DOCTOR">Doctor</option>
          <option value="NURSE">Nurse</option>
          <option value="RECEPTIONIST">Receptionist</option>
          <option value="PHARMACIST">Pharmacist</option>
          <option value="LAB_TECHNICIAN">Lab Technician</option>
        </select>
        <Input label="Password" type="password" name="password" value={form.password} onChange={handleChange} error={errors.password} required />
        <Input label="Confirm Password" type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} error={errors.confirmPassword} required />
        {errors.submit && <p className="text-red-600 text-sm">{errors.submit}</p>}
        <Button type="submit" loading={loading} className="w-full" size="lg">Register Staff</Button>
      </form>
    </Layout>
  );
};

export default StaffRegistrationPage;
