import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { doctorService } from '../../services/doctorService';
import Card from '../common/Card';
import Button from '../common/Button';
import Modal from '../common/Modal';
import Input from '../common/Input';
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Users,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const DoctorSchedule = ({ doctorId }) => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState('week'); // 'week' or 'day'
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  useEffect(() => {
    fetchSchedule();
  }, [doctorId, currentWeek]);

  const fetchSchedule = async () => {
    try {
      setLoading(true);
      const weekStart = getWeekStart(currentWeek);
      const weekEnd = getWeekEnd(currentWeek);
      const response = await doctorService.getDoctorSchedule(doctorId, weekStart, weekEnd);
      setSchedule(response);
    } catch (err) {
      setError('Failed to fetch schedule');
      console.error('Error fetching schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const getWeekStart = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getWeekEnd = (date) => {
    const end = getWeekStart(date);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return end;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const navigateWeek = (direction) => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(newWeek.getDate() + (direction * 7));
    setCurrentWeek(newWeek);
  };

  const getScheduleForDay = (dayIndex) => {
    const weekStart = getWeekStart(currentWeek);
    const targetDate = new Date(weekStart);
    targetDate.setDate(targetDate.getDate() + dayIndex);
    
    return schedule.filter(slot => {
      const slotDate = new Date(slot.date);
      return slotDate.toDateString() === targetDate.toDateString();
    });
  };

  const getSlotColor = (slot) => {
    if (slot.isBooked) return 'bg-red-100 text-red-800 border-red-200';
    if (slot.isBlocked) return 'bg-gray-100 text-gray-800 border-gray-200';
    if (slot.isAvailable) return 'bg-green-100 text-green-800 border-green-200';
    return 'bg-blue-100 text-blue-800 border-blue-200';
  };

  const handleAddSlot = async (slotData) => {
    try {
      await doctorService.addScheduleSlot(doctorId, slotData);
      fetchSchedule();
      setShowAddModal(false);
    } catch (err) {
      console.error('Error adding schedule slot:', err);
    }
  };

  const handleEditSlot = (slot) => {
    setSelectedSlot(slot);
    setShowAddModal(true);
  };

  const handleDeleteSlot = async (slotId) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      try {
        await doctorService.deleteScheduleSlot(slotId);
        fetchSchedule();
      } catch (err) {
        console.error('Error deleting schedule slot:', err);
      }
    }
  };

  const canManageSchedule = user.role === 'ADMIN' || (user.role === 'DOCTOR' && user.id === doctorId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateWeek(-1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <div className="text-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {formatDate(getWeekStart(currentWeek))} - {formatDate(getWeekEnd(currentWeek))}
            </h2>
            <p className="text-sm text-gray-600">Weekly Schedule</p>
          </div>
          
          <button
            onClick={() => navigateWeek(1)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-lg">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-2 text-sm font-medium rounded-l-lg transition-colors ${
                viewMode === 'week' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-2 text-sm font-medium rounded-r-lg transition-colors ${
                viewMode === 'day' 
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Day
            </button>
          </div>

          {canManageSchedule && (
            <Button
              variant="primary"
              leftIcon={<Plus className="h-4 w-4" />}
              onClick={() => {
                setSelectedSlot(null);
                setShowAddModal(true);
              }}
            >
              Add Time Slot
            </Button>
          )}
        </div>
      </div>

      {/* Schedule Grid */}
      {viewMode === 'week' ? (
        <Card>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-8 gap-4 min-w-full">
              {/* Time column header */}
              <div className="font-medium text-gray-900 text-sm py-3 border-b">
                Time
              </div>
              
              {/* Day headers */}
              {weekDays.map((day, index) => {
                const daySchedule = getScheduleForDay(index);
                const weekStart = getWeekStart(currentWeek);
                const dayDate = new Date(weekStart);
                dayDate.setDate(dayDate.getDate() + index);
                
                return (
                  <div key={day} className="text-center border-b pb-3">
                    <div className="font-medium text-gray-900 text-sm">{day}</div>
                    <div className="text-xs text-gray-500">{dayDate.getDate()}</div>
                    <div className="text-xs text-blue-600 mt-1">
                      {daySchedule.length} slots
                    </div>
                  </div>
                );
              })}

              {/* Schedule slots */}
              {timeSlots.map((time) => (
                <React.Fragment key={time}>
                  <div className="text-sm text-gray-600 py-2 border-r border-gray-100">
                    {time}
                  </div>
                  
                  {weekDays.map((day, dayIndex) => {
                    const daySchedule = getScheduleForDay(dayIndex);
                    const timeSlot = daySchedule.find(slot => 
                      slot.startTime === time || slot.startTime.startsWith(time.split(':')[0])
                    );
                    
                    return (
                      <div key={`${day}-${time}`} className="py-2 min-h-[40px] border-r border-gray-100">
                        {timeSlot ? (
                          <div
                            className={`
                              px-2 py-1 rounded text-xs cursor-pointer border
                              ${getSlotColor(timeSlot)}
                              ${canManageSchedule ? 'hover:opacity-80' : ''}
                            `}
                            onClick={() => canManageSchedule && handleEditSlot(timeSlot)}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-medium">
                                {timeSlot.startTime} - {timeSlot.endTime}
                              </span>
                              {timeSlot.patientCount > 0 && (
                                <div className="flex items-center space-x-1">
                                  <Users className="h-3 w-3" />
                                  <span>{timeSlot.patientCount}</span>
                                </div>
                              )}
                            </div>
                            {timeSlot.isBooked && (
                              <div className="text-xs mt-1 truncate">
                                {timeSlot.patientName}
                              </div>
                            )}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        </Card>
      ) : (
        // Day view implementation would go here
        <Card>
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
            <p className="text-gray-600 mt-2">Day view will be implemented here</p>
          </div>
        </Card>
      )}

      {/* Schedule Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-green-50">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-green-600 font-medium">Available Slots</p>
              <p className="text-2xl font-bold text-green-900">
                {schedule.filter(slot => slot.isAvailable && !slot.isBooked).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-red-50">
          <div className="flex items-center space-x-3">
            <Users className="h-8 w-8 text-red-600" />
            <div>
              <p className="text-sm text-red-600 font-medium">Booked Slots</p>
              <p className="text-2xl font-bold text-red-900">
                {schedule.filter(slot => slot.isBooked).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-gray-50">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-8 w-8 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600 font-medium">Blocked Slots</p>
              <p className="text-2xl font-bold text-gray-900">
                {schedule.filter(slot => slot.isBlocked).length}
              </p>
            </div>
          </div>
        </Card>

        <Card className="bg-blue-50">
          <div className="flex items-center space-x-3">
            <Clock className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600 font-medium">Total Hours</p>
              <p className="text-2xl font-bold text-blue-900">
                {Math.round(schedule.length * 0.5 * 10) / 10}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Add/Edit Slot Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => {
            setShowAddModal(false);
            setSelectedSlot(null);
          }}
          title={selectedSlot ? 'Edit Time Slot' : 'Add Time Slot'}
          size="md"
        >
          <ScheduleSlotForm
            slot={selectedSlot}
            onSubmit={handleAddSlot}
            onCancel={() => {
              setShowAddModal(false);
              setSelectedSlot(null);
            }}
            onDelete={selectedSlot ? () => handleDeleteSlot(selectedSlot.id) : undefined}
          />
        </Modal>
      )}
    </div>
  );
};

// Helper Component
const ScheduleSlotForm = ({ slot, onSubmit, onCancel, onDelete }) => {
  const [formData, setFormData] = useState({
    date: slot?.date || new Date().toISOString().split('T')[0],
    startTime: slot?.startTime || '09:00',
    endTime: slot?.endTime || '10:00',
    isAvailable: slot?.isAvailable ?? true,
    isBlocked: slot?.isBlocked ?? false,
    maxPatients: slot?.maxPatients || 1,
    notes: slot?.notes || ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          required
        />

        <Input
          label="Max Patients"
          type="number"
          min="1"
          max="10"
          value={formData.maxPatients}
          onChange={(e) => setFormData(prev => ({ ...prev, maxPatients: parseInt(e.target.value) }))}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Start Time"
          type="time"
          value={formData.startTime}
          onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
          required
        />

        <Input
          label="End Time"
          type="time"
          value={formData.endTime}
          onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isAvailable"
            checked={formData.isAvailable}
            onChange={(e) => setFormData(prev => ({ ...prev, isAvailable: e.target.checked }))}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isAvailable" className="text-sm text-gray-700">Available for booking</label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isBlocked"
            checked={formData.isBlocked}
            onChange={(e) => setFormData(prev => ({ ...prev, isBlocked: e.target.checked }))}
            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          <label htmlFor="isBlocked" className="text-sm text-gray-700">Block this slot</label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Add any notes about this time slot"
        />
      </div>

      <div className="flex justify-between pt-4">
        <div>
          {onDelete && (
            <Button
              type="button"
              variant="danger"
              leftIcon={<Trash2 className="h-4 w-4" />}
              onClick={onDelete}
            >
              Delete Slot
            </Button>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {slot ? 'Update Slot' : 'Add Slot'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default DoctorSchedule;
