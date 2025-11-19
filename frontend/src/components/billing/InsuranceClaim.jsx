import React, { useState, useEffect } from 'react';
import { billingService } from '../../services/billingService';
import { patientService } from '../../services/patientService';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import FileUpload from '../common/FileUpload';
import DatePicker from '../common/DatePicker';
import { 
  Shield, 
  FileText, 
  Plus, 
  Edit3, 
  Eye,
  Download,
  Upload,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search
} from 'lucide-react';

const InsuranceClaim = ({ patientId = null, billId = null }) => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedClaim, setSelectedClaim] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchClaims();
  }, [patientId, billId, searchTerm, statusFilter]);

  const fetchClaims = async () => {
    try {
      // Mock data - replace with actual API call
      const mockClaims = [
        {
          id: 1,
          claimNumber: 'CLM-2025-001',
          patientId: 'P001',
          patientName: 'John Doe',
          billId: 'B001',
          insuranceProvider: 'Blue Cross Blue Shield',
          policyNumber: 'BC123456789',
          claimAmount: 1250.00,
          approvedAmount: 1000.00,
          deductible: 250.00,
          copayment: 50.00,
          status: 'APPROVED',
          submissionDate: '2025-10-15',
          approvalDate: '2025-10-20',
          diagnosisCodes: ['Z00.00', 'M25.50'],
          procedureCodes: ['99213', '73060'],
          notes: 'Regular consultation and X-ray'
        },
        {
          id: 2,
          claimNumber: 'CLM-2025-002',
          patientId: 'P002',
          patientName: 'Jane Smith',
          billId: 'B002',
          insuranceProvider: 'Aetna',
          policyNumber: 'AET987654321',
          claimAmount: 850.00,
          approvedAmount: 0.00,
          status: 'PENDING',
          submissionDate: '2025-10-18',
          diagnosisCodes: ['M54.5'],
          procedureCodes: ['99212'],
          notes: 'Follow-up consultation for back pain'
        }
      ];

      let filteredClaims = mockClaims;

      if (patientId) {
        filteredClaims = filteredClaims.filter(claim => claim.patientId === patientId);
      }

      if (billId) {
        filteredClaims = filteredClaims.filter(claim => claim.billId === billId);
      }

      if (searchTerm) {
        filteredClaims = filteredClaims.filter(claim =>
          claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          claim.insuranceProvider.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (statusFilter !== 'all') {
        filteredClaims = filteredClaims.filter(claim => claim.status === statusFilter);
      }

      setClaims(filteredClaims);
    } catch (err) {
      console.error('Error fetching claims:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'DENIED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'UNDER_REVIEW':
        return <AlertTriangle className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'DENIED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'UNDER_REVIEW':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateClaim = () => {
    setSelectedClaim(null);
    setShowCreateModal(true);
  };

  const handleViewClaim = (claim) => {
    setSelectedClaim(claim);
    // Could open a detailed view modal
  };

  const handleClaimCreated = () => {
    setShowCreateModal(false);
    fetchClaims();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Shield className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Insurance Claims</h3>
              <p className="text-gray-600">Manage insurance claim submissions and tracking</p>
            </div>
          </div>
          
          <Button
            variant="primary"
            onClick={handleCreateClaim}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Create Claim
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search claims..."
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
              <option value="UNDER_REVIEW">Under Review</option>
              <option value="APPROVED">Approved</option>
              <option value="DENIED">Denied</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            {claims.length} claim{claims.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Claims List */}
      <div className="space-y-4">
        {claims.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Insurance Claims</h3>
            <p className="text-gray-600 mb-6">
              {patientId || billId 
                ? 'No claims found for the selected filters'
                : 'Start by creating your first insurance claim'
              }
            </p>
            <Button
              variant="primary"
              onClick={handleCreateClaim}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Create First Claim
            </Button>
          </div>
        ) : (
          claims.map((claim) => (
            <div key={claim.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <h4 className="text-lg font-semibold text-gray-900">
                      {claim.claimNumber}
                    </h4>
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(claim.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(claim.status)}`}>
                        {claim.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-gray-600">Patient</p>
                      <p className="font-medium text-gray-900">{claim.patientName}</p>
                      <p className="text-sm text-gray-500">ID: {claim.patientId}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Insurance Provider</p>
                      <p className="font-medium text-gray-900">{claim.insuranceProvider}</p>
                      <p className="text-sm text-gray-500">Policy: {claim.policyNumber}</p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Claim Amount</p>
                      <p className="font-medium text-gray-900">
                        ${claim.claimAmount.toFixed(2)}
                      </p>
                      {claim.approvedAmount > 0 && (
                        <p className="text-sm text-green-600">
                          Approved: ${claim.approvedAmount.toFixed(2)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Submitted:</span>{' '}
                      {new Date(claim.submissionDate).toLocaleDateString()}
                    </div>
                    
                    {claim.approvalDate && (
                      <div>
                        <span className="font-medium">Approved:</span>{' '}
                        {new Date(claim.approvalDate).toLocaleDateString()}
                      </div>
                    )}
                    
                    {claim.diagnosisCodes.length > 0 && (
                      <div>
                        <span className="font-medium">Diagnosis:</span>{' '}
                        {claim.diagnosisCodes.join(', ')}
                      </div>
                    )}
                  </div>

                  {claim.notes && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{claim.notes}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleViewClaim(claim)}
                    leftIcon={<Eye className="h-3 w-3" />}
                  >
                    View
                  </Button>
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Download className="h-3 w-3" />}
                  >
                    Download
                  </Button>
                  
                  {claim.status === 'PENDING' && (
                    <Button
                      size="sm"
                      variant="ghost"
                      leftIcon={<Edit3 className="h-3 w-3" />}
                    >
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Claim Modal */}
      {showCreateModal && (
        <Modal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          title="Create Insurance Claim"
          size="xl"
        >
          <CreateClaimForm
            patientId={patientId}
            billId={billId}
            onSuccess={handleClaimCreated}
            onCancel={() => setShowCreateModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

// Create Claim Form Component
const CreateClaimForm = ({ patientId, billId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    patientId: patientId || '',
    billId: billId || '',
    insuranceProvider: '',
    policyNumber: '',
    groupNumber: '',
    claimAmount: '',
    diagnosisCodes: [''],
    procedureCodes: [''],
    serviceDate: '',
    notes: ''
  });
  const [patients, setPatients] = useState([]);
  const [bills, setBills] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!patientId) fetchPatients();
    if (!billId) fetchBills();
  }, [patientId, billId]);

  const fetchPatients = async () => {
    try {
      const response = await patientService.getAllPatients();
      setPatients(response);
    } catch (err) {
      console.error('Error fetching patients:', err);
    }
  };

  const fetchBills = async () => {
    try {
      const response = await billingService.getAllBills();
      setBills(response);
    } catch (err) {
      console.error('Error fetching bills:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleArrayInputChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (!formData.patientId) {
      setError('Please select a patient');
      return false;
    }
    if (!formData.insuranceProvider) {
      setError('Insurance provider is required');
      return false;
    }
    if (!formData.policyNumber) {
      setError('Policy number is required');
      return false;
    }
    if (!formData.claimAmount || parseFloat(formData.claimAmount) <= 0) {
      setError('Valid claim amount is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const claimData = {
        ...formData,
        claimAmount: parseFloat(formData.claimAmount),
        diagnosisCodes: formData.diagnosisCodes.filter(code => code.trim()),
        procedureCodes: formData.procedureCodes.filter(code => code.trim()),
        submissionDate: new Date().toISOString(),
        status: 'PENDING'
      };

      // await billingService.createInsuranceClaim(claimData);
      
      // Upload documents if provided
      if (documents.length > 0) {
        // await billingService.uploadClaimDocuments(claimId, documents);
      }

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create insurance claim');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient and Bill Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!patientId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient *
            </label>
            <select
              value={formData.patientId}
              onChange={(e) => handleInputChange('patientId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select patient</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>
                  {patient.firstName} {patient.lastName} - {patient.patientId}
                </option>
              ))}
            </select>
          </div>
        )}

        {!billId && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bill
            </label>
            <select
              value={formData.billId}
              onChange={(e) => handleInputChange('billId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select bill (optional)</option>
              {bills.map(bill => (
                <option key={bill.id} value={bill.id}>
                  {bill.billNumber} - ${bill.totalAmount}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Insurance Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Insurance Provider *"
          value={formData.insuranceProvider}
          onChange={(e) => handleInputChange('insuranceProvider', e.target.value)}
          required
        />

        <Input
          label="Policy Number *"
          value={formData.policyNumber}
          onChange={(e) => handleInputChange('policyNumber', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Group Number"
          value={formData.groupNumber}
          onChange={(e) => handleInputChange('groupNumber', e.target.value)}
        />

        <Input
          label="Claim Amount *"
          type="number"
          step="0.01"
          value={formData.claimAmount}
          onChange={(e) => handleInputChange('claimAmount', e.target.value)}
          required
        />
      </div>

      <DatePicker
        label="Service Date"
        value={formData.serviceDate}
        onChange={(date) => handleInputChange('serviceDate', date)}
      />

      {/* Diagnosis Codes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Diagnosis Codes
        </label>
        {formData.diagnosisCodes.map((code, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <Input
              value={code}
              onChange={(e) => handleArrayInputChange('diagnosisCodes', index, e.target.value)}
              placeholder="e.g., Z00.00"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => removeArrayField('diagnosisCodes', index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => addArrayField('diagnosisCodes')}
          leftIcon={<Plus className="h-3 w-3" />}
        >
          Add Diagnosis Code
        </Button>
      </div>

      {/* Procedure Codes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Procedure Codes
        </label>
        {formData.procedureCodes.map((code, index) => (
          <div key={index} className="flex items-center space-x-2 mb-2">
            <Input
              value={code}
              onChange={(e) => handleArrayInputChange('procedureCodes', index, e.target.value)}
              placeholder="e.g., 99213"
            />
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => removeArrayField('procedureCodes', index)}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => addArrayField('procedureCodes')}
          leftIcon={<Plus className="h-3 w-3" />}
        >
          Add Procedure Code
        </Button>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Additional notes or comments"
        />
      </div>

      {/* Document Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Supporting Documents
        </label>
        <FileUpload
          accept=".pdf,.jpg,.jpeg,.png"
          multiple={true}
          files={documents}
          onFileSelect={setDocuments}
          onFileRemove={(index) => setDocuments(prev => prev.filter((_, i) => i !== index))}
          maxFiles={10}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          Create Claim
        </Button>
      </div>
    </form>
  );
};

export default InsuranceClaim;
