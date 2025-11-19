import React, { useState } from 'react';
import { Bell, X, CheckCircle, AlertCircle, Info, AlertTriangle, Clock, Settings } from 'lucide-react';

const NotificationPanel = ({
  notifications = [],
  loading = false,
  onMarkAsRead = null,
  onMarkAllAsRead = null,
  onClearAll = null,
  onNotificationClick = null,
  maxItems = 5,
  showSettings = true,
  className = ''
}) => {
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'important'

  const getNotificationIcon = (type, priority) => {
    if (priority === 'high') {
      return AlertTriangle;
    }
    
    const iconMap = {
      success: CheckCircle,
      error: AlertCircle,
      warning: AlertTriangle,
      info: Info,
      appointment: Clock,
      system: Settings,
      default: Bell
    };
    
    return iconMap[type] || iconMap.default;
  };

  const getNotificationColor = (type, priority) => {
    if (priority === 'high') {
      return 'text-red-600 bg-red-100';
    }
    
    const colorMap = {
      success: 'text-green-600 bg-green-100',
      error: 'text-red-600 bg-red-100',
      warning: 'text-yellow-600 bg-yellow-100',
      info: 'text-blue-600 bg-blue-100',
      appointment: 'text-purple-600 bg-purple-100',
      system: 'text-gray-600 bg-gray-100',
      default: 'text-blue-600 bg-blue-100'
    };
    
    return colorMap[type] || colorMap.default;
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / 60000);
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'unread':
        return !notification.read;
      case 'important':
        return notification.priority === 'high';
      default:
        return true;
    }
  });

  const displayedNotifications = filteredNotifications.slice(0, maxItems);
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (notificationId) => {
    if (onMarkAsRead) {
      onMarkAsRead(notificationId);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }
    
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
  };

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
              <div key={i} className="animate-pulse flex space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
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
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && onMarkAllAsRead && (
              <button
                onClick={onMarkAllAsRead}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Mark all read
              </button>
            )}
            
            {showSettings && (
              <button className="p-1 text-gray-400 hover:text-gray-600 rounded">
                <Settings className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-1">
          {['all', 'unread', 'important'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`
                px-3 py-1 text-xs font-medium rounded-full capitalize transition-colors
                ${filter === filterOption
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }
              `}
            >
              {filterOption}
              {filterOption === 'unread' && unreadCount > 0 && (
                <span className="ml-1">({unreadCount})</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {displayedNotifications.length === 0 ? (
          <div className="p-6 text-center">
            <div className="text-gray-400 mb-4">
              <Bell className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No notifications' : `No ${filter} notifications`}
            </h3>
            <p className="text-sm text-gray-600">
              {filter === 'all' 
                ? 'You\'re all caught up! New notifications will appear here.'
                : `You have no ${filter} notifications at the moment.`
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {displayedNotifications.map((notification, index) => {
              const IconComponent = getNotificationIcon(notification.type, notification.priority);
              const colorClasses = getNotificationColor(notification.type, notification.priority);
              
              return (
                <div
                  key={notification.id || index}
                  onClick={() => handleNotificationClick(notification)}
                  className={`
                    p-4 hover:bg-gray-50 cursor-pointer transition-colors
                    ${!notification.read ? 'bg-blue-50 border-l-4 border-blue-500' : ''}
                  `}
                >
                  <div className="flex space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${colorClasses}`}>
                      <IconComponent className="h-4 w-4" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          <p className="text-sm text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          
                          {notification.actionText && (
                            <button className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2">
                              {notification.actionText}
                            </button>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2 ml-4">
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            {formatTime(notification.timestamp)}
                          </span>
                          
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleMarkAsRead(notification.id);
                      }}
                      className="flex-shrink-0 text-gray-400 hover:text-gray-600 p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > maxItems && (
        <div className="p-4 border-t border-gray-200 text-center">
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            View all {notifications.length} notifications
          </button>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
