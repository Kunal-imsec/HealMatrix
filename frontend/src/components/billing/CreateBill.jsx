import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { billingService } from '../../services/billingService';
import { patientService } from '../../services/patientService';
import Card from '../common/Card';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import {
  Plus,
  Trash2,
  Save,
  Search,
  User,
  Calculator,
  FileText,
  AlertCircle
} from 'lucide-react';

const CreateBill = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get('patientId');

  const [formData, setFormData] = useState({
    patientId: patientId || '',
    billDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    serviceType: '',
    department: '',
    doctorId: user.role === 'DOCTOR' ? user.id : '',
    notes: '',
    taxRate: 10,
    discountAmount: 0,
    billItems: [
      {
        serviceName: '',
        description: '',
        quantity: 1,
        unitPrice: 0
      }
    ]
  });

  const [patients, setPatients] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');

  useEffect(() => {
    fetchServices();
    if (patientId) {
      fetchPatientDetails(patientId);
    }
    
    // Set default due date (30 days from bill date)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    setFormData(prev => ({ ...prev, dueDate: dueDate.toISOString().split('T')[0] }));
  }, [patientId]);

  const fetchServices = async () => {
    try {
      const response = await billingService.getServices();
      setServices(response);
    } catch (err) {
      console.error('Error fetching services:', err);
    }
  };

  const fetchPatientDetails = async (id) => {
    try {
      const patient = await patientService.getPatientById(id);
      setFormData(prev => ({ ...prev, patientId: patient.id, patientName: patient.fullName }));
    } catch (err) {
      console.error('Error fetching patient:', err);
    }
  };

  const searchPatients = async (searchTerm) => {
    try {
      const response = await patientService.searchPatients(searchTerm);
      setPatients(response);
    } catch (err) {
      console.error('Error searching patients:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.billItems];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setFormData(prev => ({ ...prev, billItems: updatedItems }));
  };

  const addBillItem = () => {
    setFormData(prev => ({
      ...prev,
      billItems: [
        ...prev.billItems,
        {
          serviceName: '',
          description: '',
          quantity: 1,
          unitPrice: 0
        }
      ]
    }));
  };

  const removeBillItem = (index) => {
    if (formData.billItems.length > 1) {
      const updatedItems = formData.billItems.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, billItems: updatedItems }));
    }
  };

  const calculateSubtotal = () => {
    return formData.billItems.reduce((sum, item) => {
      return sum + (parseFloat(item.unitPrice || 0) * parseInt(item.quantity || 0));
    }, 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * parseFloat(formData.taxRate || 0)) / 100;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() - parseFloat(formData.discountAmount || 0);
  };

  const handlePatientSelect = (patient) => {
    setFormData(prev => ({ 
      ...prev, 
      patientId: patient.id, 
      patientName: `${patient.firstName} ${patient.lastName}` 
    }));
    setShowPatientSearch(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const billData = {
        ...formData,
        subtotal: calculateSubtotal(),
        taxAmount: calculateTax(),
        totalAmount: calculateTotal(),
        createdBy: user.id
      };

      const response = await billingService.createBill(billData);
      navigate(`/billing/${response.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create bill');
    } finally {
      setLoading(false);
    }
  };

  const canCreateBill = ['ADMIN', 'RECEPTIONIST', 'DOCTOR'].includes(user.role);

  if (!canCreateBill) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
        <h3 className="mt-2 text-lg font-medium text-gray-900">Access Denied</h3>
        <p className="mt-1 text-gray-500">You don't have permission to create bills</p>
        <Button
          className="mt-4"
          onClick={() => navigate('/billing')}
        >
          Back to Bills
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Bill</h1>
            <p className="text-gray-600 text-sm">Generate a new bill for patient services</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bill Information */}
          <div className="lg:col-span-2 space-y-6">
            <Card title="Bill Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Bill Date"
                  type="date"
                  value={formData.billDate}
                  onChange={(e) => handleInputChange('billDate', e.target.value)}
                  required
                />

                <Input
                  label="Due Date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
                  <select
                    value={formData.serviceType}
                    onChange={(e) => handleInputChange('serviceType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select Service Type</option>
                    <option value="CONSULTATION">Consultation</option>
                    <option value="SURGERY">Surgery</option>
                    <option value="DIAGNOSTIC">Diagnostic</option>
                    <option value="MEDICATION">Medication</option>
                    <option value="THERAPY">Therapy</option>
                    <option value="EMERGENCY">Emergency</option>
                  </select>
                </div>

                <Input
                  label="Department"
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
                  placeholder="Enter department"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Additional notes about this bill"
                />
              </div>
            </Card>

            {/* Patient Selection */}
            <Card title="Patient Information">
              <div className="space-y-4">
                <div className="flex items-end space-x-4">
                  <div className="flex-1">
                    <Input
                      label="Patient"
                      value={formData.patientName || ''}
                      placeholder="Select a patient"
                      readOnly
                      required
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    leftIcon={<Search className="h-4 w-4" />}
                    onClick={() => setShowPatientSearch(true)}
                  >
                    Search
                  </Button>
                </div>
              </div>
            </Card>

            {/* Service Items */}
            <Card title="Service Items">
              <div className="space-y-4">
                {formData.billItems.map((item, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Item #{index + 1}</h4>
                      {formData.billItems.length > 1 && (
                        <Button
                          type="button"
                          size="xs"
                          variant="ghost"
                          className="text-red-600"
                          onClick={() => removeBillItem(index)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="md:col-span-2">
                        <Input
                          label="Service Name"
                          value={item.serviceName}
                          onChange={(e) => handleItemChange(index, 'serviceName', e.target.value)}
                          placeholder="Enter service name"
                          required
                        />
                      </div>

                      <Input
                        label="Quantity"
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        required
                      />

                      <Input
                        label="Unit Price ($)"
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                        required
                      />
                    </div>

                    <div className="mt-3">
                      <Input
                        label="Description (Optional)"
                        value={item.description}
                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                        placeholder="Additional details about this service"
                      />
                    </div>

                    <div className="mt-3 text-right">
                      <span className="text-sm text-gray-600">Total: </span>
                      <span className="font-medium text-gray-900">
                        ${(parseFloat(item.unitPrice || 0) * parseInt(item.quantity || 0)).toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  leftIcon={<Plus className="h-4 w-4" />}
                  onClick={addBillItem}
                  className="w-full"
                >
                  Add Another Item
                </Button>
              </div>
            </Card>
          </div>

          {/* Bill Summary */}
          <div className="space-y-6">
            <Card title="Bill Summary">
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${calculateSubtotal().toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <Input
                    label="Tax Rate (%)"
                    type="number"
                    min="0"
                    max="100"
                    step="0.01"
                    value={formData.taxRate}
                    onChange={(e) => handleInputChange('taxRate', e.target.value)}
                  />
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tax Amount</span>
                    <span className="text-gray-900">${calculateTax().toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Input
                    label="Discount Amount ($)"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.discountAmount}
                    onChange={(e) => handleInputChange('discountAmount', e.target.value)}
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-900">Total Amount</span>
                    <span className="text-blue-600">${calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                type="submit"
                variant="primary"
                leftIcon={<Save className="h-4 w-4" />}
                loading={loading}
                fullWidth
              >
                Create Bill
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/billing')}
                fullWidth
              >
                Cancel
              </Button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Patient Search Modal */}
      {showPatientSearch && (
        <Modal
          isOpen={showPatientSearch}
          onClose={() => setShowPatientSearch(false)}
          title="Select Patient"
          size="lg"
        >
          <div className="space-y-4">
            <Input
              placeholder="Search patients by name or ID..."
              value={patientSearchTerm}
              onChange={(e) => {
                setPatientSearchTerm(e.target.value);
                if (e.target.value.length > 2) {
                  searchPatients(e.target.value);
                }
              }}
              leftIcon={<Search className="h-4 w-4 text-gray-400" />}
            />

            <div className="max-h-64 overflow-y-auto space-y-2">
              {patients.map((patient) => (
                <div
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient)}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">
                        {patient.firstName} {patient.lastName}
                      </p>
                      <p className="text-sm text-gray-500">ID: {patient.patientId}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">{patient.email}</p>
                      <p className="text-sm text-gray-500">{patient.phoneNumber}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default CreateBill;
