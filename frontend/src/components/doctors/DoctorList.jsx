import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
import { useNavigate } from 'react-router-dom';
import Table from '../common/Table';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import DoctorCard from './DoctorCard';
import { 
  Stethoscope, 
  Plus, 
  Search, 
  Grid, 
  List, 
  Download,
  UserPlus,
  Star
} from 'lucide-react';

const DoctorList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [filters, setFilters] = useState({
    department: 'all',
    specialization: 'all',
    availability: 'all'
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [specializations, setSpecializations] = useState([]);

  useEffect(() => {
    fetchDoctors();
    fetchDepartments();
    fetchSpecializations();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const data = await doctorService.getAllDoctors();
      setDoctors(data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch doctors');
      console.error('Error fetching doctors:', err);
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await doctorService.getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error('Error fetching departments:', err);
      setDepartments([]);
    }
  };

  const fetchSpecializations = async () => {
    try {
      const data = await doctorService.getSpecializations();
      setSpecializations(data);
    } catch (err) {
      console.error('Error fetching specializations:', err);
      setSpecializations([]);
    }
  };

  const handleViewDoctor = (doctor) => {
    navigate(`/doctors/${doctor.id}`);
  };

  const handleEditDoctor = (doctor) => {
    navigate(`/doctors/${doctor.id}/edit`);
  };

  const handleDeleteDoctor = async (doctorId) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await doctorService.deleteDoctor(doctorId);
        fetchDoctors();
      } catch (err) {
        console.error('Error deleting doctor:', err);
        alert('Failed to delete doctor');
      }
    }
  };

  const handleBookAppointment = (doctor) => {
    navigate(`/appointments/book?doctorId=${doctor.id}`);
  };

  const handleExport = async () => {
    try {
      await doctorService.exportDoctors(filters);
    } catch (err) {
      console.error('Error exporting doctors:', err);
      alert('Failed to export doctors');
    }
  };

  // Filter doctors based on search and filters
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchTerm === '' || 
      `${doctor.firstName} ${doctor.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = filters.department === 'all' || 
      doctor.department?.id === parseInt(filters.department);
    
    const matchesSpec = filters.specialization === 'all' || 
      doctor.specialization === filters.specialization;
    
    const matchesAvail = filters.availability === 'all' ||
      (filters.availability === 'available' && doctor.availableToday) ||
      (filters.availability === 'unavailable' && !doctor.availableToday);
    
    return matchesSearch && matchesDept && matchesSpec && matchesAvail;
  });

  const getTableColumns = () => {
    return [
      {
        key: 'doctorId',
        header: 'Doctor ID',
        render: (value) => (
          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
            {value || 'N/A'}
          </span>
        )
      },
      {
        key: 'fullName',
        header: 'Name',
        render: (value, row) => (
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Stethoscope className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900">Dr. {row.firstName} {row.lastName}</div>
              <div className="text-sm text-gray-500">{row.email}</div>
            </div>
          </div>
        )
      },
      {
        key: 'specialization',
        header: 'Specialization',
        render: (value) => (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {value || 'Not specified'}
          </span>
        )
      },
      {
        key: 'department',
        header: 'Department',
        render: (value) => value?.name || 'Not assigned'
      },
      {
        key: 'experience',
        header: 'Experience',
        render: (value) => `${value || 0} years`
      },
      {
        key: 'rating',
        header: 'Rating',
        render: (value) => (
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{value || 'N/A'}</span>
          </div>
        )
      },
      {
        key: 'status',
        header: 'Status',
        type: 'badge',
        getBadgeColor: (value) => 
          value === 'ACTIVE' ? 'bg-green-100 text-green-800' :
          value === 'INACTIVE' ? 'bg-gray-100 text-gray-800' :
          value === 'ON_LEAVE' ? 'bg-yellow-100 text-yellow-800' :
          'bg-red-100 text-red-800'
      }
    ];
  };

  const canManageDoctors = user.role === 'ADMIN';
  const canViewSchedule = ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST'].includes(user.role);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Stethoscope className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user.role === 'PATIENT' ? 'Find a Doctor' : 'Doctor Management'}
            </h1>
            <p className="text-gray-600 text-sm">
              {filteredDoctors.length} doctors available
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Toggle */}
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>

          {/* Action Buttons */}
          {canManageDoctors && (
            <>
              <Button
                variant="outline"
                leftIcon={<Download className="h-4 w-4" />}
                onClick={handleExport}
              >
                Export
              </Button>

              <Button
                variant="primary"
                leftIcon={<UserPlus className="h-4 w-4" />}
                onClick={() => setShowAddModal(true)}
              >
                Add Doctor
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search className="h-4 w-4 text-gray-400" />}
            />
          </div>

          <select
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </select>

          <select
            value={filters.specialization}
            onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Specializations</option>
            {specializations.map(spec => (
              <option key={spec} value={spec}>{spec}</option>
            ))}
          </select>

          <select
            value={filters.availability}
            onChange={(e) => setFilters(prev => ({ ...prev, availability: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Availability</option>
            <option value="available">Available Today</option>
            <option value="unavailable">Not Available</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Content */}
      {viewMode === 'table' ? (
        <Table
          data={filteredDoctors}
          columns={getTableColumns()}
          loading={loading}
          searchable={false}
          sortable={true}
          pagination={true}
          itemsPerPage={15}
          onRowClick={handleViewDoctor}
          emptyMessage="No doctors found matching your criteria"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 rounded-lg h-64"></div>
              </div>
            ))
          ) : filteredDoctors.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Stethoscope className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search criteria or filters
              </p>
              {canManageDoctors && (
                <Button
                  variant="primary"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={() => setShowAddModal(true)}
                  className="mt-4"
                >
                  Add First Doctor
                </Button>
              )}
            </div>
          ) : (
            filteredDoctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                onView={() => handleViewDoctor(doctor)}
                onEdit={canManageDoctors ? () => handleEditDoctor(doctor) : undefined}
                onDelete={canManageDoctors ? () => handleDeleteDoctor(doctor.id) : undefined}
                onBookAppointment={user.role === 'PATIENT' ? () => handleBookAppointment(doctor) : undefined}
                userRole={user.role}
                canViewSchedule={canViewSchedule}
              />
            ))
          )}
        </div>
      )}

      {/* Add Doctor Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add New Doctor"
          size="lg"
        >
          <div className="text-center py-8">
            <p className="text-gray-600">Doctor registration form will be implemented here.</p>
            <p className="text-sm text-gray-500 mt-2">For now, use the "Add Doctor" button on Admin Dashboard</p>
            <div className="mt-4">
              <Button onClick={() => {
                setShowAddModal(false);
                navigate('/admin/dashboard');
              }}>Go to Admin Dashboard</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DoctorList;
