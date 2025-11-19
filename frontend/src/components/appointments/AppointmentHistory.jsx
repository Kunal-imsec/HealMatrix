import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { appointmentService } from '../../services/appointmentService';
import Table from '../common/Table';
import Button from '../common/Button';
import Input from '../common/Input';
import { 
  Calendar, 
  Search, 
  Filter, 
  Download, 
  Eye,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

const AppointmentHistory = ({ patientId = null, doctorId = null }) => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    appointmentType: 'all'
  });
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchAppointments();
    fetchStatistics();
  }, [filters, searchTerm, patientId, doctorId]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      let response;
      
      const params = { 
        ...filters, 
        search: searchTerm,
        limit: 100 // Show more history
      };

      if (patientId) {
        response = await appointmentService.getPatientAppointments(patientId, params);
      } else if (doctorId) {
        response = await appointmentService.getDoctorAppointments(doctorId, params);
      } else if (user.role === 'PATIENT') {
        response = await appointmentService.getPatientAppointments(user.id, params);
      } else if (user.role === 'DOCTOR') {
        response = await appointmentService.getDoctorAppointments(user.id, params);
      } else {
        response = await appointmentService.getAllAppointments(params);
      }
      
      setAppointments(response);
    } catch (err) {
      setError('Failed to fetch appointment history');
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const params = { patientId, doctorId };
      const response = await appointmentService.getAppointmentStatistics(params);
      setStatistics(response);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'NO_SHOW':
        return <AlertTriangle className="h-4 w-4 text-orange-600" />;
      case 'SCHEDULED':
      case 'CONFIRMED':
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'NO_SHOW':
        return 'bg-orange-100 text-orange-800';
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTableColumns = () => {
    const baseColumns = [
      {
        key: 'appointmentId',
        header: 'Appointment ID',
        render: (value) => (
          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
            {value}
          </span>
        )
      }
    ];

    // Add patient column if not viewing patient-specific history
    if (!patientId && user.role !== 'PATIENT') {
      baseColumns.push({
        key: 'patientName',
        header: 'Patient',
        render: (value, row) => (
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-sm text-gray-500">ID: {row.patientId}</div>
          </div>
        )
      });
    }

    // Add doctor column if not viewing doctor-specific history
    if (!doctorId && user.role !== 'DOCTOR') {
      baseColumns.push({
        key: 'doctorName',
        header: 'Doctor',
        render: (value, row) => (
          <div>
            <div className="font-medium text-gray-900">Dr. {value}</div>
            <div className="text-sm text-gray-500">{row.doctorSpecialization}</div>
          </div>
        )
      });
    }

    baseColumns.push(
      {
        key: 'appointmentType',
        header: 'Type',
        render: (value) => (
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {value.replace('_', ' ')}
          </span>
        )
      },
      {
        key: 'date',
        header: 'Date',
        render: (value) => new Date(value).toLocaleDateString()
      },
      {
        key: 'timeSlot',
        header: 'Time',
        render: (value) => (
          <span className="font-medium text-gray-900">{value}</span>
        )
      },
      {
        key: 'status',
        header: 'Status',
        render: (value) => (
          <div className="flex items-center space-x-2">
            {getStatusIcon(value)}
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(value)}`}>
              {value.replace('_', ' ')}
            </span>
          </div>
        )
      },
      {
        key: 'reason',
        header: 'Reason',
        render: (value) => (
          <span className="text-sm text-gray-600 line-clamp-2" title={value}>
            {value || 'No reason provided'}
          </span>
        )
      }
    );

    // Add actions column
    baseColumns.push({
      key: 'actions',
      header: 'Actions',
      render: (value, row) => (
        <Button
          size="xs"
          variant="ghost"
          onClick={() => handleViewAppointment(row)}
          leftIcon={<Eye className="h-3 w-3" />}
        >
          View
        </Button>
      ),
      sortable: false
    });

    return baseColumns;
  };

  const handleViewAppointment = (appointment) => {
    // Navigate to appointment details
    console.log('View appointment:', appointment);
  };

  const handleExport = async () => {
    try {
      const params = { 
        ...filters, 
        search: searchTerm,
        patientId,
        doctorId
      };
      await appointmentService.exportAppointments(params);
    } catch (err) {
      console.error('Error exporting appointments:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Appointments</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.totalAppointments || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.completedAppointments || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cancelled</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.cancelledAppointments || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">No Shows</p>
              <p className="text-2xl font-bold text-gray-900">
                {statistics.noShowAppointments || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Calendar className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Appointment History</h1>
            <p className="text-gray-600 text-sm">
              View and manage appointment records
            </p>
          </div>
        </div>

        <Button
          variant="outline"
          leftIcon={<Download className="h-4 w-4" />}
          onClick={handleExport}
        >
          Export History
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Search appointments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={<Search className="h-4 w-4 text-gray-400" />}
          />

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="NO_SHOW">No Show</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="CONFIRMED">Confirmed</option>
          </select>

          <select
            value={filters.appointmentType}
            onChange={(e) => setFilters(prev => ({ ...prev, appointmentType: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="CONSULTATION">Consultation</option>
            <option value="FOLLOW_UP">Follow Up</option>
            <option value="CHECKUP">Checkup</option>
            <option value="EMERGENCY">Emergency</option>
            <option value="PROCEDURE">Procedure</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Appointments Table */}
      <Table
        data={appointments}
        columns={getTableColumns()}
        loading={loading}
        searchable={false}
        sortable={true}
        pagination={true}
        itemsPerPage={20}
        emptyMessage="No appointment history found"
        onRowClick={handleViewAppointment}
      />
    </div>
  );
};

export default AppointmentHistory;
