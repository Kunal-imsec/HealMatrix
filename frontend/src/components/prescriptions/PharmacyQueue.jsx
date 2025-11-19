import React, { useState, useEffect } from 'react';
import { prescriptionService } from '../../services/prescriptionService';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import DispenseRecord from './DispenseRecord';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  User,
  Pill,
  Calendar,
  RefreshCw,
  Eye,
  PlayCircle
} from 'lucide-react';

const PharmacyQueue = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showDispenseModal, setShowDispenseModal] = useState(false);
  const [statistics, setStatistics] = useState({});

  useEffect(() => {
    fetchQueue();
    fetchStatistics();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchQueue, 30000);
    return () => clearInterval(interval);
  }, [statusFilter, priorityFilter, searchTerm]);

  const fetchQueue = async () => {
    try {
      const params = {
        status: statusFilter,
        priority: priorityFilter !== 'all' ? priorityFilter : undefined,
        search: searchTerm
      };

      // Mock data - replace with actual API call
      const mockQueue = [
        {
          id: 1,
          prescriptionNumber: 'RX-2025-001',
          patientName: 'John Doe',
          patientId: 'P001',
          doctorName: 'Dr. Sarah Smith',
          medications: [
            { name: 'Amoxicillin 500mg', quantity: 21, inStock: true },
            { name: 'Ibuprofen 400mg', quantity: 30, inStock: true }
          ],
          priority: 'NORMAL',
          status: 'PENDING',
          prescribedDate: '2025-10-22T14:30:00',
          queuePosition: 1,
          estimatedTime: 15,
          totalItems: 2,
          notes: 'Patient waiting at counter'
        },
        {
          id: 2,
          prescriptionNumber: 'RX-2025-002',
          patientName: 'Jane Smith',
          patientId: 'P002',
          doctorName: 'Dr. Michael Johnson',
          medications: [
            { name: 'Lisinopril 10mg', quantity: 30, inStock: true },
            { name: 'Metformin 500mg', quantity: 60, inStock: false }
          ],
          priority: 'URGENT',
          status: 'PENDING',
          prescribedDate: '2025-10-22T15:00:00',
          queuePosition: 2,
          estimatedTime: 20,
          totalItems: 2,
          notes: 'Emergency prescription'
        },
        {
          id: 3,
          prescriptionNumber: 'RX-2025-003',
          patientName: 'Robert Brown',
          patientId: 'P003',
          doctorName: 'Dr. Emily Davis',
          medications: [
            { name: 'Atorvastatin 20mg', quantity: 30, inStock: true }
          ],
          priority: 'NORMAL',
          status: 'IN_PROGRESS',
          prescribedDate: '2025-10-22T14:45:00',
          queuePosition: null,
          estimatedTime: 5,
          totalItems: 1,
          processingBy: 'Pharmacist John',
          notes: ''
        }
      ];

      let filteredQueue = mockQueue;

      if (statusFilter !== 'all') {
        filteredQueue = filteredQueue.filter(item => item.status === statusFilter);
      }

      if (priorityFilter !== 'all') {
        filteredQueue = filteredQueue.filter(item => item.priority === priorityFilter);
      }

      if (searchTerm) {
        filteredQueue = filteredQueue.filter(item =>
          item.prescriptionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.patientId.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      setQueue(filteredQueue);
    } catch (err) {
      console.error('Error fetching pharmacy queue:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      // Mock statistics
      const mockStats = {
        pending: 8,
        inProgress: 3,
        completed: 45,
        urgent: 2,
        averageWaitTime: 18,
        todayProcessed: 45
      };
      setStatistics(mockStats);
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const handleStartProcessing = async (prescription) => {
    try {
      await prescriptionService.updatePrescriptionStatus(prescription.id, 'IN_PROGRESS', {
        processingBy: user.id,
        startTime: new Date().toISOString()
      });
      fetchQueue();
    } catch (err) {
      console.error('Error starting prescription processing:', err);
    }
  };

  const handleDispense = (prescription) => {
    setSelectedPrescription(prescription);
    setShowDispenseModal(true);
  };

  const handleDispenseComplete = () => {
    setShowDispenseModal(false);
    setSelectedPrescription(null);
    fetchQueue();
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'HIGH':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'NORMAL':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'LOW':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'IN_PROGRESS':
        return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'ON_HOLD':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'ON_HOLD':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.pending || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <PlayCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.inProgress || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Today</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.todayProcessed || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <AlertCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Urgent</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.urgent || 0}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Wait Time</p>
              <p className="text-2xl font-bold text-gray-900">{statistics.averageWaitTime || 0}m</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Package className="h-8 w-8 text-indigo-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Queue</p>
              <p className="text-2xl font-bold text-gray-900">{queue.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Pharmacy Queue</h3>
              <p className="text-gray-600">Manage prescription fulfillment</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            onClick={fetchQueue}
            leftIcon={<RefreshCw className="h-4 w-4" />}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search prescriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="URGENT">Urgent</option>
              <option value="HIGH">High</option>
              <option value="NORMAL">Normal</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Queue List */}
      <div className="space-y-4">
        {queue.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Prescriptions in Queue</h3>
            <p className="text-gray-600">
              The pharmacy queue is empty. New prescriptions will appear here automatically.
            </p>
          </div>
        ) : (
          queue.map((prescription) => (
            <div key={prescription.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {prescription.queuePosition && (
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {prescription.queuePosition}
                      </div>
                    )}
                    
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">
                        {prescription.prescriptionNumber}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Prescribed by {prescription.doctorName}
                      </p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded border ${getPriorityColor(prescription.priority)}`}>
                        <AlertCircle className="h-3 w-3" />
                        <span className="text-xs font-medium">{prescription.priority}</span>
                      </div>
                      
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded ${getStatusColor(prescription.status)}`}>
                        {getStatusIcon(prescription.status)}
                        <span className="text-xs font-medium">{prescription.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  {prescription.status === 'PENDING' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => handleStartProcessing(prescription)}
                      leftIcon={<PlayCircle className="h-4 w-4" />}
                    >
                      Start Processing
                    </Button>
                  )}
                  
                  {prescription.status === 'IN_PROGRESS' && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => handleDispense(prescription)}
                      leftIcon={<CheckCircle className="h-4 w-4" />}
                    >
                      Dispense
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Eye className="h-4 w-4" />}
                  >
                    View Details
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{prescription.patientName}</p>
                    <p className="text-xs text-gray-500">Patient ID: {prescription.patientId}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {new Date(prescription.prescribedDate).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(prescription.prescribedDate).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Est. {prescription.estimatedTime} mins
                    </p>
                    <p className="text-xs text-gray-500">Processing time</p>
                  </div>
                </div>
              </div>

              {/* Medications List */}
              <div className="border-t border-gray-200 pt-4">
                <h5 className="text-sm font-medium text-gray-900 mb-3">
                  Medications ({prescription.totalItems})
                </h5>
                <div className="space-y-2">
                  {prescription.medications.map((med, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center space-x-3">
                        <Pill className="h-4 w-4 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{med.name}</p>
                          <p className="text-xs text-gray-500">Quantity: {med.quantity}</p>
                        </div>
                      </div>
                      
                      <div>
                        {med.inStock ? (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                            In Stock
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {prescription.notes && (
                <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> {prescription.notes}
                  </p>
                </div>
              )}

              {prescription.processingBy && (
                <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>Being processed by {prescription.processingBy}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Dispense Modal */}
      {showDispenseModal && selectedPrescription && (
        <Modal
          isOpen={showDispenseModal}
          onClose={() => setShowDispenseModal(false)}
          title="Dispense Prescription"
          size="xl"
        >
          <DispenseRecord
            prescription={selectedPrescription}
            onComplete={handleDispenseComplete}
            onCancel={() => setShowDispenseModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

export default PharmacyQueue;
