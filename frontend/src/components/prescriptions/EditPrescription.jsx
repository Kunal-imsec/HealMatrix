import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { prescriptionService } from '../../services/prescriptionService';
import Button from '../common/Button';
import Input from '../common/Input';
import MedicationSelector from './MedicationSelector';
import DrugInteractionChecker from './DrugInteractionChecker';
import { 
  AlertCircle, 
  CheckCircle, 
  Save, 
  Pill,
  Plus,
  Trash2,
  AlertTriangle
} from 'lucide-react';

const EditPrescription = ({ prescriptionId, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [prescription, setPrescription] = useState(null);
  const [formData, setFormData] = useState({
    patientId: '',
    doctorId: '',
    diagnosis: '',
    medications: [],
    notes: '',
    followUpDate: '',
    status: 'ACTIVE'
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showDrugInteractions, setShowDrugInteractions] = useState(false);
  const [interactions, setInteractions] = useState([]);

  useEffect(() => {
    fetchPrescription();
  }, [prescriptionId]);

  useEffect(() => {
    if (formData.medications.length > 1) {
      checkDrugInteractions();
    }
  }, [formData.medications]);

  const fetchPrescription = async () => {
    try {
      const response = await prescriptionService.getPrescriptionById(prescriptionId);
      setPrescription(response);
      setFormData({
        ...response,
        medications: response.medications || []
      });
    } catch (err) {
      setError('Failed to fetch prescription details');
    } finally {
      setLoading(false);
    }
  };

  const checkDrugInteractions = async () => {
    try {
      const medicationIds = formData.medications.map(med => med.medicationId || med.id);
      const response = await prescriptionService.checkDrugInteractions(medicationIds);
      setInteractions(response);
      
      if (response.length > 0) {
        setShowDrugInteractions(true);
      }
    } catch (err) {
      console.error('Error checking drug interactions:', err);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (error) setError('');
  };

  const handleMedicationSelect = (medication) => {
    const newMedication = {
      medicationId: medication.id,
      medicationName: medication.name,
      dosage: '',
      frequency: '',
      duration: '',
      quantity: '',
      instructions: '',
      ...medication
    };

    setFormData(prev => ({
      ...prev,
      medications: [...prev.medications, newMedication]
    }));
  };

  const handleMedicationUpdate = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const handleRemoveMedication = (index) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.diagnosis?.trim()) {
      errors.diagnosis = 'Diagnosis is required';
    }
    
    if (formData.medications.length === 0) {
      errors.medications = 'At least one medication is required';
    }

    formData.medications.forEach((med, index) => {
      if (!med.dosage) errors[`medication_${index}_dosage`] = 'Dosage is required';
      if (!med.frequency) errors[`medication_${index}_frequency`] = 'Frequency is required';
      if (!med.duration) errors[`medication_${index}_duration`] = 'Duration is required';
    });

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    // Check for critical drug interactions
    if (interactions.some(i => i.severity === 'SEVERE')) {
      if (!window.confirm('There are severe drug interactions. Do you still want to proceed?')) {
        return;
      }
    }

    setSaving(true);
    setError('');

    try {
      const updateData = {
        ...formData,
        updatedBy: user.id,
        updatedAt: new Date().toISOString()
      };

      await prescriptionService.updatePrescription(prescriptionId, updateData);
      setSuccess(true);
      
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err) {
      setError(err.message || 'Failed to update prescription');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Prescription Updated Successfully!
        </h3>
        <p className="text-gray-600">
          The prescription has been updated.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Edit Prescription</h3>
            <p className="text-gray-600">Update prescription details</p>
          </div>
          
          {prescription && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Prescription ID</p>
              <p className="font-mono text-lg font-semibold text-gray-900">
                {prescription.prescriptionNumber}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Patient & Doctor Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Patient
            </label>
            <Input
              value={prescription?.patientName || ''}
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Doctor
            </label>
            <Input
              value={prescription?.doctorName || ''}
              disabled
            />
          </div>
        </div>

        {/* Diagnosis */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diagnosis *
          </label>
          <textarea
            value={formData.diagnosis || ''}
            onChange={(e) => handleInputChange('diagnosis', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter diagnosis"
          />
          {validationErrors.diagnosis && (
            <p className="text-red-600 text-xs mt-1 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {validationErrors.diagnosis}
            </p>
          )}
        </div>

        {/* Medications */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Medications *
            </label>
            <MedicationSelector
              onSelect={handleMedicationSelect}
              trigger={
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<Plus className="h-4 w-4" />}
                >
                  Add Medication
                </Button>
              }
            />
          </div>

          {formData.medications.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Pill className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">No medications added</p>
              <p className="text-sm text-gray-500">Click "Add Medication" to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {formData.medications.map((medication, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-900">{medication.medicationName}</h4>
                      {medication.genericName && (
                        <p className="text-sm text-gray-600">Generic: {medication.genericName}</p>
                      )}
                    </div>
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => handleRemoveMedication(index)}
                      leftIcon={<Trash2 className="h-3 w-3" />}
                      className="text-red-600"
                    >
                      Remove
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Dosage *
                      </label>
                      <Input
                        size="sm"
                        value={medication.dosage || ''}
                        onChange={(e) => handleMedicationUpdate(index, 'dosage', e.target.value)}
                        placeholder="e.g., 500mg"
                        error={validationErrors[`medication_${index}_dosage`]}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Frequency *
                      </label>
                      <select
                        value={medication.frequency || ''}
                        onChange={(e) => handleMedicationUpdate(index, 'frequency', e.target.value)}
                        className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select</option>
                        <option value="ONCE_DAILY">Once Daily</option>
                        <option value="TWICE_DAILY">Twice Daily</option>
                        <option value="THREE_TIMES_DAILY">Three Times Daily</option>
                        <option value="FOUR_TIMES_DAILY">Four Times Daily</option>
                        <option value="AS_NEEDED">As Needed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Duration *
                      </label>
                      <Input
                        size="sm"
                        value={medication.duration || ''}
                        onChange={(e) => handleMedicationUpdate(index, 'duration', e.target.value)}
                        placeholder="e.g., 7 days"
                        error={validationErrors[`medication_${index}_duration`]}
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Quantity
                      </label>
                      <Input
                        size="sm"
                        type="number"
                        value={medication.quantity || ''}
                        onChange={(e) => handleMedicationUpdate(index, 'quantity', e.target.value)}
                        placeholder="Total qty"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Special Instructions
                    </label>
                    <textarea
                      value={medication.instructions || ''}
                      onChange={(e) => handleMedicationUpdate(index, 'instructions', e.target.value)}
                      rows={2}
                      className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Take with food, avoid alcohol"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {validationErrors.medications && (
            <p className="text-red-600 text-xs mt-1 flex items-center">
              <AlertCircle className="h-3 w-3 mr-1" />
              {validationErrors.medications}
            </p>
          )}
        </div>

        {/* Drug Interactions Warning */}
        {interactions.length > 0 && (
          <DrugInteractionChecker
            interactions={interactions}
            isOpen={showDrugInteractions}
            onClose={() => setShowDrugInteractions(false)}
          />
        )}

        {/* Additional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes
          </label>
          <textarea
            value={formData.notes || ''}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Any additional instructions or notes"
          />
        </div>

        {/* Follow-up Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Follow-up Date
            </label>
            <Input
              type="date"
              value={formData.followUpDate || ''}
              onChange={(e) => handleInputChange('followUpDate', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={formData.status || 'ACTIVE'}
              onChange={(e) => handleInputChange('status', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
              <option value="EXPIRED">Expired</option>
            </select>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={saving}
        >
          Cancel
        </Button>

        <Button
          variant="primary"
          onClick={handleSave}
          loading={saving}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default EditPrescription;
