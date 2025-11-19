import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { patientService } from '../../services/patientService';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Table from '../common/Table';
import Input from '../common/Input';
import {
  FileText,
  Plus,
  Calendar,
  User,
  Stethoscope,
  Pill,
  Activity,
  AlertTriangle,
  Download,
  Eye,
  Edit
} from 'lucide-react';

const MedicalHistory = ({ patientId }) => {
  const { user } = useAuth();
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filters, setFilters] = useState({
    type: 'all',
    dateRange: 'all',
    doctor: 'all'
  });

  useEffect(() => {
    fetchMedicalHistory();
  }, [patientId, filters]);

  const fetchMedicalHistory = async () => {
    try {
      setLoading(true);
      const response = await patientService.getMedicalHistory(patientId, filters);
      setMedicalHistory(response);
    } catch (err) {
      setError('Failed to fetch medical history');
      console.error('Error fetching medical history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
  };

  const handleAddRecord = async (recordData) => {
    try {
      await patientService.addMedicalRecord(patientId, recordData);
      fetchMedicalHistory();
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding medical record:', err);
    }
  };

  const getRecordTypeIcon = (type) => {
    switch (type) {
      case 'CONSULTATION': return <Stethoscope className="h-4 w-4" />;
      case 'PRESCRIPTION': return <Pill className="h-4 w-4" />;
      case 'TEST_RESULT': return <Activity className="h-4 w-4" />;
      case 'SURGERY': return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getRecordTypeColor = (type) => {
    switch (type) {
      case 'CONSULTATION': return 'bg-blue-100 text-blue-800';
      case 'PRESCRIPTION': return 'bg-green-100 text-green-800';
      case 'TEST_RESULT': return 'bg-purple-100 text-purple-800';
      case 'SURGERY': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const tableColumns = [
    {
      key: 'date',
      header: 'Date',
      render: (value) => new Date(value).toLocaleDateString(),
      sortable: true
    },
    {
      key: 'type',
      header: 'Type',
      render: (value) => (
        <div className="flex items-center space-x-2">
          {getRecordTypeIcon(value)}
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRecordTypeColor(value)}`}>
            {value.replace('_', ' ')}
          </span>
        </div>
      )
    },
    {
      key: 'doctorName',
      header: 'Doctor',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-400" />
          <span>Dr. {value}</span>
        </div>
      )
    },
    {
      key: 'diagnosis',
      header: 'Diagnosis/Description',
      render: (value) => (
        <span className="line-clamp-2" title={value}>
          {value || 'No description provided'}
        </span>
      )
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (value) => value ? (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(value)}`}>
          {value}
        </span>
      ) : null
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (value, row) => (
        <div className="flex items-center space-x-2">
          <Button
            size="xs"
            variant="ghost"
            onClick={() => handleViewRecord(row)}
          >
            <Eye className="h-3 w-3" />
          </Button>
          {user.role !== 'PATIENT' && (
            <Button
              size="xs"
              variant="ghost"
              onClick={() => console.log('Edit record', row.id)}
            >
              <Edit className="h-3 w-3" />
            </Button>
          )}
        </div>
      ),
      sortable: false
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">Medical History</h2>
        </div>

        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => console.log('Export medical history')}
          >
            Export
          </Button>

          {user.role !== 'PATIENT' && (
            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => setShowAddModal(true)}
            >
              Add Record
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="CONSULTATION">Consultations</option>
            <option value="PRESCRIPTION">Prescriptions</option>
            <option value="TEST_RESULT">Test Results</option>
            <option value="SURGERY">Surgeries</option>
          </select>

          <select
            value={filters.dateRange}
            onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Time</option>
            <option value="30days">Last 30 Days</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>

          <select
            value={filters.doctor}
            onChange={(e) => setFilters(prev => ({ ...prev, doctor: e.target.value }))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Doctors</option>
            {/* This would be populated with actual doctors */}
          </select>
        </div>
      </Card>

      {/* Medical History Table */}
      <Card>
        <Table
          data={medicalHistory}
          columns={tableColumns}
          loading={loading}
          searchable={false}
          sortable={true}
          pagination={true}
          itemsPerPage={10}
          emptyMessage="No medical records found"
        />
      </Card>

      {/* Timeline View Toggle */}
      <Card title="Medical Timeline">
        <div className="space-y-4">
          {medicalHistory.slice(0, 5).map((record, index) => (
            <div key={record.id} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                {getRecordTypeIcon(record.type)}
              </div>
              
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">{record.diagnosis || record.type.replace('_', ' ')}</h4>
                    <p className="text-sm text-gray-600">Dr. {record.doctorName}</p>
                    <p className="text-xs text-gray-500">{new Date(record.date).toLocaleDateString()}</p>
                  </div>
                  
                  <Button
                    size="xs"
                    variant="ghost"
                    onClick={() => handleViewRecord(record)}
                  >
                    View Details
                  </Button>
                </div>
                
                {record.notes && (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2">{record.notes}</p>
                )}
              </div>
            </div>
          ))}
          
          {medicalHistory.length > 5 && (
            <div className="text-center">
              <Button variant="outline" size="sm">
                View All Records
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Add Record Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Add Medical Record"
          size="lg"
        >
          <AddRecordForm
            onSubmit={handleAddRecord}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>
      )}

      {/* View Record Modal */}
      {selectedRecord && (
        <Modal
          isOpen={!!selectedRecord}
          onClose={() => setSelectedRecord(null)}
          title="Medical Record Details"
          size="lg"
        >
          <RecordDetails record={selectedRecord} />
        </Modal>
      )}
    </div>
  );
};

// Helper Components
const AddRecordForm = ({ onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    type: 'CONSULTATION',
    date: new Date().toISOString().split('T')[0],
    diagnosis: '',
    notes: '',
    priority: 'MEDIUM'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="CONSULTATION">Consultation</option>
            <option value="PRESCRIPTION">Prescription</option>
            <option value="TEST_RESULT">Test Result</option>
            <option value="SURGERY">Surgery</option>
          </select>
        </div>

        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          required
        />
      </div>

      <Input
        label="Diagnosis/Title"
        value={formData.diagnosis}
        onChange={(e) => setFormData(prev => ({ ...prev, diagnosis: e.target.value }))}
        placeholder="Enter diagnosis or record title"
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter detailed notes about this medical record"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
        <select
          value={formData.priority}
          onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          Add Record
        </Button>
      </div>
    </form>
  );
};

const RecordDetails = ({ record }) => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="font-medium text-gray-900">Type</h4>
          <p className="text-gray-600">{record.type.replace('_', ' ')}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">Date</h4>
          <p className="text-gray-600">{new Date(record.date).toLocaleDateString()}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">Doctor</h4>
          <p className="text-gray-600">Dr. {record.doctorName}</p>
        </div>
        <div>
          <h4 className="font-medium text-gray-900">Priority</h4>
          <p className="text-gray-600">{record.priority || 'Not specified'}</p>
        </div>
      </div>

      <div>
        <h4 className="font-medium text-gray-900">Diagnosis</h4>
        <p className="text-gray-600">{record.diagnosis || 'No diagnosis provided'}</p>
      </div>

      {record.notes && (
        <div>
          <h4 className="font-medium text-gray-900">Notes</h4>
          <p className="text-gray-600 whitespace-pre-wrap">{record.notes}</p>
        </div>
      )}

      {record.attachments && record.attachments.length > 0 && (
        <div>
          <h4 className="font-medium text-gray-900">Attachments</h4>
          <div className="space-y-2 mt-2">
            {record.attachments.map((attachment, index) => (
              <a
                key={index}
                href={attachment.url}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
              >
                <FileText className="h-4 w-4" />
                <span>{attachment.name}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalHistory;
