import React, { useState, useEffect, useRef } from 'react';
import { patientService } from '../../services/patientService';
import { Search, User, Phone, Mail, Calendar, MapPin, X } from 'lucide-react';

const PatientSearch = ({ 
  onPatientSelect, 
  placeholder = "Search patients by name, ID, phone, or email...",
  showRecentSearches = true,
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const debounceRef = useRef(null);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentPatientSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading recent searches:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Debounced search
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (searchTerm.trim().length >= 2) {
      debounceRef.current = setTimeout(() => {
        performSearch(searchTerm);
      }, 300);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !searchRef.current?.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const performSearch = async (term) => {
    setLoading(true);
    try {
      const results = await patientService.searchPatients(term);
      setSearchResults(results);
      setShowDropdown(true);
      setHighlightedIndex(-1);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    
    if (value.trim().length === 0) {
      setShowDropdown(false);
      setSearchResults([]);
    }
  };

  const handleInputFocus = () => {
    if (searchTerm.trim().length >= 2) {
      setShowDropdown(true);
    } else if (showRecentSearches && recentSearches.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    const totalOptions = searchResults.length + (showRecentSearches ? recentSearches.length : 0);

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => (prev < totalOptions - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          if (highlightedIndex < searchResults.length) {
            handlePatientSelect(searchResults[highlightedIndex]);
          } else if (showRecentSearches) {
            const recentIndex = highlightedIndex - searchResults.length;
            handleRecentSearchSelect(recentSearches[recentIndex]);
          }
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setHighlightedIndex(-1);
        searchRef.current?.blur();
        break;
    }
  };

  const handlePatientSelect = (patient) => {
    // Save to recent searches
    saveToRecentSearches(patient);
    
    // Clear search
    setSearchTerm('');
    setShowDropdown(false);
    setHighlightedIndex(-1);
    
    // Notify parent component
    if (onPatientSelect) {
      onPatientSelect(patient);
    }
  };

  const handleRecentSearchSelect = (patient) => {
    handlePatientSelect(patient);
  };

  const saveToRecentSearches = (patient) => {
    const updated = [
      patient,
      ...recentSearches.filter(p => p.id !== patient.id)
    ].slice(0, 5); // Keep only 5 recent searches

    setRecentSearches(updated);
    localStorage.setItem('recentPatientSearches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentPatientSearches');
  };

  const formatPatientInfo = (patient) => {
    const age = patient.dateOfBirth 
      ? Math.floor((new Date() - new Date(patient.dateOfBirth)) / (365.25 * 24 * 60 * 60 * 1000))
      : null;
    
    return {
      fullName: `${patient.firstName} ${patient.lastName}`,
      age: age ? `${age} years` : 'N/A',
      phone: patient.phoneNumber || 'N/A',
      email: patient.email || 'N/A',
      address: patient.address || 'N/A'
    };
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
        
        <input
          ref={searchRef}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />

        {searchTerm && (
          <button
            onClick={() => {
              setSearchTerm('');
              setShowDropdown(false);
              setSearchResults([]);
            }}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto"
        >
          {/* Search Results */}
          {searchResults.length > 0 && (
            <div>
              <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 border-b">
                Search Results ({searchResults.length})
              </div>
              {searchResults.map((patient, index) => {
                const info = formatPatientInfo(patient);
                return (
                  <button
                    key={patient.id}
                    onClick={() => handlePatientSelect(patient)}
                    className={`
                      w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0
                      ${highlightedIndex === index ? 'bg-blue-50' : ''}
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-5 w-5 text-blue-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {info.fullName}
                          </p>
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            ID: {patient.patientId}
                          </span>
                        </div>
                        
                        <div className="mt-1 grid grid-cols-2 gap-2 text-xs text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>{info.age}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Phone className="h-3 w-3" />
                            <span className="truncate">{info.phone}</span>
                          </div>
                        </div>
                        
                        <div className="mt-1 text-xs text-gray-500 flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{info.email}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Recent Searches */}
          {showRecentSearches && recentSearches.length > 0 && searchTerm.trim().length < 2 && (
            <div>
              <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b">
                <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Recent Searches
                </span>
                <button
                  onClick={clearRecentSearches}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Clear
                </button>
              </div>
              
              {recentSearches.map((patient, index) => {
                const info = formatPatientInfo(patient);
                const adjustedIndex = searchResults.length + index;
                
                return (
                  <button
                    key={`recent-${patient.id}`}
                    onClick={() => handleRecentSearchSelect(patient)}
                    className={`
                      w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0
                      ${highlightedIndex === adjustedIndex ? 'bg-blue-50' : ''}
                    `}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {info.fullName}
                        </p>
                        <p className="text-xs text-gray-500">
                          ID: {patient.patientId} • {info.phone}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* No Results */}
          {searchTerm.trim().length >= 2 && searchResults.length === 0 && !loading && (
            <div className="px-4 py-8 text-center">
              <User className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No patients found</p>
              <p className="text-xs text-gray-400 mt-1">
                Try searching with a different term
              </p>
            </div>
          )}

          {/* Empty State */}
          {searchTerm.trim().length < 2 && recentSearches.length === 0 && (
            <div className="px-4 py-6 text-center">
              <Search className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Start typing to search patients</p>
              <p className="text-xs text-gray-400 mt-1">
                Search by name, patient ID, phone, or email
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientSearch;
