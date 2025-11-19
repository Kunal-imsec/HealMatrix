import React, { useState, useEffect, useRef } from 'react';
import medicationService from '../../services/medicationService';
import { Search, Pill, AlertTriangle, X } from 'lucide-react';

const MedicationSelector = ({ onSelect, trigger, placeholder = "Search medications..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [medications, setMedications] = useState([]);
  const [filteredMedications, setFilteredMedications] = useState([]);
  const [selectedMedication, setSelectedMedication] = useState(null);
  const [loading, setLoading] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const dropdownRef = useRef(null);
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchMedications();
      searchRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Debounced search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchTerm.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        filterMedications(searchTerm);
      }, 300);
    } else if (searchTerm.trim().length === 0) {
      setFilteredMedications(medications.slice(0, 50));
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm, medications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const fetchMedications = async () => {
    try {
      setLoading(true);
      // Mock data - replace with actual API call
      const mockMedications = [
        {
          id: 1,
          name: 'Amoxicillin',
          genericName: 'Amoxicillin',
          brandNames: ['Amoxil', 'Moxatag'],
          form: 'Capsule',
          strength: '500mg',
          category: 'Antibiotic',
          manufacturer: 'Pfizer',
          requiresPrescription: true,
          stockLevel: 150,
          warnings: ['Take with food']
        },
        {
          id: 2,
          name: 'Lisinopril',
          genericName: 'Lisinopril',
          brandNames: ['Prinivil', 'Zestril'],
          form: 'Tablet',
          strength: '10mg',
          category: 'ACE Inhibitor',
          manufacturer: 'Merck',
          requiresPrescription: true,
          stockLevel: 200,
          warnings: ['May cause dizziness']
        },
        {
          id: 3,
          name: 'Ibuprofen',
          genericName: 'Ibuprofen',
          brandNames: ['Advil', 'Motrin'],
          form: 'Tablet',
          strength: '400mg',
          category: 'NSAID',
          manufacturer: 'Various',
          requiresPrescription: false,
          stockLevel: 300,
          warnings: ['Take with food', 'Do not exceed recommended dose']
        }
      ];

      setMedications(mockMedications);
      setFilteredMedications(mockMedications.slice(0, 50));
    } catch (err) {
      console.error('Error fetching medications:', err);
    } finally {
      setLoading(false);
    }
  };

  const filterMedications = (term) => {
    const filtered = medications.filter(med =>
      med.name.toLowerCase().includes(term.toLowerCase()) ||
      med.genericName.toLowerCase().includes(term.toLowerCase()) ||
      med.brandNames?.some(brand => brand.toLowerCase().includes(term.toLowerCase())) ||
      med.category.toLowerCase().includes(term.toLowerCase())
    );
    setFilteredMedications(filtered);
    setHighlightedIndex(-1);
  };

  const handleSelect = (medication) => {
    setSelectedMedication(medication);
    onSelect(medication);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredMedications.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredMedications.length) {
          handleSelect(filteredMedications[highlightedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const getStockLevelColor = (stockLevel) => {
    if (stockLevel > 100) return 'text-green-600';
    if (stockLevel > 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger */}
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg">
          {/* Search Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Medications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-sm text-gray-500 mt-2">Loading medications...</p>
              </div>
            ) : filteredMedications.length === 0 ? (
              <div className="p-8 text-center">
                <Pill className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">
                  {searchTerm ? 'No medications found' : 'Start typing to search'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredMedications.map((medication, index) => (
                  <button
                    key={medication.id}
                    onClick={() => handleSelect(medication)}
                    className={`
                      w-full p-4 text-left hover:bg-gray-50 transition-colors
                      ${highlightedIndex === index ? 'bg-blue-50' : ''}
                    `}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-900">{medication.name}</h4>
                          {medication.requiresPrescription && (
                            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">
                              Rx
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600">
                          {medication.genericName} • {medication.form} • {medication.strength}
                        </p>
                        
                        <p className="text-xs text-gray-500 mt-1">
                          {medication.category}
                        </p>

                        {medication.brandNames && medication.brandNames.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Brands: {medication.brandNames.join(', ')}
                          </p>
                        )}

                        {medication.warnings && medication.warnings.length > 0 && (
                          <div className="flex items-center space-x-1 mt-2">
                            <AlertTriangle className="h-3 w-3 text-yellow-500" />
                            <p className="text-xs text-yellow-700">
                              {medication.warnings[0]}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="text-right ml-4">
                        <p className={`text-xs font-medium ${getStockLevelColor(medication.stockLevel)}`}>
                          Stock: {medication.stockLevel}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              {filteredMedications.length} medication{filteredMedications.length !== 1 ? 's' : ''} available
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationSelector;
