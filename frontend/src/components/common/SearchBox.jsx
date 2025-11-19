import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp } from 'lucide-react';

const SearchBox = ({
  value = '',
  onChange,
  onSearch,
  placeholder = 'Search...',
  suggestions = [],
  recentSearches = [],
  showSuggestions = true,
  showRecentSearches = true,
  loading = false,
  debounceMs = 300,
  className = '',
  size = 'md',
  variant = 'default'
}) => {
  const [inputValue, setInputValue] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Debounce input value
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [inputValue, debounceMs]);

  // Call onChange when debounced value changes
  useEffect(() => {
    if (onChange && debouncedValue !== value) {
      onChange(debouncedValue);
    }
  }, [debouncedValue, onChange, value]);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current?.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  };

  const variantClasses = {
    default: 'border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent',
    filled: 'bg-gray-100 border border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500',
    minimal: 'border-0 border-b-2 border-gray-300 rounded-none focus:border-blue-500 focus:ring-0'
  };

  const filteredSuggestions = suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(inputValue.toLowerCase()) && 
    suggestion.toLowerCase() !== inputValue.toLowerCase()
  );

  const displayedRecentSearches = recentSearches.filter(search =>
    !inputValue || search.toLowerCase().includes(inputValue.toLowerCase())
  );

  const allOptions = [
    ...filteredSuggestions.map(s => ({ type: 'suggestion', value: s })),
    ...(showRecentSearches ? displayedRecentSearches.map(s => ({ type: 'recent', value: s })) : [])
  ];

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setShowDropdown(true);
    setHighlightedIndex(-1);
  };

  const handleInputFocus = () => {
    setShowDropdown(true);
  };

  const handleSearch = (searchTerm = inputValue) => {
    if (onSearch) {
      onSearch(searchTerm);
    }
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < allOptions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && allOptions[highlightedIndex]) {
          handleSearch(allOptions[highlightedIndex].value);
          setInputValue(allOptions[highlightedIndex].value);
        } else {
          handleSearch();
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setHighlightedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClear = () => {
    setInputValue('');
    setDebouncedValue('');
    if (onChange) {
      onChange('');
    }
    inputRef.current?.focus();
  };

  const handleOptionClick = (option) => {
    setInputValue(option.value);
    handleSearch(option.value);
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-10 rounded-lg transition-all duration-200
            ${sizeClasses[size]}
            ${variantClasses[variant]}
            ${className}
          `}
        />

        {inputValue && (
          <button
            onClick={handleClear}
            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {showDropdown && (showSuggestions || showRecentSearches) && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
        >
          {allOptions.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              {inputValue ? 'No suggestions found' : 'Start typing to search...'}
            </div>
          ) : (
            <div className="py-1">
              {filteredSuggestions.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Suggestions
                  </div>
                  {filteredSuggestions.map((suggestion, index) => (
                    <button
                      key={`suggestion-${index}`}
                      onClick={() => handleOptionClick({ value: suggestion })}
                      className={`
                        w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2
                        ${highlightedIndex === allOptions.findIndex(o => o.value === suggestion) ? 'bg-gray-100' : ''}
                      `}
                    >
                      <TrendingUp className="h-4 w-4 text-gray-400" />
                      <span>{suggestion}</span>
                    </button>
                  ))}
                </>
              )}

              {showRecentSearches && displayedRecentSearches.length > 0 && (
                <>
                  {filteredSuggestions.length > 0 && <div className="border-t border-gray-100" />}
                  <div className="px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                    Recent Searches
                  </div>
                  {displayedRecentSearches.map((search, index) => (
                    <button
                      key={`recent-${index}`}
                      onClick={() => handleOptionClick({ value: search })}
                      className={`
                        w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center space-x-2
                        ${highlightedIndex === allOptions.findIndex(o => o.value === search) ? 'bg-gray-100' : ''}
                      `}
                    >
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span>{search}</span>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
