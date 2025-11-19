import React, { useState, useEffect } from 'react';
import nurseService from '../../services/nurseService';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { 
  Activity, 
  Heart, 
  Thermometer, 
  Zap,
  TrendingUp,
  TrendingDown,
  Plus,
  Calendar,
  Clock,
  User,
  Save,
  AlertTriangle
} from 'lucide-react';

const VitalSigns = ({ patientId, patientName }) => {
  const [vitals, setVitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVitalSigns();
  }, [patientId]);

  const fetchVitalSigns = async () => {
    try {
      const response = await nurseService.getPatientVitals(patientId);
      setVitals(response);
    } catch (err) {
      setError('Failed to fetch vital signs');
    } finally {
      setLoading(false);
    }
  };

  const handleAddVital = () => {
    setShowAddModal(true);
  };

  const handleVitalAdded = () => {
    setShowAddModal(false);
    fetchVitalSigns();
  };

  const getVitalIcon = (type) => {
    switch (type) {
      case 'temperature':
        return <Thermometer className="h-5 w-5" />;
      case 'blood_pressure':
        return <Activity className="h-5 w-5" />;
      case 'heart_rate':
        return <Heart className="h-5 w-5" />;
      case 'respiratory_rate':
        return <Zap className="h-5 w-5" />;
      case 'oxygen_saturation':
        return <Activity className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getVitalColor = (type, value) => {
    // Basic vital sign ranges (these should be configurable)
    const normalRanges = {
      temperature: { min: 97.8, max: 99.1, unit: '°F' },
      heart_rate: { min: 60, max: 100, unit: 'bpm' },
      respiratory_rate: { min: 12, max: 20, unit: '/min' },
      oxygen_saturation: { min: 95, max: 100, unit: '%' },
      systolic_bp: { min: 90, max: 120 },
      diastolic_bp: { min: 60, max: 80 }
    };

    const range = normalRanges[type];
    if (!range) return 'text-gray-600 bg-gray-100';

    const numValue = parseFloat(value);
    if (numValue < range.min || numValue > range.max) {
      return 'text-red-600 bg-red-100';
    }
    return 'text-green-600 bg-green-100';
  };

  const formatVitalValue = (type, value) => {
    switch (type) {
      case 'temperature':
        return `${value}°F`;
      case 'heart_rate':
        return `${value} bpm`;
      case 'respiratory_rate':
        return `${value}/min`;
      case 'oxygen_saturation':
        return `${value}%`;
      case 'blood_pressure':
        return value; // Should be in format "120/80"
      default:
        return value;
    }
  };

  const getTrend = (currentVital, previousVital) => {
    if (!previousVital) return null;
    
    const current = parseFloat(currentVital.value);
    const previous = parseFloat(previousVital.value);
    
    if (current > previous) return 'up';
    if (current < previous) return 'down';
    return 'same';
  };

  const latestVitals = vitals.length > 0 ? vitals[0] : null;

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
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
            <Activity className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Vital Signs</h3>
              <p className="text-gray-600">Patient: {patientName}</p>
            </div>
          </div>
          
          <Button
            variant="primary"
            onClick={handleAddVital}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Record Vitals
          </Button>
        </div>
      </div>

      {/* Latest Vitals Overview */}
      {latestVitals && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-medium text-gray-900">Current Vitals</h4>
            <div className="text-sm text-gray-500">
              <Calendar className="inline h-4 w-4 mr-1" />
              {new Date(latestVitals.recordedAt).toLocaleDateString()}
              <Clock className="inline h-4 w-4 ml-3 mr-1" />
              {new Date(latestVitals.recordedAt).toLocaleTimeString()}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Temperature */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`p-2 rounded-lg ${getVitalColor('temperature', latestVitals.temperature)}`}>
                  <Thermometer className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-600">Temperature</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatVitalValue('temperature', latestVitals.temperature)}
              </div>
            </div>

            {/* Blood Pressure */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`p-2 rounded-lg ${getVitalColor('blood_pressure', latestVitals.bloodPressure)}`}>
                  <Activity className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-600">Blood Pressure</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {latestVitals.bloodPressure} mmHg
              </div>
            </div>

            {/* Heart Rate */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`p-2 rounded-lg ${getVitalColor('heart_rate', latestVitals.heartRate)}`}>
                  <Heart className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-600">Heart Rate</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatVitalValue('heart_rate', latestVitals.heartRate)}
              </div>
            </div>

            {/* Oxygen Saturation */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className={`p-2 rounded-lg ${getVitalColor('oxygen_saturation', latestVitals.oxygenSaturation)}`}>
                  <Zap className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium text-gray-600">Oxygen Sat</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatVitalValue('oxygen_saturation', latestVitals.oxygenSaturation)}
              </div>
            </div>
          </div>

          {latestVitals.notes && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Notes:</strong> {latestVitals.notes}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Vitals History */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Vitals History</h4>
        
        {vitals.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Vital Signs Recorded</h3>
            <p className="text-gray-600 mb-4">Start by recording the patient's vital signs.</p>
            <Button
              variant="primary"
              onClick={handleAddVital}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Record First Vitals
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {vitals.map((vital, index) => {
              const previousVital = vitals[index + 1];
              
              return (
                <div key={vital.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Recorded by {vital.recordedBy || 'Unknown'}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(vital.recordedAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Temperature</div>
                      <div className={`text-lg font-semibold ${getVitalColor('temperature', vital.temperature).includes('red') ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatVitalValue('temperature', vital.temperature)}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-600">Blood Pressure</div>
                      <div className={`text-lg font-semibold ${getVitalColor('blood_pressure', vital.bloodPressure).includes('red') ? 'text-red-600' : 'text-gray-900'}`}>
                        {vital.bloodPressure} mmHg
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-600">Heart Rate</div>
                      <div className={`text-lg font-semibold ${getVitalColor('heart_rate', vital.heartRate).includes('red') ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatVitalValue('heart_rate', vital.heartRate)}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="text-sm text-gray-600">Oxygen Sat</div>
                      <div className={`text-lg font-semibold ${getVitalColor('oxygen_saturation', vital.oxygenSaturation).includes('red') ? 'text-red-600' : 'text-gray-900'}`}>
                        {formatVitalValue('oxygen_saturation', vital.oxygenSaturation)}
                      </div>
                    </div>
                  </div>

                  {vital.notes && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      <strong>Notes:</strong> {vital.notes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Vital Signs Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title="Record Vital Signs"
          size="lg"
        >
          <AddVitalForm
            patientId={patientId}
            onSuccess={handleVitalAdded}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

// Add Vital Form Component
const AddVitalForm = ({ patientId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    temperature: '',
    bloodPressure: '',
    heartRate: '',
    respiratoryRate: '',
    oxygenSaturation: '',
    weight: '',
    height: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.temperature && !formData.bloodPressure && !formData.heartRate) {
      setError('Please record at least one vital sign');
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
      const vitalData = {
        ...formData,
        patientId,
        recordedAt: new Date().toISOString()
      };

      await nurseService.recordVitalSigns(patientId, vitalData);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to record vital signs');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Temperature (°F)"
          type="number"
          step="0.1"
          value={formData.temperature}
          onChange={(e) => handleInputChange('temperature', e.target.value)}
          placeholder="98.6"
          leftIcon={<Thermometer className="h-4 w-4 text-gray-400" />}
        />

        <Input
          label="Blood Pressure (mmHg)"
          value={formData.bloodPressure}
          onChange={(e) => handleInputChange('bloodPressure', e.target.value)}
          placeholder="120/80"
          leftIcon={<Activity className="h-4 w-4 text-gray-400" />}
        />

        <Input
          label="Heart Rate (bpm)"
          type="number"
          value={formData.heartRate}
          onChange={(e) => handleInputChange('heartRate', e.target.value)}
          placeholder="72"
          leftIcon={<Heart className="h-4 w-4 text-gray-400" />}
        />

        <Input
          label="Respiratory Rate (/min)"
          type="number"
          value={formData.respiratoryRate}
          onChange={(e) => handleInputChange('respiratoryRate', e.target.value)}
          placeholder="16"
          leftIcon={<Zap className="h-4 w-4 text-gray-400" />}
        />

        <Input
          label="Oxygen Saturation (%)"
          type="number"
          value={formData.oxygenSaturation}
          onChange={(e) => handleInputChange('oxygenSaturation', e.target.value)}
          placeholder="98"
          leftIcon={<Activity className="h-4 w-4 text-gray-400" />}
        />

        <Input
          label="Weight (lbs)"
          type="number"
          step="0.1"
          value={formData.weight}
          onChange={(e) => handleInputChange('weight', e.target.value)}
          placeholder="150"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleInputChange('notes', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Any additional observations or notes..."
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
          leftIcon={<Save className="h-4 w-4" />}
        >
          Record Vitals
        </Button>
      </div>
    </form>
  );
};

export default VitalSigns;
