import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

const SessionTimeout = ({ timeoutMinutes = 30 }) => {
  const { isAuthenticated, logout, user } = useAuth();
  const [showWarning, setShowWarning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(timeoutMinutes * 60);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const resetTimer = useCallback(() => {
    setLastActivity(Date.now());
    setRemainingTime(timeoutMinutes * 60);
    setShowWarning(false);
  }, [timeoutMinutes]);

  const handleActivity = useCallback(() => {
    resetTimer();
  }, [resetTimer]);

  const handleLogout = useCallback(async () => {
    await logout(true);
  }, [logout]);

  const extendSession = () => {
    resetTimer();
  };

  useEffect(() => {
    if (!isAuthenticated()) return;

    // Activity listeners
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [handleActivity, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated()) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = Math.floor((now - lastActivity) / 1000);
      const newRemainingTime = Math.max(0, (timeoutMinutes * 60) - timeSinceLastActivity);
      
      setRemainingTime(newRemainingTime);

      // Show warning at 5 minutes remaining
      if (newRemainingTime <= 300 && !showWarning) {
        setShowWarning(true);
      }

      // Auto logout when time expires
      if (newRemainingTime <= 0) {
        handleLogout();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [lastActivity, timeoutMinutes, showWarning, handleLogout, isAuthenticated]);

  if (!isAuthenticated() || !showWarning) return null;

  const minutes = Math.floor(remainingTime / 60);
  const seconds = remainingTime % 60;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mr-4">
            <svg className="h-6 w-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Session Expiring</h3>
            <p className="text-sm text-gray-500">Your session will expire soon</p>
          </div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4 mb-4">
          <div className="text-center">
            <p className="text-sm text-gray-700 mb-2">Time remaining:</p>
            <p className="text-2xl font-bold text-yellow-600">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </p>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex-1"
          >
            Sign Out Now
          </Button>
          <Button
            variant="primary"
            onClick={extendSession}
            className="flex-1"
          >
            Stay Signed In
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SessionTimeout;
