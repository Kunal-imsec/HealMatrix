import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

const StatCard = ({
  title = '',
  value = 0,
  previousValue = null,
  icon: Icon = null,
  color = 'blue',
  formatValue = null,
  trend = null, // 'up', 'down', 'neutral'
  trendValue = null,
  subtitle = '',
  loading = false,
  onClick = null,
  className = ''
}) => {
  const colorVariants = {
    blue: {
      icon: 'text-blue-600 bg-blue-100',
      trend: {
        up: 'text-green-600 bg-green-100',
        down: 'text-red-600 bg-red-100',
        neutral: 'text-gray-600 bg-gray-100'
      }
    },
    green: {
      icon: 'text-green-600 bg-green-100',
      trend: {
        up: 'text-green-600 bg-green-100',
        down: 'text-red-600 bg-red-100',
        neutral: 'text-gray-600 bg-gray-100'
      }
    },
    red: {
      icon: 'text-red-600 bg-red-100',
      trend: {
        up: 'text-green-600 bg-green-100',
        down: 'text-red-600 bg-red-100',
        neutral: 'text-gray-600 bg-gray-100'
      }
    },
    yellow: {
      icon: 'text-yellow-600 bg-yellow-100',
      trend: {
        up: 'text-green-600 bg-green-100',
        down: 'text-red-600 bg-red-100',
        neutral: 'text-gray-600 bg-gray-100'
      }
    },
    purple: {
      icon: 'text-purple-600 bg-purple-100',
      trend: {
        up: 'text-green-600 bg-green-100',
        down: 'text-red-600 bg-red-100',
        neutral: 'text-gray-600 bg-gray-100'
      }
    },
    indigo: {
      icon: 'text-indigo-600 bg-indigo-100',
      trend: {
        up: 'text-green-600 bg-green-100',
        down: 'text-red-600 bg-red-100',
        neutral: 'text-gray-600 bg-gray-100'
      }
    }
  };

  const currentColorVariant = colorVariants[color] || colorVariants.blue;

  // Calculate trend if not provided but previous value exists
  const calculatedTrend = React.useMemo(() => {
    if (trend) return trend;
    if (previousValue !== null && previousValue !== undefined) {
      if (value > previousValue) return 'up';
      if (value < previousValue) return 'down';
      return 'neutral';
    }
    return null;
  }, [trend, value, previousValue]);

  // Calculate trend value if not provided
  const calculatedTrendValue = React.useMemo(() => {
    if (trendValue) return trendValue;
    if (previousValue !== null && previousValue !== undefined && previousValue !== 0) {
      const change = ((value - previousValue) / previousValue) * 100;
      return Math.abs(change).toFixed(1);
    }
    return null;
  }, [trendValue, value, previousValue]);

  const getTrendIcon = () => {
    switch (calculatedTrend) {
      case 'up':
        return <TrendingUp className="h-3 w-3" />;
      case 'down':
        return <TrendingDown className="h-3 w-3" />;
      case 'neutral':
        return <Minus className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const displayValue = formatValue ? formatValue(value) : value.toLocaleString();

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="h-4 bg-gray-200 rounded w-24"></div>
              <div className="h-8 bg-gray-200 rounded w-16"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
        bg-white rounded-lg shadow-sm border border-gray-200 p-6 transition-all duration-200
        ${onClick ? 'cursor-pointer hover:shadow-md hover:border-gray-300' : ''}
        ${className}
      `}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">
            {title}
          </p>
          
          <p className="text-3xl font-bold text-gray-900 mb-2">
            {displayValue}
          </p>

          <div className="flex items-center space-x-2">
            {calculatedTrend && calculatedTrendValue && (
              <div className={`
                flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                ${currentColorVariant.trend[calculatedTrend]}
              `}>
                {getTrendIcon()}
                <span>{calculatedTrendValue}%</span>
              </div>
            )}
            
            {subtitle && (
              <p className="text-xs text-gray-500">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {Icon && (
          <div className={`p-3 rounded-lg ${currentColorVariant.icon}`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
