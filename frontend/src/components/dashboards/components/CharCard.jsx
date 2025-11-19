import React from 'react';
import { MoreHorizontal, TrendingUp, Download, Maximize2 } from 'lucide-react';

const ChartCard = ({
  title = '',
  children,
  subtitle = '',
  loading = false,
  error = null,
  actions = [],
  showFullscreen = true,
  showDownload = true,
  onFullscreen = null,
  onDownload = null,
  className = '',
  headerClassName = '',
  contentClassName = ''
}) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const menuRef = React.useRef(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const defaultActions = [
    ...(showFullscreen && onFullscreen ? [{
      label: 'View Fullscreen',
      icon: Maximize2,
      onClick: onFullscreen
    }] : []),
    ...(showDownload && onDownload ? [{
      label: 'Download Chart',
      icon: Download,
      onClick: onDownload
    }] : []),
    ...actions
  ];

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
        <div className={`p-6 border-b border-gray-200 ${headerClassName}`}>
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48"></div>
          </div>
        </div>
        <div className={`p-6 ${contentClassName}`}>
          <div className="animate-pulse">
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-red-200 ${className}`}>
        <div className={`p-6 border-b border-gray-200 ${headerClassName}`}>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`p-6 ${contentClassName}`}>
          <div className="text-center py-8">
            <div className="text-red-500 mb-4">
              <svg className="h-12 w-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load chart</h3>
            <p className="text-sm text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header */}
      <div className={`flex items-center justify-between p-6 border-b border-gray-200 ${headerClassName}`}>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {title}
          </h3>
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {defaultActions.length > 0 && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <MoreHorizontal className="h-5 w-5" />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1">
                  {defaultActions.map((action, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        action.onClick();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {action.icon && <action.icon className="h-4 w-4 mr-3" />}
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className={`p-6 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default ChartCard;
