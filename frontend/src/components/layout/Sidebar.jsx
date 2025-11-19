import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Stethoscope, 
  X,
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  ClipboardList,
  FileText,
  Activity,
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose, isCollapsed, onToggleCollapse }) => {
  const { user, logout } = useAuth();

  const menuItemsByRole = {
    ADMIN: [
      { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Patients', path: '/patients', icon: UserCheck },
      { name: 'Doctors', path: '/doctors', icon: Stethoscope },
      { name: 'Staff', path: '/staff', icon: Users },
      { name: 'Appointments', path: '/appointments', icon: Calendar },
      { name: 'Reports', path: '/reports', icon: ClipboardList },
    ],
    DOCTOR: [
      { name: 'Dashboard', path: '/doctor/dashboard', icon: LayoutDashboard },
      { name: 'My Patients', path: '/patients', icon: UserCheck },
      { name: 'Appointments', path: '/appointments', icon: Calendar },
      { name: 'Prescriptions', path: '/prescriptions', icon: FileText },
    ],
    PATIENT: [
      { name: 'Dashboard', path: '/patient/dashboard', icon: LayoutDashboard },
      { name: 'Appointments', path: '/appointments', icon: Calendar },
      { name: 'Medical Records', path: '/medical-records', icon: ClipboardList },
    ]
  };

  const menuItems = menuItemsByRole[user?.role] || menuItemsByRole.PATIENT;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 z-50 h-full bg-white shadow-lg
        transform transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
        ${isCollapsed ? 'w-20' : 'w-64'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100">
            {!isCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
                  <Stethoscope className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">HMS</span>
              </div>
            )}

            {isCollapsed && (
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center mx-auto">
                <Stethoscope className="w-6 h-6 text-white" />
              </div>
            )}

            {!isCollapsed && (
              <button
                onClick={onToggleCollapse}
                className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hidden lg:block"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}

            <button onClick={onClose} className="p-2 lg:hidden">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-2">
            {!isCollapsed ? (
              <div className="space-y-1">
                {menuItems.map((item, index) => (
                  <NavLink
                    key={index}
                    to={item.path}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                      ${isActive
                        ? 'bg-gradient-to-r from-green-400 to-green-500 text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-50'
                      }`
                    }
                  >
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {menuItems.map((item, index) => (
                  <NavLink
                    key={index}
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center justify-center p-3 rounded-xl transition-all
                      ${isActive
                        ? 'bg-gradient-to-r from-green-400 to-green-500 text-white'
                        : 'text-gray-600 hover:bg-gray-100'
                      }`
                    }
                    title={item.name}
                  >
                    <item.icon className="w-5 h-5" />
                  </NavLink>
                ))}
              </div>
            )}
          </nav>

          {/* Footer Section */}
          <div className="border-t border-gray-100">
            {!isCollapsed ? (
              <div className="p-4 space-y-2">
                <button
                  onClick={() => window.location.href = '/settings'}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  <Settings className="w-5 h-5" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={logout}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
                <div className="pt-4 text-center border-t border-gray-100">
                  <p className="text-xs text-gray-500">© 2025 HMS</p>
                  <p className="text-xs text-gray-400">Version 1.0.0</p>
                </div>
              </div>
            ) : (
              <div className="p-2">
                <button
                  onClick={onToggleCollapse}
                  className="w-full p-3 rounded-xl text-gray-600 hover:bg-gray-100 flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
