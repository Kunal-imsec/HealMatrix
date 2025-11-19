
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import LoadingSpinner from '../common/LoadingSpinner';


const Layout = ({ children }) => {
  const { user, loading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);


  // Handle responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarOpen(false);
      }
    };


    window.addEventListener('resize', handleResize);
    handleResize(); // Check initial size


    return () => window.removeEventListener('resize', handleResize);
  }, []);


  // Load sidebar state from localStorage
  useEffect(() => {
    const savedCollapsedState = localStorage.getItem('sidebarCollapsed');
    if (savedCollapsedState !== null) {
      setIsSidebarCollapsed(JSON.parse(savedCollapsedState));
    }
  }, []);


  // Save sidebar state to localStorage
  const handleToggleCollapse = () => {
    const newCollapsedState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newCollapsedState);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newCollapsedState));
  };


  const handleMenuToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };


  // Show loading spinner while authentication is being verified
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }


  // Don't render layout if no user (will be handled by ProtectedRoute)
  if (!user) {
    return null;
  }


  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={handleSidebarClose}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={handleToggleCollapse}
      />


      {/* Main Content Area */}
      <div className={`
        flex-1 flex flex-col min-h-screen transition-all duration-300
        ${isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'}
      `}>
        {/* Header */}
        <Header
          onMenuToggle={handleMenuToggle}
          isSidebarOpen={isSidebarOpen}
        />


        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>


        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};


export default Layout;