import React, { useState } from 'react';
import { prescriptionService } from '../../services/prescriptionService';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import { 
  CheckCircle, 
  AlertTriangle, 
  User, 
  Calendar,
  Pill,
  DollarSign,
  FileText,
  Printer,
  Save
} from 'lucide-react';

const DispenseRecord = ({ prescription, onComplete, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    medications: prescription.medications.map(med => ({
      ...med,
      dispensedQuantity: med.quantity,
      batchNumber: '',
      expiryDate: '',
      substituted: false,
      substituteReason: '',
      price: 0
    })),
    patientCounseling: false,
    counselingNotes: '',
    patientSignature: false,
    pharmacistNotes: '',
    paymentMethod: 'CASH',
    paymentReceived: false,
    insuranceClaim: false,
    insuranceDetails: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleMedicationChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      medications: prev.medications.map((med, i) => 
        i === index ? { ...med, [field]: value } : med
      )
    }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};

    formData.medications.forEach((med, index) => {
      if (!med.batchNumber) {
        errors[`medication_${index}_batchNumber`] = 'Batch number required';
      }
      if (!med.expiryDate) {
        errors[`medication_${index}_expiryDate`] = 'Expiry date required';
      }
      if (med.dispensedQuantity <= 0) {
        errors[`medication_${index}_quantity`] = 'Invalid quantity';
      }
      if (med.substituted && !med.substituteReason) {
        errors[`medication_${index}_substituteReason`] = 'Reason required for substitution';
      }
    });

    if (!formData.patientSignature) {
      errors.patientSignature = 'Patient signature required';
    }

    if (!formData.paymentReceived && !formData.insuranceClaim) {
      errors.payment = 'Payment confirmation or insurance claim required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const calculateTotal = () => {
    return formData.medications.reduce((sum, med) => sum + (med.price * med.dispensedQuantity), 0);
  };

  const handleDispense = async () => {
    if (!validateForm()) {
      setError('Please complete all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const dispenseData = {
        prescriptionId: prescription.id,
        dispensedBy: user.id,
        dispensedAt: new Date().toISOString(),
        medications: formData.medications,
        totalAmount: calculateTotal(),
        patientCounseling: formData.patientCounseling,
        counselingNotes: formData.counselingNotes,
        pharmacistNotes: formData.pharmacistNotes,
        paymentMethod: formData.paymentMethod,
        paymentReceived: formData.paymentReceived,
        insuranceClaim: formData.insuranceClaim,
        insuranceDetails: formData.insuranceDetails
      };

      await prescriptionService.dispensePrescription(dispenseData);
      
      // Print label/receipt if needed
      // await printDispenseLabel(dispenseData);
      
      onComplete();
    } catch (err) {
      setError(err.message || 'Failed to dispense prescription');
    } finally {
      setLoading(false);
    }
  };

  const handlePrintLabel = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Prescription Info */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <FileText className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Prescription #</p>
              <p className="font-medium text-gray-900">{prescription.prescriptionNumber}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <User className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Patient</p>
              <p className="font-medium text-gray-900">{prescription.patientName}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Calendar className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-600">Prescribed Date</p>
              <p className="font-medium text-gray-900">
                {new Date(prescription.prescribedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Medications Dispensing */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Medications to Dispense</h4>
        <div className="space-y-4">
          {formData.medications.map((medication, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Pill className="h-5 w-5 text-blue-600" />
                  <div>
                    <h5 className="font-medium text-gray-900">{medication.medicationName}</h5>
                    <p className="text-sm text-gray-600">
                      Prescribed: {medication.dosage} • {medication.frequency}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={medication.substituted}
                    onChange={(e) => handleMedicationChange(index, 'substituted', e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label className="ml-2 text-sm text-gray-700">Substituted</label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <Input
                  label="Dispensed Quantity *"
                  type="number"
                  value={medication.dispensedQuantity}
                  onChange={(e) => handleMedicationChange(index, 'dispensedQuantity', parseInt(e.target.value))}
                  error={validationErrors[`medication_${index}_quantity`]}
                  size="sm"
                />

                <Input
                  label="Batch Number *"
                  value={medication.batchNumber}
                  onChange={(e) => handleMedicationChange(index, 'batchNumber', e.target.value)}
                  error={validationErrors[`medication_${index}_batchNumber`]}
                  size="sm"
                />

                <Input
                  label="Expiry Date *"
                  type="date"
                  value={medication.expiryDate}
                  onChange={(e) => handleMedicationChange(index, 'expiryDate', e.target.value)}
                  error={validationErrors[`medication_${index}_expiryDate`]}
                  size="sm"
                />

                <Input
                  label="Unit Price"
                  type="number"
                  step="0.01"
                  value={medication.price}
                  onChange={(e) => handleMedicationChange(index, 'price', parseFloat(e.target.value))}
                  leftIcon={<span className="text-gray-400 text-sm">$</span>}
                  size="sm"
                />
              </div>

              {medication.substituted && (
                <div className="mt-3">
                  <Input
                    label="Substitution Reason *"
                    value={medication.substituteReason}
                    onChange={(e) => handleMedicationChange(index, 'substituteReason', e.target.value)}
                    placeholder="Explain reason for substitution"
                    error={validationErrors[`medication_${index}_substituteReason`]}
                    size="sm"
                  />
                </div>
              )}

              <div className="mt-3 flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium text-gray-700">Subtotal:</span>
                <span className="text-sm font-bold text-gray-900">
                  ${(medication.price * medication.dispensedQuantity).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Patient Counseling */}
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-gray-900">Patient Counseling</h4>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.patientCounseling}
              onChange={(e) => handleInputChange('patientCounseling', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Counseling Provided</span>
          </label>
        </div>

        {formData.patientCounseling && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Counseling Notes
            </label>
            <textarea
              value={formData.counselingNotes}
              onChange={(e) => handleInputChange('counselingNotes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Document counseling provided to patient..."
            />
          </div>
        )}
      </div>

      {/* Payment Information */}
      <div className="border border-gray-200 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Payment Information</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <select
              value={formData.paymentMethod}
              onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="CASH">Cash</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="DEBIT_CARD">Debit Card</option>
              <option value="INSURANCE">Insurance</option>
              <option value="MOBILE_PAYMENT">Mobile Payment</option>
            </select>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Total Amount:</span>
            </div>
            <span className="text-xl font-bold text-gray-900">
              ${calculateTotal().toFixed(2)}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.paymentReceived}
              onChange={(e) => handleInputChange('paymentReceived', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">Payment Received</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.insuranceClaim}
              onChange={(e) => handleInputChange('insuranceClaim', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">File Insurance Claim</span>
          </label>
        </div>

        {formData.insuranceClaim && (
          <div className="mt-3">
            <Input
              label="Insurance Details"
              value={formData.insuranceDetails}
              onChange={(e) => handleInputChange('insuranceDetails', e.target.value)}
              placeholder="Insurance provider and policy number"
            />
          </div>
        )}

        {validationErrors.payment && (
          <p className="text-red-600 text-xs mt-2 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {validationErrors.payment}
          </p>
        )}
      </div>

      {/* Additional Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pharmacist Notes
        </label>
        <textarea
          value={formData.pharmacistNotes}
          onChange={(e) => handleInputChange('pharmacistNotes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Any additional notes or observations..."
        />
      </div>

      {/* Patient Signature */}
      <div className="border border-gray-200 rounded-lg p-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.patientSignature}
            onChange={(e) => handleInputChange('patientSignature', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <span className="ml-2 text-sm font-medium text-gray-700">
            Patient signature obtained (confirming receipt of medications and counseling) *
          </span>
        </label>
        {validationErrors.patientSignature && (
          <p className="text-red-600 text-xs mt-2 flex items-center">
            <AlertTriangle className="h-3 w-3 mr-1" />
            {validationErrors.patientSignature}
          </p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center space-x-2">
          <AlertTriangle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between pt-4 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={handlePrintLabel}
          leftIcon={<Printer className="h-4 w-4" />}
        >
          Print Label
        </Button>

        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>

          <Button
            variant="success"
            onClick={handleDispense}
            loading={loading}
            leftIcon={<CheckCircle className="h-4 w-4" />}
          >
            Complete Dispensing
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DispenseRecord;
