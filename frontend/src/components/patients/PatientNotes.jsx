import React, { useState, useEffect } from 'react';
import nurseService from '../../services/nurseService';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  User, 
  Calendar,
  Clock,
  Search,
  Filter,
  AlertTriangle,
  Save,
  X
} from 'lucide-react';

const PatientNotes = ({ patientId, patientName }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [patientId]);

  const fetchNotes = async () => {
    try {
      const response = await nurseService.getPatientNotes ? 
        await nurseService.getPatientNotes(patientId) :
        []; // Fallback if service method doesn't exist
      setNotes(response);
    } catch (err) {
      setError('Failed to fetch patient notes');
    } finally {
      setLoading(false);
    }
  };

  const handleAddNote = () => {
    setEditingNote(null);
    setShowAddModal(true);
  };

  const handleEditNote = (note) => {
    setEditingNote(note);
    setShowAddModal(true);
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      try {
        // await nurseService.deletePatientNote(noteId);
        // For now, just remove from local state
        setNotes(prev => prev.filter(note => note.id !== noteId));
      } catch (err) {
        console.error('Error deleting note:', err);
      }
    }
  };

  const handleNoteAdded = () => {
    setShowAddModal(false);
    setEditingNote(null);
    fetchNotes();
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.createdBy?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterType === 'all' || note.type === filterType;
    
    return matchesSearch && matchesFilter;
  });

  const getNoteTypeColor = (type) => {
    switch (type) {
      case 'CLINICAL':
        return 'bg-blue-100 text-blue-800';
      case 'NURSING':
        return 'bg-green-100 text-green-800';
      case 'MEDICATION':
        return 'bg-purple-100 text-purple-800';
      case 'PROGRESS':
        return 'bg-yellow-100 text-yellow-800';
      case 'DISCHARGE':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canEditNote = (note) => {
    // Allow editing if user is the creator or has admin/nurse privileges
    return note.createdBy === user.id || 
           ['ADMIN', 'NURSE', 'DOCTOR'].includes(user.role);
  };

  const canDeleteNote = (note) => {
    // Allow deletion if user is the creator or has admin privileges
    return note.createdBy === user.id || user.role === 'ADMIN';
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
            <FileText className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Patient Notes</h3>
              <p className="text-gray-600">{patientName}</p>
            </div>
          </div>
          
          <Button
            variant="primary"
            onClick={handleAddNote}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Add Note
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
                placeholder="Search notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Types</option>
              <option value="CLINICAL">Clinical</option>
              <option value="NURSING">Nursing</option>
              <option value="MEDICATION">Medication</option>
              <option value="PROGRESS">Progress</option>
              <option value="DISCHARGE">Discharge</option>
            </select>
          </div>

          <div className="text-sm text-gray-500">
            {filteredNotes.length} of {notes.length} notes
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || filterType !== 'all' ? 'No matching notes found' : 'No notes recorded'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Start by adding the first note for this patient'
              }
            </p>
            {!searchTerm && filterType === 'all' && (
              <Button
                variant="primary"
                onClick={handleAddNote}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add First Note
              </Button>
            )}
          </div>
        ) : (
          filteredNotes.map((note) => (
            <div key={note.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {note.title && (
                      <h4 className="text-lg font-medium text-gray-900">{note.title}</h4>
                    )}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getNoteTypeColor(note.type)}`}>
                      {note.type || 'GENERAL'}
                    </span>
                    {note.priority === 'HIGH' && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                        High Priority
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <User className="h-4 w-4" />
                      <span>{note.createdByName || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(note.createdAt).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {canEditNote(note) && (
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => handleEditNote(note)}
                      title="Edit note"
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                  )}
                  
                  {canDeleteNote(note) && (
                    <Button
                      size="xs"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteNote(note.id)}
                      title="Delete note"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              </div>

              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 whitespace-pre-wrap">{note.content}</p>
              </div>

              {note.updatedAt && note.updatedAt !== note.createdAt && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Last updated: {new Date(note.updatedAt).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Note Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={editingNote ? 'Edit Note' : 'Add Patient Note'}
          size="lg"
        >
          <NoteForm
            patientId={patientId}
            note={editingNote}
            onSuccess={handleNoteAdded}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

// Note Form Component
const NoteForm = ({ patientId, note, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    type: note?.type || 'CLINICAL',
    priority: note?.priority || 'NORMAL'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.content.trim()) {
      setError('Note content is required');
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
      const noteData = {
        ...formData,
        patientId,
        createdBy: user.id,
        createdByName: `${user.firstName} ${user.lastName}`,
        createdAt: note ? note.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (note) {
        // Update existing note
        // await nurseService.updatePatientNote(note.id, noteData);
      } else {
        // Create new note
        // await nurseService.createPatientNote(noteData);
      }

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Title (Optional)"
        value={formData.title}
        onChange={(e) => handleInputChange('title', e.target.value)}
        placeholder="Brief title for the note"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note Type
          </label>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="CLINICAL">Clinical</option>
            <option value="NURSING">Nursing</option>
            <option value="MEDICATION">Medication</option>
            <option value="PROGRESS">Progress</option>
            <option value="DISCHARGE">Discharge</option>
          </select>
        </div>

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
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Note Content *
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => handleInputChange('content', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter detailed note content..."
          required
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
          {note ? 'Update Note' : 'Add Note'}
        </Button>
      </div>
    </form>
  );
};

export default PatientNotes;
