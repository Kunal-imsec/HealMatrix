import React from 'react';
import { Calendar, User, FileText, Clock, ChevronRight } from 'lucide-react';

const RecentItems = ({
  items = [],
  title = 'Recent Items',
  type = 'general', // 'patients', 'appointments', 'prescriptions', 'bills', 'general'
  loading = false,
  onItemClick = null,
  onViewAll = null,
  maxItems = 5,
  showViewAll = true,
  className = ''
}) => {
  const getItemIcon = (itemType) => {
    const iconMap = {
      patient: User,
      appointment: Calendar,
      prescription: FileText,
      bill: FileText,
      general: FileText
    };
    return iconMap[itemType] || iconMap.general;
  };

  const getItemColor = (itemType, status) => {
    if (status) {
      const statusColors = {
        active: 'text-green-600 bg-green-100',
        pending: 'text-yellow-600 bg-yellow-100',
        completed: 'text-blue-600 bg-blue-100',
        cancelled: 'text-red-600 bg-red-100',
        expired: 'text-gray-600 bg-gray-100'
      };
      return statusColors[status.toLowerCase()] || 'text-gray-600 bg-gray-100';
    }

    const typeColors = {
      patient: 'text-green-600 bg-green-100',
      appointment: 'text-blue-600 bg-blue-100',
      prescription: 'text-purple-600 bg-purple-100',
      bill: 'text-yellow-600 bg-yellow-100',
      general: 'text-gray-600 bg-gray-100'
    };
    return typeColors[itemType] || typeColors.general;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    
    return date.toLocaleDateString();
  };

  const displayedItems = items.slice(0, maxItems);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
        <div className="p-6 border-b border-gray-200">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-4 w-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        
        {showViewAll && items.length > maxItems && onViewAll && (
          <button
            onClick={onViewAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </button>
        )}
      </div>

      {/* Items List */}
      <div className="p-6">
        {displayedItems.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Clock className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent items</h3>
            <p className="text-sm text-gray-600">
              Recent {type === 'general' ? 'items' : type} will appear here when available.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedItems.map((item, index) => {
              const IconComponent = getItemIcon(item.type || type);
              const colorClasses = getItemColor(item.type || type, item.status);
              
              return (
                <div
                  key={item.id || index}
                  onClick={() => onItemClick && onItemClick(item)}
                  className={`
                    flex items-center space-x-3 p-3 rounded-lg transition-colors
                    ${onItemClick ? 'hover:bg-gray-50 cursor-pointer' : ''}
                  `}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${colorClasses}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.title || item.name}
                        </p>
                        
                        {item.subtitle && (
                          <p className="text-sm text-gray-600 truncate">
                            {item.subtitle}
                          </p>
                        )}
                        
                        <div className="flex items-center space-x-4 mt-1">
                          {item.date && (
                            <span className="text-xs text-gray-500">
                              {formatDate(item.date)}
                            </span>
                          )}
                          
                          {item.status && (
                            <span className={`
                              px-2 py-1 text-xs font-medium rounded-full capitalize
                              ${item.status === 'active' ? 'bg-green-100 text-green-800' :
                                item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                item.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                item.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }
                            `}>
                              {item.status}
                            </span>
                          )}
                          
                          {item.priority && item.priority === 'high' && (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                              High Priority
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {item.value && (
                        <div className="flex-shrink-0 ml-4 text-right">
                          <p className="text-sm font-medium text-gray-900">
                            {item.value}
                          </p>
                          {item.valueSubtitle && (
                            <p className="text-xs text-gray-500">
                              {item.valueSubtitle}
                            </p>
                          )}
                        </div>
                      )}
                      
                      {onItemClick && (
                        <ChevronRight className="flex-shrink-0 h-4 w-4 text-gray-400 ml-2" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {items.length > maxItems && !showViewAll && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Showing {maxItems} of {items.length} items
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentItems;
