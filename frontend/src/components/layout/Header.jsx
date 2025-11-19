import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Search, 
  Settings, 
  User, 
  LogOut, 
  ChevronDown,
  Menu
} from 'lucide-react';

const Header = ({ onMenuToggle, isSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left: Mobile Menu + Search */}
        <div className="flex items-center space-x-4 flex-1">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Search Bar */}
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search patients, doctors, appointments..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Right: Notifications + Settings + Profile */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Settings */}
          <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg">
            <Settings className="w-5 h-5" />
          </button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 pl-3 pr-2 py-2 hover:bg-gray-100 rounded-xl transition-all"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </span>
              </div>
              <div className="text-left hidden md:block">
                <p className="text-sm font-semibold text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.role === 'ADMIN' ? 'Administrator' : user?.role}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg ring-1 ring-black ring-opacity-5 py-1">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                </div>
                
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <User className="w-4 h-4 mr-3" />
                  Your Profile
                </button>
                
                <button
                  onClick={() => navigate('/settings')}
                  className="flex items-center w-full px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Settings className="w-4 h-4 mr-3" />
                  Settings
                </button>
                
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
