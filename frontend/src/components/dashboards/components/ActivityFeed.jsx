import React from 'react';
import { Clock, User, Calendar, FileText, AlertCircle, CheckCircle, Info } from 'lucide-react';

const ActivityFeed = ({
  activities = [],
  loading = false,
  showAllLink = false,
  onShowAll = null,
  maxItems = 5,
  className = ''
}) => {
  const getActivityIcon = (type) => {
    const iconMap = {
      appointment: Calendar,
      patient: User,
      prescription: FileText,
      billing: FileText,
      alert: AlertCircle,
      success: CheckCircle,
      info: Info,
      default: Info
    };
    return iconMap[type] || iconMap.default;
  };

  const getActivityColor = (type) => {
    const colorMap = {
      appointment: 'text-blue-600 bg-blue-100',
      patient: 'text-green-600 bg-green-100',
      prescription: 'text-purple-600 bg-purple-100',
      billing: 'text-yellow-600 bg-yellow-100',
      alert: 'text-red-600 bg-red-100',
      success: 'text-green-600 bg-green-100',
      info: 'text-blue-600 bg-blue-100',
      default: 'text-gray-600 bg-gray-100'
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

  const displayedActivities = activities.slice(0, maxItems);

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
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Activity
        </h3>
        
        {showAllLink && activities.length > maxItems && (
          <button
            onClick={onShowAll}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </button>
        )}
      </div>

      {/* Activity List */}
      <div className="p-6">
        {displayedActivities.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Clock className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
            <p className="text-sm text-gray-600">
              When you start using the system, your recent activities will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {displayedActivities.map((activity, index) => {
              const IconComponent = getActivityIcon(activity.type);
              const colorClasses = getActivityColor(activity.type);
              
              return (
                <div key={activity.id || index} className="flex space-x-3">
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${colorClasses}`}>
                    <IconComponent className="h-5 w-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {activity.description}
                        </p>
                        
                        {activity.metadata && (
                          <div className="flex items-center space-x-4 mt-2">
                            {activity.metadata.user && (
                              <span className="text-xs text-gray-500">
                                by {activity.metadata.user}
                              </span>
                            )}
                            {activity.metadata.location && (
                              <span className="text-xs text-gray-500">
                                in {activity.metadata.location}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex-shrink-0 ml-4">
                        <span className="text-xs text-gray-500">
                          {formatTime(activity.timestamp)}
                        </span>
                      </div>
                    </div>
                    
                    {activity.actionable && (
                      <div className="mt-3">
                        <button
                          onClick={activity.onClick}
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          {activity.actionText || 'View Details'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activities.length > maxItems && !showAllLink && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 text-center">
              Showing {maxItems} of {activities.length} activities
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;
