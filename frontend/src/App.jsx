import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import LoadingSpinner from './components/common/LoadingSpinner';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Layout
import Layout from './components/layout/Layout';

// Role-Specific Dashboards
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import DoctorDashboard from './components/dashboards/DoctorDashboard';
import PatientDashboard from './components/dashboards/PatientDashboard';
import NurseDashboard from './components/dashboards/NurseDashboard';
import ReceptionistDashboard from './components/dashboards/ReceptionistDashboard';

// Feature Components
import PatientList from './components/patients/PatientList';
import PatientProfile from './components/patients/PatientProfile';
import DoctorList from './components/doctors/DoctorList';
import DoctorProfile from './components/doctors/DoctorProfile';
import AppointmentList from './components/appointments/AppointmentList';
import BillingList from './components/billing/BillingList';
import BillDetails from './components/billing/BillDetails';
import DepartmentList from './components/departments/DepartmentList';
import PrescriptionList from './components/prescriptions/PrescriptionList';

import './styles/index.css';

// ✅ FIXED: Role-based dashboard routing
const getRoleDashboardPath = (role) => {
  const paths = {
    'ADMIN': '/admin/dashboard',
    'DOCTOR': '/doctor/dashboard',
    'NURSE': '/nurse/dashboard',
    'PATIENT': '/patient/dashboard',
    'RECEPTIONIST': '/receptionist/dashboard'
  };
  return paths[role] || '/patient/dashboard';
};

const AppContent = () => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <Routes>
      {/* Public Routes */}
      <Route 
        path="/login" 
        element={
          user ? <Navigate to={getRoleDashboardPath(user.role)} replace /> : <Login />
        } 
      />
      <Route 
        path="/register" 
        element={
          user ? <Navigate to={getRoleDashboardPath(user.role)} replace /> : <Register />
        } 
      />

      {/* ✅ FIXED: Role-Specific Dashboard Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <Layout><AdminDashboardPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/dashboard"
        element={
          <ProtectedRoute allowedRoles={['DOCTOR']}>
            <Layout><DoctorDashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/nurse/dashboard"
        element={
          <ProtectedRoute allowedRoles={['NURSE']}>
            <Layout><NurseDashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patient/dashboard"
        element={
          <ProtectedRoute allowedRoles={['PATIENT']}>
            <Layout><PatientDashboard /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/receptionist/dashboard"
        element={
          <ProtectedRoute allowedRoles={['RECEPTIONIST']}>
            <Layout><ReceptionistDashboard /></Layout>
          </ProtectedRoute>
        }
      />

      {/* Feature Routes */}
      <Route
        path="/patients"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST']}>
            <Layout><PatientList /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/patients/:id"
        element={
          <ProtectedRoute>
            <Layout><PatientProfile /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctors"
        element={
          <ProtectedRoute>
            <Layout><DoctorList /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctors/:id"
        element={
          <ProtectedRoute>
            <Layout><DoctorProfile /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/appointments"
        element={
          <ProtectedRoute>
            <Layout><AppointmentList /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <Layout><BillingList /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing/:id"
        element={
          <ProtectedRoute>
            <Layout><BillDetails /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/departments"
        element={
          <ProtectedRoute allowedRoles={['ADMIN', 'DOCTOR', 'NURSE']}>
            <Layout><DepartmentList /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/prescriptions"
        element={
          <ProtectedRoute>
            <Layout><PrescriptionList /></Layout>
          </ProtectedRoute>
        }
      />

      {/* Default Routes */}
      <Route
        path="/"
        element={
          <Navigate 
            to={user ? getRoleDashboardPath(user.role) : "/login"} 
            replace 
          />
        }
      />

      {/* Legacy /dashboard redirect */}
      <Route
        path="/dashboard"
        element={
          user ? (
            <Navigate to={getRoleDashboardPath(user.role)} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
      
      {/* 404 Route */}
      <Route
        path="*"
        element={
          <Layout>
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
              <p className="text-gray-600 mb-6">The page you're looking for doesn't exist.</p>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-xl hover:shadow-lg transition-shadow"
              >
                Go Home
              </button>
            </div>
          </Layout>
        }
      />
    </Routes>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
