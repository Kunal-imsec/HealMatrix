import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import DatePicker from '../common/DatePicker';
import { 
  Calendar, 
  Clock, 
  Plus, 
  Edit3, 
  Trash2,
  AlertTriangle,
  CheckCircle,
  X,
  Save
} from 'lucide-react';

const DoctorAvailability = ({ doctorId, doctorName, editable = true }) => {
  const [availability, setAvailability] = useState([]);
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showExceptionModal, setShowExceptionModal] = useState(false);
  const [editingAvailability, setEditingAvailability] = useState(null);
  const [error, setError] = useState('');

  const weekDays = [
    { id: 'MONDAY', label: 'Monday' },
    { id: 'TUESDAY', label: 'Tuesday' },
    { id: 'WEDNESDAY', label: 'Wednesday' },
    { id: 'THURSDAY', label: 'Thursday' },
    { id: 'FRIDAY', label: 'Friday' },
    { id: 'SATURDAY', label: 'Saturday' },
    { id: 'SUNDAY', label: 'Sunday' }
  ];

  useEffect(() => {
    fetchAvailability();
    fetchExceptions();
  }, [doctorId]);

  const fetchAvailability = async () => {
    try {
      // Mock data - replace with actual API call
      const mockAvailability = [
        { id: 1, dayOfWeek: 'MONDAY', startTime: '09:00', endTime: '17:00', isActive: true },
        { id: 2, dayOfWeek: 'TUESDAY', startTime: '09:00', endTime: '17:00', isActive: true },
        { id: 3, dayOfWeek: 'WEDNESDAY', startTime: '09:00', endTime: '17:00', isActive: true },
        { id: 4, dayOfWeek: 'THURSDAY', startTime: '09:00', endTime: '17:00', isActive: true },
        { id: 5, dayOfWeek: 'FRIDAY', startTime: '09:00', endTime: '17:00', isActive: true }
      ];
      setAvailability(mockAvailability);
    } catch (err) {
      setError('Failed to fetch availability');
    } finally {
      setLoading(false);
    }
  };

  const fetchExceptions = async () => {
    try {
      // Mock data - replace with actual API call
      const mockExceptions = [
        {
          id: 1,
          date: '2025-10-25',
          type: 'UNAVAILABLE',
          reason: 'Medical Conference',
          isAllDay: true
        },
        {
          id: 2,
          date: '2025-10-30',
          type: 'MODIFIED',
          reason: 'Half Day',
          isAllDay: false,
          startTime: '09:00',
          endTime: '13:00'
        }
      ];
      setExceptions(mockExceptions);
    } catch (err) {
      console.error('Error fetching exceptions:', err);
    }
  };

  const handleAddAvailability = () => {
    setEditingAvailability(null);
    setShowAddModal(true);
  };

  const handleEditAvailability = (item) => {
    setEditingAvailability(item);
    setShowAddModal(true);
  };

  const handleDeleteAvailability = async (id) => {
    if (window.confirm('Are you sure you want to delete this availability slot?')) {
      try {
        setAvailability(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error('Error deleting availability:', err);
      }
    }
  };

  const handleToggleAvailability = async (id, isActive) => {
    try {
      setAvailability(prev => prev.map(item => 
        item.id === id ? { ...item, isActive } : item
      ));
    } catch (err) {
      console.error('Error toggling availability:', err);
    }
  };

  const handleAvailabilityAdded = () => {
    setShowAddModal(false);
    setEditingAvailability(null);
    fetchAvailability();
  };

  const handleAddException = () => {
    setShowExceptionModal(true);
  };

  const handleExceptionAdded = () => {
    setShowExceptionModal(false);
    fetchExceptions();
  };

  const handleDeleteException = async (id) => {
    if (window.confirm('Are you sure you want to delete this exception?')) {
      try {
        setExceptions(prev => prev.filter(item => item.id !== id));
      } catch (err) {
        console.error('Error deleting exception:', err);
      }
    }
  };

  const getDayLabel = (dayId) => {
    return weekDays.find(day => day.id === dayId)?.label || dayId;
  };

  const formatTime = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getExceptionTypeColor = (type) => {
    switch (type) {
      case 'UNAVAILABLE':
        return 'bg-red-100 text-red-800';
      case 'MODIFIED':
        return 'bg-yellow-100 text-yellow-800';
      case 'EXTENDED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
            <Calendar className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Doctor Availability</h3>
              <p className="text-gray-600">{doctorName}</p>
            </div>
          </div>
          
          {editable && (
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={handleAddException}
                leftIcon={<AlertTriangle className="h-4 w-4" />}
              >
                Add Exception
              </Button>
              <Button
                variant="primary"
                onClick={handleAddAvailability}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add Availability
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Regular Availability */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Regular Schedule</h4>
        
        {availability.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Schedule Set</h3>
            <p className="text-gray-600 mb-4">Add availability slots to define the doctor's working hours.</p>
            {editable && (
              <Button
                variant="primary"
                onClick={handleAddAvailability}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add First Availability
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {weekDays.map(day => {
              const dayAvailability = availability.filter(a => a.dayOfWeek === day.id);
              
              return (
                <div key={day.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-24 text-sm font-medium text-gray-900">
                      {day.label}
                    </div>
                    
                    <div className="flex space-x-2">
                      {dayAvailability.length === 0 ? (
                        <span className="text-sm text-gray-500">Not Available</span>
                      ) : (
                        dayAvailability.map(slot => (
                          <div key={slot.id} className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              slot.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                            </span>
                            
                            {editable && (
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => handleToggleAvailability(slot.id, !slot.isActive)}
                                  className={`p-1 rounded ${
                                    slot.isActive 
                                      ? 'text-green-600 hover:text-green-700' 
                                      : 'text-gray-400 hover:text-gray-600'
                                  }`}
                                  title={slot.isActive ? 'Disable' : 'Enable'}
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </button>
                                
                                <button
                                  onClick={() => handleEditAvailability(slot)}
                                  className="p-1 text-blue-600 hover:text-blue-700"
                                  title="Edit"
                                >
                                  <Edit3 className="h-3 w-3" />
                                </button>
                                
                                <button
                                  onClick={() => handleDeleteAvailability(slot.id)}
                                  className="p-1 text-red-600 hover:text-red-700"
                                  title="Delete"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Exceptions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Schedule Exceptions</h4>
        
        {exceptions.length === 0 ? (
          <div className="text-center py-6">
            <AlertTriangle className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">No schedule exceptions</p>
          </div>
        ) : (
          <div className="space-y-3">
            {exceptions.map(exception => (
              <div key={exception.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="text-sm font-medium text-gray-900">
                    {new Date(exception.date).toLocaleDateString()}
                  </div>
                  
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getExceptionTypeColor(exception.type)}`}>
                    {exception.type}
                  </span>
                  
                  <div className="text-sm text-gray-600">
                    {exception.reason}
                  </div>
                  
                  {!exception.isAllDay && (
                    <div className="text-sm text-gray-500">
                      {formatTime(exception.startTime)} - {formatTime(exception.endTime)}
                    </div>
                  )}
                </div>
                
                {editable && (
                  <button
                    onClick={() => handleDeleteException(exception.id)}
                    className="p-1 text-red-600 hover:text-red-700"
                    title="Delete exception"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Availability Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={editingAvailability ? 'Edit Availability' : 'Add Availability'}
          size="md"
        >
          <AvailabilityForm
            doctorId={doctorId}
            availability={editingAvailability}
            onSuccess={handleAvailabilityAdded}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>
      )}

      {/* Add Exception Modal */}
      {showExceptionModal && (
        <Modal
          isOpen={showExceptionModal}
          onClose={() => setShowExceptionModal(false)}
          title="Add Schedule Exception"
          size="md"
        >
          <ExceptionForm
            doctorId={doctorId}
            onSuccess={handleExceptionAdded}
            onCancel={() => setShowExceptionModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

// Availability Form Component
const AvailabilityForm = ({ doctorId, availability, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    dayOfWeek: availability?.dayOfWeek || 'MONDAY',
    startTime: availability?.startTime || '09:00',
    endTime: availability?.endTime || '17:00',
    isActive: availability?.isActive !== false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const weekDays = [
    { id: 'MONDAY', label: 'Monday' },
    { id: 'TUESDAY', label: 'Tuesday' },
    { id: 'WEDNESDAY', label: 'Wednesday' },
    { id: 'THURSDAY', label: 'Thursday' },
    { id: 'FRIDAY', label: 'Friday' },
    { id: 'SATURDAY', label: 'Saturday' },
    { id: 'SUNDAY', label: 'Sunday' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (formData.startTime >= formData.endTime) {
      setError('End time must be after start time');
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
      const availabilityData = {
        ...formData,
        doctorId
      };

      if (availability) {
        // Update existing availability
        // await doctorService.updateAvailability(availability.id, availabilityData);
      } else {
        // Create new availability
        // await doctorService.createAvailability(availabilityData);
      }

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save availability');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Day of Week
        </label>
        <select
          value={formData.dayOfWeek}
          onChange={(e) => handleInputChange('dayOfWeek', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {weekDays.map(day => (
            <option key={day.id} value={day.id}>{day.label}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Time"
          type="time"
          value={formData.startTime}
          onChange={(e) => handleInputChange('startTime', e.target.value)}
          required
        />

        <Input
          label="End Time"
          type="time"
          value={formData.endTime}
          onChange={(e) => handleInputChange('endTime', e.target.value)}
          required
        />
      </div>

      <div className="flex items-center">
        <input
          id="isActive"
          type="checkbox"
          checked={formData.isActive}
          onChange={(e) => handleInputChange('isActive', e.target.checked)}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
          Active (available for appointments)
        </label>
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
          {availability ? 'Update' : 'Add'} Availability
        </Button>
      </div>
    </form>
  );
};

// Exception Form Component
const ExceptionForm = ({ doctorId, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    date: '',
    type: 'UNAVAILABLE',
    reason: '',
    isAllDay: true,
    startTime: '09:00',
    endTime: '17:00'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.date) {
      setError('Please select a date');
      return;
    }

    if (!formData.isAllDay && formData.startTime >= formData.endTime) {
      setError('End time must be after start time');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const exceptionData = {
        ...formData,
        doctorId
      };

      // await doctorService.createException(exceptionData);
      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create exception');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <DatePicker
        label="Date *"
        value={formData.date}
        onChange={(date) => handleInputChange('date', date)}
        minDate={new Date()}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Exception Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="UNAVAILABLE">Unavailable (No appointments)</option>
          <option value="MODIFIED">Modified Hours</option>
          <option value="EXTENDED">Extended Hours</option>
        </select>
      </div>

      <Input
        label="Reason"
        value={formData.reason}
        onChange={(e) => handleInputChange('reason', e.target.value)}
        placeholder="e.g., Medical Conference, Holiday, etc."
        required
      />

      {formData.type !== 'UNAVAILABLE' && (
        <>
          <div className="flex items-center">
            <input
              id="isAllDay"
              type="checkbox"
              checked={formData.isAllDay}
              onChange={(e) => handleInputChange('isAllDay', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isAllDay" className="ml-2 block text-sm text-gray-900">
              All Day
            </label>
          </div>

          {!formData.isAllDay && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Start Time"
                type="time"
                value={formData.startTime}
                onChange={(e) => handleInputChange('startTime', e.target.value)}
              />

              <Input
                label="End Time"
                type="time"
                value={formData.endTime}
                onChange={(e) => handleInputChange('endTime', e.target.value)}
              />
            </div>
          )}
        </>
      )}

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
          Add Exception
        </Button>
      </div>
    </form>
  );
};

export default DoctorAvailability;
