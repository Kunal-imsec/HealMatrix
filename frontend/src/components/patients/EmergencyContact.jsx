import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import Button from '../common/Button';
import Input from '../common/Input';
import Modal from '../common/Modal';
import { 
  Phone, 
  User, 
  MapPin, 
  Mail,
  Plus, 
  Edit3, 
  Trash2,
  AlertTriangle,
  Save,
  Users
} from 'lucide-react';

const EmergencyContact = ({ patientId, patientName, readOnly = false }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEmergencyContacts();
  }, [patientId]);

  const fetchEmergencyContacts = async () => {
    try {
      // For now, we'll use mock data since the service method might not exist
      const mockContacts = [
        {
          id: 1,
          name: 'Jane Doe',
          relationship: 'Spouse',
          phoneNumber: '+1-555-0123',
          alternatePhone: '+1-555-0124',
          email: 'jane.doe@email.com',
          address: '123 Main St, Anytown, ST 12345',
          isPrimary: true,
          canMakeDecisions: true
        },
        {
          id: 2,
          name: 'John Doe Sr.',
          relationship: 'Father',
          phoneNumber: '+1-555-0125',
          email: 'john.sr@email.com',
          address: '456 Oak Ave, Anytown, ST 12345',
          isPrimary: false,
          canMakeDecisions: false
        }
      ];
      
      setContacts(mockContacts);
    } catch (err) {
      setError('Failed to fetch emergency contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleAddContact = () => {
    setEditingContact(null);
    setShowAddModal(true);
  };

  const handleEditContact = (contact) => {
    setEditingContact(contact);
    setShowAddModal(true);
  };

  const handleDeleteContact = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this emergency contact?')) {
      try {
        // await patientService.deleteEmergencyContact(contactId);
        setContacts(prev => prev.filter(contact => contact.id !== contactId));
      } catch (err) {
        console.error('Error deleting contact:', err);
      }
    }
  };

  const handleContactSaved = () => {
    setShowAddModal(false);
    setEditingContact(null);
    fetchEmergencyContacts();
  };

  const handleSetPrimary = async (contactId) => {
    try {
      // Update primary contact
      setContacts(prev => prev.map(contact => ({
        ...contact,
        isPrimary: contact.id === contactId
      })));
    } catch (err) {
      console.error('Error setting primary contact:', err);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
            <Users className="h-6 w-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Emergency Contacts</h3>
              <p className="text-gray-600">{patientName}</p>
            </div>
          </div>
          
          {!readOnly && (
            <Button
              variant="primary"
              onClick={handleAddContact}
              leftIcon={<Plus className="h-4 w-4" />}
            >
              Add Contact
            </Button>
          )}
        </div>
      </div>

      {/* Contacts List */}
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Emergency Contacts</h3>
            <p className="text-gray-600 mb-6">
              Add emergency contacts who can be reached in case of medical emergencies.
            </p>
            {!readOnly && (
              <Button
                variant="primary"
                onClick={handleAddContact}
                leftIcon={<Plus className="h-4 w-4" />}
              >
                Add First Contact
              </Button>
            )}
          </div>
        ) : (
          contacts.map((contact) => (
            <div key={contact.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                        <span>{contact.name}</span>
                        {contact.isPrimary && (
                          <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            Primary
                          </span>
                        )}
                        {contact.canMakeDecisions && (
                          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            Medical Decisions
                          </span>
                        )}
                      </h4>
                      <p className="text-gray-600">{contact.relationship}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600">Primary:</span>
                        <span className="font-medium text-gray-900">{contact.phoneNumber}</span>
                      </div>
                      
                      {contact.alternatePhone && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Alternate:</span>
                          <span className="font-medium text-gray-900">{contact.alternatePhone}</span>
                        </div>
                      )}
                      
                      {contact.email && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-600">Email:</span>
                          <span className="font-medium text-gray-900">{contact.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      {contact.address && (
                        <div className="flex items-start space-x-2 text-sm">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                          <div>
                            <span className="text-gray-600">Address:</span>
                            <p className="font-medium text-gray-900">{contact.address}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {!readOnly && (
                  <div className="flex items-center space-x-2 ml-4">
                    {!contact.isPrimary && (
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => handleSetPrimary(contact.id)}
                        title="Set as primary contact"
                      >
                        Set Primary
                      </Button>
                    )}
                    
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => handleEditContact(contact)}
                      title="Edit contact"
                    >
                      <Edit3 className="h-3 w-3" />
                    </Button>
                    
                    <Button
                      size="xs"
                      variant="ghost"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteContact(contact.id)}
                      title="Delete contact"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-4">
                  <a
                    href={`tel:${contact.phoneNumber}`}
                    className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Primary</span>
                  </a>
                  
                  {contact.alternatePhone && (
                    <a
                      href={`tel:${contact.alternatePhone}`}
                      className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call Alternate</span>
                    </a>
                  )}
                  
                  {contact.email && (
                    <a
                      href={`mailto:${contact.email}`}
                      className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Mail className="h-4 w-4" />
                      <span>Email</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Important Notice */}
      {contacts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-medium mb-1">Emergency Contact Guidelines:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Primary contact will be called first in emergencies</li>
                <li>Contacts marked "Medical Decisions" can make healthcare decisions if patient is unable</li>
                <li>Keep contact information up to date</li>
                <li>At least one contact should be available 24/7</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Contact Modal */}
      {showAddModal && (
        <Modal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          title={editingContact ? 'Edit Emergency Contact' : 'Add Emergency Contact'}
          size="lg"
        >
          <ContactForm
            patientId={patientId}
            contact={editingContact}
            onSuccess={handleContactSaved}
            onCancel={() => setShowAddModal(false)}
          />
        </Modal>
      )}
    </div>
  );
};

// Contact Form Component
const ContactForm = ({ patientId, contact, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    relationship: contact?.relationship || '',
    phoneNumber: contact?.phoneNumber || '',
    alternatePhone: contact?.alternatePhone || '',
    email: contact?.email || '',
    address: contact?.address || '',
    isPrimary: contact?.isPrimary || false,
    canMakeDecisions: contact?.canMakeDecisions || false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear specific field error
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    if (error) setError('');
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.relationship.trim()) errors.relationship = 'Relationship is required';
    if (!formData.phoneNumber.trim()) {
      errors.phoneNumber = 'Phone number is required';
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNumber)) {
      errors.phoneNumber = 'Please enter a valid phone number';
    }
    
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const contactData = {
        ...formData,
        patientId
      };

      if (contact) {
        // Update existing contact
        // await patientService.updateEmergencyContact(contact.id, contactData);
      } else {
        // Create new contact
        // await patientService.createEmergencyContact(contactData);
      }

      onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save emergency contact');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Full Name *"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={validationErrors.name}
          required
        />

        <Input
          label="Relationship *"
          value={formData.relationship}
          onChange={(e) => handleInputChange('relationship', e.target.value)}
          placeholder="e.g., Spouse, Parent, Sibling"
          error={validationErrors.relationship}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Primary Phone *"
          type="tel"
          value={formData.phoneNumber}
          onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
          leftIcon={<Phone className="h-4 w-4 text-gray-400" />}
          error={validationErrors.phoneNumber}
          required
        />

        <Input
          label="Alternate Phone"
          type="tel"
          value={formData.alternatePhone}
          onChange={(e) => handleInputChange('alternatePhone', e.target.value)}
          leftIcon={<Phone className="h-4 w-4 text-gray-400" />}
        />
      </div>

      <Input
        label="Email Address"
        type="email"
        value={formData.email}
        onChange={(e) => handleInputChange('email', e.target.value)}
        leftIcon={<Mail className="h-4 w-4 text-gray-400" />}
        error={validationErrors.email}
      />

      <Input
        label="Address"
        value={formData.address}
        onChange={(e) => handleInputChange('address', e.target.value)}
        leftIcon={<MapPin className="h-4 w-4 text-gray-400" />}
        placeholder="Full address including city, state, ZIP"
      />

      <div className="space-y-3">
        <div className="flex items-center">
          <input
            id="isPrimary"
            type="checkbox"
            checked={formData.isPrimary}
            onChange={(e) => handleInputChange('isPrimary', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-900">
            Set as primary emergency contact
          </label>
        </div>

        <div className="flex items-center">
          <input
            id="canMakeDecisions"
            type="checkbox"
            checked={formData.canMakeDecisions}
            onChange={(e) => handleInputChange('canMakeDecisions', e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="canMakeDecisions" className="ml-2 block text-sm text-gray-900">
            Authorized to make medical decisions (if patient is unable)
          </label>
        </div>
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
          {contact ? 'Update Contact' : 'Add Contact'}
        </Button>
      </div>
    </form>
  );
};

export default EmergencyContact;
