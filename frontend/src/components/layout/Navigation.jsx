import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Calendar,
  CreditCard,
  FileText,
  Building2,
  Pill,
  ClipboardList,
  UserPlus,
  Settings,
  BarChart3,
  Shield,
  Package,
  Activity,
  Bell,
  HelpCircle,
  AlertTriangle  // ✅ ADDED: Missing import
} from 'lucide-react';


const Navigation = ({ isCollapsed, onItemClick }) => {
  const { user } = useAuth();
  const location = useLocation();


  // Define navigation items based on user roles
  const getNavigationItems = () => {
    const baseItems = [
      {
        name: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        roles: ['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT', 'RECEPTIONIST', 'PHARMACIST']
      }
    ];


    const roleBasedItems = {
      ADMIN: [
        {
          name: 'Users',
          href: '/users',
          icon: Shield,
          badge: 'Admin'
        },
        {
          name: 'Patients',
          href: '/patients',
          icon: Users
        },
        {
          name: 'Doctors',
          href: '/doctors',
          icon: UserCheck
        },
        {
          name: 'Staff',
          href: '/staff',
          icon: UserPlus
        },
        {
          name: 'Appointments',
          href: '/appointments',
          icon: Calendar
        },
        {
          name: 'Departments',
          href: '/departments',
          icon: Building2
        },
        {
          name: 'Billing',
          href: '/billing',
          icon: CreditCard
        },
        {
          name: 'Prescriptions',
          href: '/prescriptions',
          icon: Pill
        },
        {
          name: 'Inventory',
          href: '/inventory',
          icon: Package
        },
        {
          name: 'Reports',
          href: '/reports',
          icon: BarChart3
        },
        {
          name: 'Settings',
          href: '/settings',
          icon: Settings
        }
      ],
      DOCTOR: [
        {
          name: 'My Patients',
          href: '/patients',
          icon: Users
        },
        {
          name: 'Appointments',
          href: '/appointments',
          icon: Calendar,
          badge: '5' // Dynamic badge
        },
        {
          name: 'Schedule',
          href: '/schedule',
          icon: ClipboardList
        },
        {
          name: 'Prescriptions',
          href: '/prescriptions',
          icon: Pill
        },
        {
          name: 'Medical Records',
          href: '/medical-records',
          icon: FileText
        }
      ],
      NURSE: [
        {
          name: 'Patients',
          href: '/patients',
          icon: Users
        },
        {
          name: 'Tasks',
          href: '/tasks',
          icon: ClipboardList,
          badge: '3'
        },
        {
          name: 'Ward Management',
          href: '/wards',
          icon: Building2
        },
        {
          name: 'Vital Signs',
          href: '/vitals',
          icon: Activity
        },
        {
          name: 'Medications',
          href: '/medications',
          icon: Pill
        }
      ],
      PATIENT: [
        {
          name: 'My Profile',
          href: '/profile',
          icon: Users
        },
        {
          name: 'Appointments',
          href: '/appointments',
          icon: Calendar
        },
        {
          name: 'Medical History',
          href: '/medical-history',
          icon: FileText
        },
        {
          name: 'Prescriptions',
          href: '/prescriptions',
          icon: Pill
        },
        {
          name: 'Bills',
          href: '/billing',
          icon: CreditCard
        },
        {
          name: 'Test Results',
          href: '/test-results',
          icon: ClipboardList
        }
      ],
      RECEPTIONIST: [
        {
          name: 'Patient Registration',
          href: '/patients/register',
          icon: UserPlus
        },
        {
          name: 'Appointments',
          href: '/appointments',
          icon: Calendar,
          badge: 'New'
        },
        {
          name: 'Patients',
          href: '/patients',
          icon: Users
        },
        {
          name: 'Billing',
          href: '/billing',
          icon: CreditCard
        },
        {
          name: 'Reports',
          href: '/reports',
          icon: BarChart3
        }
      ],
      PHARMACIST: [
        {
          name: 'Prescription Queue',
          href: '/prescriptions',
          icon: Pill,
          badge: '8'
        },
        {
          name: 'Inventory',
          href: '/inventory',
          icon: Package
        },
        {
          name: 'Drug Interactions',
          href: '/drug-interactions',
          icon: AlertTriangle  // ✅ Now properly imported
        },
        {
          name: 'Reports',
          href: '/reports',
          icon: BarChart3
        }
      ]
    };


    const userItems = roleBasedItems[user?.role] || [];
    return [...baseItems, ...userItems];
  };


  const navigationItems = getNavigationItems();


  // Common items for all roles
  const commonItems = [
    {
      name: 'Notifications',
      href: '/notifications',
      icon: Bell,
      roles: ['ADMIN', 'DOCTOR', 'NURSE', 'RECEPTIONIST', 'PHARMACIST']  // ✅ Added PHARMACIST
    },
    {
      name: 'Help',
      href: '/help',
      icon: HelpCircle,
      roles: ['ADMIN', 'DOCTOR', 'NURSE', 'PATIENT', 'RECEPTIONIST', 'PHARMACIST']
    }
  ];


  const isActive = (href) => {
    if (href === '/dashboard') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };


  const NavItem = ({ item }) => {
    const Icon = item.icon;
    const active = isActive(item.href);


    return (
      <NavLink
        to={item.href}
        onClick={onItemClick}
        className={`
          group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200
          ${isCollapsed ? 'mx-2 justify-center' : 'mx-2'}
          ${active
            ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-700'
            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }
        `}
      >
        <Icon className={`flex-shrink-0 h-5 w-5 ${active ? 'text-blue-700' : 'text-gray-400 group-hover:text-gray-500'}`} />
        
        {!isCollapsed && (
          <>
            <span className="ml-3 truncate">{item.name}</span>
            {item.badge && (
              <span className={`
                ml-auto inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                ${active 
                  ? 'bg-blue-200 text-blue-800' 
                  : 'bg-gray-200 text-gray-800 group-hover:bg-gray-300'
                }
              `}>
                {item.badge}
              </span>
            )}
          </>
        )}


        {/* Tooltip for collapsed sidebar */}
        {isCollapsed && (
          <div className="absolute left-16 bg-gray-900 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 whitespace-nowrap">
            {item.name}
            {item.badge && (
              <span className="ml-2 bg-blue-600 text-white px-1 rounded text-xs">
                {item.badge}
              </span>
            )}
          </div>
        )}
      </NavLink>
    );
  };


  return (
    <div className="space-y-1">
      {/* Main Navigation */}
      <div className={`${!isCollapsed ? 'px-2' : ''}`}>
        {!isCollapsed && (
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Main Menu
          </h3>
        )}
        
        {navigationItems.map((item, index) => (
          <NavItem key={index} item={item} />
        ))}
      </div>


      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>


      {/* Common Items */}
      <div className={`${!isCollapsed ? 'px-2' : ''}`}>
        {!isCollapsed && (
          <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            General
          </h3>
        )}
        
        {commonItems
          .filter(item => item.roles.includes(user?.role))
          .map((item, index) => (
            <NavItem key={`common-${index}`} item={item} />
          ))}
      </div>


      {/* Quick Actions for collapsed sidebar */}
      {isCollapsed && (
        <div className="border-t border-gray-200 mt-4 pt-4">
          <div className="px-2">
            <button className="w-full flex justify-center items-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
              <Settings className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};


export default Navigation;
