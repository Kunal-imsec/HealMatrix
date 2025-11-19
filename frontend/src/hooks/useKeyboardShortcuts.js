import { useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useNotification from './useNotification';

export const useKeyboardShortcuts = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { showInfo } = useNotification();

  const handleKeyPress = useCallback((event) => {
    // Ignore if user is typing in an input field
    const isInputField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName) ||
                        event.target.contentEditable === 'true';
    
    if (isInputField && !event.ctrlKey && !event.altKey) {
      return;
    }

    // Authentication required shortcuts
    if (!isAuthenticated()) {
      return;
    }

    // Logout shortcuts
    if (event.ctrlKey && event.shiftKey && event.key === 'L') {
      event.preventDefault();
      logout(true);
      showInfo('Logged out successfully');
      return;
    }

    if (event.altKey && event.key === 'l') {
      event.preventDefault();
      logout(false);
      return;
    }

    // Navigation shortcuts
    if (event.ctrlKey && event.shiftKey) {
      event.preventDefault();
      
      switch (event.key) {
        case 'D':
          navigate('/dashboard');
          showInfo('Navigated to Dashboard');
          break;
        case 'P':
          navigate('/patients');
          showInfo('Navigated to Patients');
          break;
        case 'A':
          navigate('/appointments');
          showInfo('Navigated to Appointments');
          break;
        case 'B':
          navigate('/billing');
          showInfo('Navigated to Billing');
          break;
        case 'S':
          navigate('/settings');
          showInfo('Navigated to Settings');
          break;
        case 'R':
          navigate('/reports');
          showInfo('Navigated to Reports');
          break;
        default:
          break;
      }
    }

    // Quick actions with Alt key
    if (event.altKey) {
      switch (event.key) {
        case 'n':
          event.preventDefault();
          // Trigger new appointment modal or navigate to create appointment
          showInfo('Quick: New Appointment');
          break;
        case 'p':
          event.preventDefault();
          // Trigger new patient modal
          showInfo('Quick: New Patient');
          break;
        case 's':
          event.preventDefault();
          // Quick search
          showInfo('Quick: Search');
          break;
        case '?':
          event.preventDefault();
          // Show help/shortcuts modal
          showInfo('Keyboard shortcuts help');
          break;
        default:
          break;
      }
    }

    // Function keys
    switch (event.key) {
      case 'F1':
        event.preventDefault();
        showInfo('Help: F1');
        break;
      case 'F2':
        event.preventDefault();
        // Quick edit mode
        showInfo('Quick Edit Mode');
        break;
      case 'F3':
        event.preventDefault();
        // Search
        showInfo('Search');
        break;
      case 'Escape':
        // Close modals or cancel operations
        const modals = document.querySelectorAll('[role="dialog"]');
        if (modals.length > 0) {
          // Trigger close on the topmost modal
          const closeButton = modals[modals.length - 1].querySelector('[aria-label="Close"]');
          if (closeButton) closeButton.click();
        }
        break;
      default:
        break;
    }
  }, [logout, isAuthenticated, navigate, showInfo]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  // Return available shortcuts for help display
  const shortcuts = {
    navigation: {
      'Ctrl+Shift+D': 'Go to Dashboard',
      'Ctrl+Shift+P': 'Go to Patients',
      'Ctrl+Shift+A': 'Go to Appointments',
      'Ctrl+Shift+B': 'Go to Billing',
      'Ctrl+Shift+S': 'Go to Settings',
      'Ctrl+Shift+R': 'Go to Reports'
    },
    actions: {
      'Alt+N': 'New Appointment',
      'Alt+P': 'New Patient',
      'Alt+S': 'Quick Search',
      'Alt+?': 'Show Help'
    },
    system: {
      'Ctrl+Shift+L': 'Logout (with confirmation)',
      'Alt+L': 'Quick Logout',
      'F1': 'Help',
      'F2': 'Quick Edit',
      'F3': 'Search',
      'Escape': 'Close Modal/Cancel'
    }
  };

  return { shortcuts };
};

// Hook for specific shortcut registration
export const useShortcut = (keys, callback, options = {}) => {
  const { preventDefault = true, stopPropagation = false } = options;

  useEffect(() => {
    const handleKeyPress = (event) => {
      const keyString = [
        event.ctrlKey && 'ctrl',
        event.altKey && 'alt', 
        event.shiftKey && 'shift',
        event.key.toLowerCase()
      ].filter(Boolean).join('+');

      if (keyString === keys.toLowerCase()) {
        if (preventDefault) event.preventDefault();
        if (stopPropagation) event.stopPropagation();
        callback(event);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [keys, callback, preventDefault, stopPropagation]);
};

export default useKeyboardShortcuts;
