import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import prescriptionService  from '../../services/prescriptionService';
import { patientService } from '../../services/patientService';
import  medicationService  from '../../services/medicationService';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import {
  Save,
  X,
  Plus,
  Trash2,
  User,
  Pill,
  FileText,
  Search,
  AlertCircle,
  CheckCircle,
  Calendar
} from 'lucide-react';

const CreatePrescription = ({ onSuccess, onCancel, editData = null }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    diagnosis: '',
    instructions: '',
    priority: 'NORMAL',
    prescribedDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    followUpDate: '',
    medications: [
      {
        medicationName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        quantity: ''
      }
    ]
  });

  const [patients, setPatients] = useState([]);
  const [availableMedications, setAvailableMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPatientSearch, setShowPatientSearch] = useState(false);
  const [patientSearchTerm, setPatientSearchTerm] = useState('');

  const isEdit = Boolean(editData);

  useEffect(() => {
    fetchAvailableMedications();
    if (editData) {
      setFormData({
        ...editData,
        prescribedDate: editData.prescribedDate.split('T')[0],
        expiryDate: editData.expiryDate.split('T')[0],
        followUpDate: editData.followUpDate ? editData.followUpDate.split('T')[0] : ''
      });
    } else {
      // Set default expiry date (30 days from today)
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 30);
      setFormData(prev => ({ ...prev, expiryDate: expiryDate.toISOString().split('T')[0] }));
    }
  }, [editData]);

  const fetchAvailableMedications = async () => {
    try {
      const response = await medicationService.getAllMedications();
      setAvailableMedications(response);
    } catch (err) {
      console.error('Error fetching medications:', err);
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
    if (error) setError(null);
  };

  const handleMedicationChange = (index, field, value) => {
    const updatedMedications = [...formData.medications];
    updatedMedications[index] = { ...updatedMedications[index], [field]: value };
    setFormData(prev => ({ ...prev, medications: updatedMedications }));
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medications: [
        ...prev.medications,
        {
          medicationName: '',
          dosage: '',
          frequency: '',
          duration: '',
          instructions: '',
          quantity: ''
        }
      ]
    }));
  };

  const removeMedication = (index) => {
    if (formData.medications.length > 1) {
      const updatedMedications = formData.medications.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, medications: updatedMedications }));
    }
  };

  const handlePatientSelect = (patient) => {
    setFormData(prev => ({ 
      ...prev, 
      patientId: patient.id, 
      patientName: `${patient.firstName} ${patient.lastName}` 
    }));
    setShowPatientSearch(false);
  };

  const validateForm = () => {
    const requiredFields = ['patientId', 'diagnosis', 'prescribedDate', 'expiryDate'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return false;
    }

    // Validate medications
    for (let i = 0; i < formData.medications.length; i++) {
      const med = formData.medications[i];
      if (!med.medicationName || !med.dosage || !med.frequency || !med.duration) {
        setError(`Please complete all medication details for medication ${i + 1}`);
        return false;
      }
    }

    // Validate dates
    if (new Date(formData.expiryDate) <= new Date(formData.prescribedDate)) {
      setError('Expiry date must be after prescribed date');
      return false;
    }

    if (formData.followUpDate && new Date(formData.followUpDate) <= new Date(formData.prescribedDate)) {
      setError('Follow-up date must be after prescribed date');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const prescriptionData = {
        ...formData,
        doctorId: user.id,
        createdBy: isEdit ? formData.createdBy : user.id,
        updatedBy: user.id
      };

      if (isEdit) {
        await prescriptionService.updatePrescription(editData.id, prescriptionData);
      } else {
        await prescriptionService.createPrescription(prescriptionData);
      }
      
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} prescription`);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Prescription {isEdit ? 'Updated' : 'Created'} Successfully!
        </h3>
        <p className="text-gray-600">
          The prescription has been {isEdit ? 'updated' : 'created'} and is ready for dispensing.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Patient Selection */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
          <User className="h-5 w-5" />
          <span>Patient Information</span>
        </div>

        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <Input
              label="Patient *"
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

      {/* Prescription Details */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
          <FileText className="h-5 w-5" />
          <span>Prescription Details</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Diagnosis *"
            value={formData.diagnosis}
            onChange={(e) => handleInputChange('diagnosis', e.target.value)}
            placeholder="Patient's diagnosis"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="NORMAL">Normal</option>
              <option value="URGENT">Urgent</option>
              <option value="EMERGENCY">Emergency</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Prescribed Date *"
            type="date"
            value={formData.prescribedDate}
            onChange={(e) => handleInputChange('prescribedDate', e.target.value)}
            required
          />

          <Input
            label="Expiry Date *"
            type="date"
            value={formData.expiryDate}
            onChange={(e) => handleInputChange('expiryDate', e.target.value)}
            required
          />

          <Input
            label="Follow-up Date"
            type="date"
            value={formData.followUpDate}
            onChange={(e) => handleInputChange('followUpDate', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            General Instructions
          </label>
          <textarea
            value={formData.instructions}
            onChange={(e) => handleInputChange('instructions', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="General instructions for the patient"
          />
        </div>
      </div>

      {/* Medications */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-lg font-semibold text-gray-900">
            <Pill className="h-5 w-5" />
            <span>Medications</span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={addMedication}
          >
            Add Medication
          </Button>
        </div>

        <div className="space-y-6">
          {formData.medications.map((medication, index) => (
            <div key={index} className="p-4 border border-gray-200 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-gray-900">Medication #{index + 1}</h4>
                {formData.medications.length > 1 && (
                  <Button
                    type="button"
                    size="xs"
                    variant="ghost"
                    className="text-red-600"
                    onClick={() => removeMedication(index)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medication Name *
                  </label>
                  <select
                    value={medication.medicationName}
                    onChange={(e) => handleMedicationChange(index, 'medicationName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select medication</option>
                    {availableMedications.map(med => (
                      <option key={med.id} value={med.name}>
                        {med.name} - {med.strength}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Dosage *"
                  value={medication.dosage}
                  onChange={(e) => handleMedicationChange(index, 'dosage', e.target.value)}
                  placeholder="e.g., 500mg, 1 tablet"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frequency *
                  </label>
                  <select
                    value={medication.frequency}
                    onChange={(e) => handleMedicationChange(index, 'frequency', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select frequency</option>
                    <option value="Once daily">Once daily</option>
                    <option value="Twice daily">Twice daily</option>
                    <option value="Three times daily">Three times daily</option>
                    <option value="Four times daily">Four times daily</option>
                    <option value="Every 4 hours">Every 4 hours</option>
                    <option value="Every 6 hours">Every 6 hours</option>
                    <option value="Every 8 hours">Every 8 hours</option>
                    <option value="Every 12 hours">Every 12 hours</option>
                    <option value="As needed">As needed</option>
                  </select>
                </div>

                <Input
                  label="Duration *"
                  value={medication.duration}
                  onChange={(e) => handleMedicationChange(index, 'duration', e.target.value)}
                  placeholder="e.g., 7 days, 2 weeks"
                  required
                />

                <Input
                  label="Quantity"
                  value={medication.quantity}
                  onChange={(e) => handleMedicationChange(index, 'quantity', e.target.value)}
                  placeholder="e.g., 30 tablets"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Instructions
                </label>
                <textarea
                  value={medication.instructions}
                  onChange={(e) => handleMedicationChange(index, 'instructions', e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Take with food, Before meals, At bedtime"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex justify-end space-x-3 pt-6 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
          leftIcon={<X className="h-4 w-4" />}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          loading={loading}
          leftIcon={<Save className="h-4 w-4" />}
        >
          {isEdit ? 'Update Prescription' : 'Create Prescription'}
        </Button>
      </div>

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
                      <p className="text-sm text-gray-500">Age: {patient.age}</p>
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
    </form>
  );
};

export default CreatePrescription;
