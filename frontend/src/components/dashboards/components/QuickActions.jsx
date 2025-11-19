import React from 'react';
import { Plus, Calendar, Users, FileText, CreditCard, Pill, UserPlus } from 'lucide-react';

const QuickActions = ({
  actions = [],
  title = 'Quick Actions',
  layout = 'grid', // 'grid', 'list'
  size = 'md', // 'sm', 'md', 'lg'
  className = ''
}) => {
  const sizeClasses = {
    sm: {
      button: 'p-3',
      icon: 'h-4 w-4',
      text: 'text-xs'
    },
    md: {
      button: 'p-4',
      icon: 'h-5 w-5',
      text: 'text-sm'
    },
    lg: {
      button: 'p-6',
      icon: 'h-6 w-6',
      text: 'text-base'
    }
  };

  const currentSizeClasses = sizeClasses[size];

  const defaultActions = [
    {
      id: 'add-patient',
      label: 'Add Patient',
      icon: UserPlus,
      color: 'blue',
      onClick: () => console.log('Add Patient'),
      roles: ['ADMIN', 'RECEPTIONIST']
    },
    {
      id: 'schedule-appointment',
      label: 'Schedule Appointment',
      icon: Calendar,
      color: 'green',
      onClick: () => console.log('Schedule Appointment'),
      roles: ['ADMIN', 'DOCTOR', 'RECEPTIONIST']
    },
    {
      id: 'create-prescription',
      label: 'New Prescription',
      icon: Pill,
      color: 'purple',
      onClick: () => console.log('Create Prescription'),
      roles: ['DOCTOR']
    },
    {
      id: 'create-bill',
      label: 'Create Bill',
      icon: CreditCard,
      color: 'yellow',
      onClick: () => console.log('Create Bill'),
      roles: ['ADMIN', 'RECEPTIONIST']
    },
    {
      id: 'view-reports',
      label: 'View Reports',
      icon: FileText,
      color: 'indigo',
      onClick: () => console.log('View Reports'),
      roles: ['ADMIN', 'DOCTOR']
    }
  ];

  const displayActions = actions.length > 0 ? actions : defaultActions;

  const getColorClasses = (color) => {
    const colorMap = {
      blue: 'text-blue-600 bg-blue-50 hover:bg-blue-100 border-blue-200',
      green: 'text-green-600 bg-green-50 hover:bg-green-100 border-green-200',
      purple: 'text-purple-600 bg-purple-50 hover:bg-purple-100 border-purple-200',
      yellow: 'text-yellow-600 bg-yellow-50 hover:bg-yellow-100 border-yellow-200',
      red: 'text-red-600 bg-red-50 hover:bg-red-100 border-red-200',
      indigo: 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border-indigo-200',
      gray: 'text-gray-600 bg-gray-50 hover:bg-gray-100 border-gray-200'
    };
    return colorMap[color] || colorMap.gray;
  };

  if (layout === 'list') {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            {displayActions.map((action, index) => {
              const IconComponent = action.icon;
              const colorClasses = getColorClasses(action.color);
              
              return (
                <button
                  key={action.id || index}
                  onClick={action.onClick}
                  disabled={action.disabled}
                  className={`
                    w-full flex items-center space-x-3 ${currentSizeClasses.button} rounded-lg border
                    transition-all duration-200 ${colorClasses}
                    ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  `}
                >
                  <IconComponent className={currentSizeClasses.icon} />
                  <span className={`font-medium ${currentSizeClasses.text}`}>
                    {action.label}
                  </span>
                  
                  {action.badge && (
                    <span className="ml-auto bg-white px-2 py-1 rounded-full text-xs font-medium">
                      {action.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      <div className="p-6">
        <div className={`grid ${
          size === 'sm' ? 'grid-cols-3' : 
          size === 'md' ? 'grid-cols-2' : 
          'grid-cols-1'
        } gap-4`}>
          {displayActions.map((action, index) => {
            const IconComponent = action.icon;
            const colorClasses = getColorClasses(action.color);
            
            return (
              <button
                key={action.id || index}
                onClick={action.onClick}
                disabled={action.disabled}
                className={`
                  relative flex flex-col items-center justify-center ${currentSizeClasses.button}
                  rounded-lg border transition-all duration-200 ${colorClasses}
                  ${action.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <IconComponent className={`${currentSizeClasses.icon} mb-2`} />
                <span className={`font-medium ${currentSizeClasses.text} text-center`}>
                  {action.label}
                </span>
                
                {action.badge && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {action.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;
