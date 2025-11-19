import React, { useState } from 'react';
import { ChevronUp, ChevronDown, Search, Filter, MoreVertical } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';

const Table = ({ 
  data = [], 
  columns = [], 
  loading = false,
  searchable = false,
  sortable = true,
  pagination = false,
  itemsPerPage = 10,
  onRowClick,
  className = '',
  emptyMessage = 'No data available',
  actions
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search term
  const filteredData = searchable ? data.filter(row =>
    columns.some(column => {
      const value = row[column.key];
      return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
    })
  ) : data;

  // Sort data
  const sortedData = sortable && sortConfig.key ? 
    [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    }) : filteredData;

  // Paginate data
  const totalPages = pagination ? Math.ceil(sortedData.length / itemsPerPage) : 1;
  const paginatedData = pagination ? 
    sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage) : 
    sortedData;

  const handleSort = (key) => {
    if (!sortable) return;
    
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const renderSortIcon = (key) => {
    if (!sortable || sortConfig.key !== key) return null;
    
    return sortConfig.direction === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row[column.key], row);
    }
    
    if (column.type === 'badge') {
      const badgeColor = column.getBadgeColor ? column.getBadgeColor(row[column.key]) : 'bg-gray-100 text-gray-800';
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${badgeColor}`}>
          {row[column.key]}
        </span>
      );
    }
    
    if (column.type === 'date') {
      return new Date(row[column.key]).toLocaleDateString();
    }
    
    if (column.type === 'currency') {
      return `$${parseFloat(row[column.key]).toFixed(2)}`;
    }
    
    return row[column.key];
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {/* Header Controls */}
      {(searchable || actions) && (
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {searchable && (
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          )}
          
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center p-8">
          <LoadingSpinner size="lg" />
        </div>
      )}

      {/* Empty State */}
      {!loading && paginatedData.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Found</h3>
          <p className="text-gray-500">{emptyMessage}</p>
        </div>
      )}

      {/* Table */}
      {!loading && paginatedData.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    onClick={() => column.sortable !== false && handleSort(column.key)}
                    className={`
                      px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider
                      ${column.sortable !== false && sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''}
                      ${column.width ? `w-${column.width}` : ''}
                    `}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{column.header}</span>
                      {renderSortIcon(column.key)}
                    </div>
                  </th>
                ))}
                {onRowClick && (
                  <th className="px-6 py-3 w-12"></th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`
                    transition-colors
                    ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
                  `}
                >
                  {columns.map((column, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {renderCell(row, column)}
                    </td>
                  ))}
                  {onRowClick && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} results
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`
                  px-3 py-1 text-sm border rounded
                  ${currentPage === page 
                    ? 'bg-blue-600 text-white border-blue-600' 
                    : 'border-gray-300 hover:bg-gray-100'
                  }
                `}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
