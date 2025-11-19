import { useState, useMemo } from 'react';

const usePagination = (data = [], itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate total pages
  const totalPages = useMemo(() => {
    return Math.ceil(data.length / itemsPerPage);
  }, [data.length, itemsPerPage]);

  // Get current page data
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, itemsPerPage]);

  // Calculate pagination info
  const paginationInfo = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage + 1;
    const endIndex = Math.min(currentPage * itemsPerPage, data.length);
    
    return {
      startIndex,
      endIndex,
      totalItems: data.length,
      currentPage,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1
    };
  }, [currentPage, itemsPerPage, data.length, totalPages]);

  // Navigation functions
  const goToPage = (page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const previousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToFirstPage = () => {
    setCurrentPage(1);
  };

  const goToLastPage = () => {
    setCurrentPage(totalPages);
  };

  // Reset pagination when data changes
  const resetPagination = () => {
    setCurrentPage(1);
  };

  // Get page numbers for pagination UI
  const getPageNumbers = (maxVisible = 5) => {
    const pages = [];
    const halfVisible = Math.floor(maxVisible / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, currentPage + halfVisible);
    
    if (currentPage <= halfVisible) {
      endPage = Math.min(maxVisible, totalPages);
    }
    
    if (currentPage + halfVisible >= totalPages) {
      startPage = Math.max(1, totalPages - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  return {
    currentData,
    currentPage,
    totalPages,
    paginationInfo,
    goToPage,
    nextPage,
    previousPage,
    goToFirstPage,
    goToLastPage,
    resetPagination,
    getPageNumbers
  };
};

export default usePagination;
