import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  showItemsPerPage = true,
  itemsPerPageOptions = [10, 25, 50, 100],
  onItemsPerPageChange,
  className = '',
  size = 'md'
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const sizeClasses = {
    sm: {
      button: 'px-2 py-1 text-xs',
      select: 'text-xs px-2 py-1'
    },
    md: {
      button: 'px-3 py-2 text-sm',
      select: 'text-sm px-3 py-2'
    },
    lg: {
      button: 'px-4 py-2 text-base',
      select: 'text-base px-3 py-2'
    }
  };

  const currentSizeClasses = sizeClasses[size];

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);
      
      if (currentPage > 4) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 3) {
        pages.push('...');
      }
      
      // Show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    if (onItemsPerPageChange) {
      onItemsPerPageChange(newItemsPerPage);
    }
  };

  if (totalPages <= 1 && !showItemsPerPage) {
    return null;
  }

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 ${className}`}>
      {/* Items info and per page selector */}
      <div className="flex items-center space-x-4">
        <div className="text-sm text-gray-700">
          Showing <span className="font-medium">{startItem}</span> to{' '}
          <span className="font-medium">{endItem}</span> of{' '}
          <span className="font-medium">{totalItems}</span> results
        </div>
        
        {showItemsPerPage && (
          <div className="flex items-center space-x-2">
            <label htmlFor="items-per-page" className="text-sm text-gray-700 whitespace-nowrap">
              Items per page:
            </label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              className={`border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${currentSizeClasses.select}`}
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex items-center space-x-2">
          {/* Previous button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`
              flex items-center space-x-1 border border-gray-300 rounded-md text-gray-500 
              hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white
              ${currentSizeClasses.button}
            `}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          {/* Page numbers */}
          <div className="flex items-center space-x-1">
            {pageNumbers.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-2 py-1 text-gray-500">
                    <MoreHorizontal className="h-4 w-4" />
                  </span>
                ) : (
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`
                      border rounded-md font-medium transition-colors
                      ${currentSizeClasses.button}
                      ${page === currentPage
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }
                    `}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`
              flex items-center space-x-1 border border-gray-300 rounded-md text-gray-500 
              hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white
              ${currentSizeClasses.button}
            `}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Pagination;
