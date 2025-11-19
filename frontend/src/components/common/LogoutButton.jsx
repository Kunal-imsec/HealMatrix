import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ className = "", variant = "primary" }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Force navigation even if logout fails
      navigate('/login', { replace: true });
    }
  };

  const baseClasses = "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2";
  const variantClasses = {
    primary: "bg-red-600 hover:bg-red-700 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
    outline: "border border-red-600 text-red-600 hover:bg-red-50"
  };

  return (
    <button 
      onClick={handleLogout}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
      </svg>
      <span>Logout</span>
    </button>
  );
};

export default LogoutButton;
