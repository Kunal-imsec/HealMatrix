import React, { useState } from "react";
import Layout from "../../components/layout/Layout";
import HeroSection from "../../components/common/HeroSection";
import patientRegBg from "/assets/bg-patient-registration.jpg";
import receptionistService from "../../services/receptionistService";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";

const PatientRegistrationPage = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    insuranceProvider: "",
    insurancePolicyNumber: "",
    medicalHistory: ""
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First name is required";
    if (!formData.lastName) newErrors.lastName = "Last name is required";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone number is required";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required";
    if (!formData.gender) newErrors.gender = "Gender is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      await receptionistService.registerPatient(formData);
      setSuccess(true);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        insuranceProvider: "",
        insurancePolicyNumber: "",
        medicalHistory: ""
      });
    } catch (error) {
      setErrors({ submit: error.message || "Registration failed" });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto mt-10 p-6 bg-green-100 rounded-lg text-center">
          <h2 className="text-2xl font-bold text-green-800 mb-4">Registration Successful!</h2>
          <p className="text-green-700 mb-4">Patient has been registered successfully.</p>
          <Button onClick={() => setSuccess(false)}>Register Another Patient</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <HeroSection
        bgImage={patientRegBg}
        headline="Patient Registration"
        subtext="Register new patients and manage their information"
      />
      
      <div className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">New Patient Registration</h2>
          
          {/* Personal Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-indigo-700">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="First Name *"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                error={errors.firstName}
                required
              />
              <Input
                label="Last Name *"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                error={errors.lastName}
                required
              />
              <Input
                label="Email *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
              />
              <Input
                label="Phone Number *"
                name="phoneNumber"
                type="tel"
                value={formData.phoneNumber}
                onChange={handleChange}
                error={errors.phoneNumber}
                required
              />
              <Input
                label="Date of Birth *"
                name="dateOfBirth"
                type="date"
                value={formData.dateOfBirth}
                onChange={handleChange}
                error={errors.dateOfBirth}
                required
              />
              <div>
                <label className="block mb-1 text-sm font-bold">Gender *</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={`w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 ${
                    errors.gender ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
                  }`}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                {errors.gender && <p className="text-red-600 text-xs mt-1">{errors.gender}</p>}
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-indigo-700">Address Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
              <Input
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
              />
              <Input
                label="Zip Code"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-indigo-700">Emergency Contact</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Emergency Contact Name"
                name="emergencyContactName"
                value={formData.emergencyContactName}
                onChange={handleChange}
              />
              <Input
                label="Emergency Contact Phone"
                name="emergencyContactPhone"
                type="tel"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Insurance Information */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-indigo-700">Insurance Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Insurance Provider"
                name="insuranceProvider"
                value={formData.insuranceProvider}
                onChange={handleChange}
              />
              <Input
                label="Insurance Policy Number"
                name="insurancePolicyNumber"
                value={formData.insurancePolicyNumber}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Medical History */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4 text-indigo-700">Medical History</h3>
            <textarea
              name="medicalHistory"
              value={formData.medicalHistory}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="4"
              placeholder="Enter any relevant medical history, allergies, or current medications..."
            />
          </div>

          {errors.submit && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {errors.submit}
            </div>
          )}

          <div className="flex justify-end space-x-4">
            <Button type="button" variant="secondary">
              Clear Form
            </Button>
            <Button type="submit" loading={loading} size="lg">
              Register Patient
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default PatientRegistrationPage;
