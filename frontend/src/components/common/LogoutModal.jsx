import React from 'react';
import Button from './Button';

const LogoutModal = ({ isOpen, onClose, onConfirm, userName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center mb-4">
          <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">Sign Out</h3>
            <p className="text-sm text-gray-500">Are you sure you want to sign out?</p>
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Signed in as:</span> {userName}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={onConfirm}
            className="flex-1"
          >
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
