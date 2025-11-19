import { useCallback } from 'react';
import { useNotification as useNotificationContext } from '../context/NotificationContext';

const useNotification = () => {
  const notification = useNotificationContext();

  // Show success notification
  const showSuccess = useCallback((message, options = {}) => {
    notification.addNotification({
      type: 'success',
      title: options.title || 'Success',
      message,
      duration: options.duration || 5000,
      ...options
    });
  }, [notification]);

  // Show error notification
  const showError = useCallback((message, options = {}) => {
    notification.addNotification({
      type: 'error',
      title: options.title || 'Error',
      message,
      duration: options.duration || 7000,
      ...options
    });
  }, [notification]);

  // Show warning notification
  const showWarning = useCallback((message, options = {}) => {
    notification.addNotification({
      type: 'warning',
      title: options.title || 'Warning',
      message,
      duration: options.duration || 6000,
      ...options
    });
  }, [notification]);

  // Show info notification
  const showInfo = useCallback((message, options = {}) => {
    notification.addNotification({
      type: 'info',
      title: options.title || 'Information',
      message,
      duration: options.duration || 5000,
      ...options
    });
  }, [notification]);

  // Show custom notification
  const showCustom = useCallback((notificationData) => {
    notification.addNotification(notificationData);
  }, [notification]);

  // Show loading notification
  const showLoading = useCallback((message = 'Loading...', options = {}) => {
    return notification.addNotification({
      type: 'loading',
      message,
      duration: 0, // Don't auto-dismiss
      ...options
    });
  }, [notification]);

  // Dismiss notification by ID
  const dismiss = useCallback((id) => {
    notification.removeNotification(id);
  }, [notification]);

  // Dismiss all notifications
  const dismissAll = useCallback(() => {
    notification.clearAllNotifications();
  }, [notification]);

  // Show promise notification (for async operations)
  const showPromise = useCallback(async (promise, messages = {}) => {
    const {
      loading = 'Loading...',
      success = 'Success!',
      error = 'Error occurred'
    } = messages;

    const loadingId = showLoading(loading);

    try {
      const result = await promise;
      dismiss(loadingId);
      showSuccess(typeof success === 'function' ? success(result) : success);
      return result;
    } catch (err) {
      dismiss(loadingId);
      showError(typeof error === 'function' ? error(err) : error);
      throw err;
    }
  }, [showLoading, showSuccess, showError, dismiss]);

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCustom,
    showLoading,
    showPromise,
    dismiss,
    dismissAll,
    notifications: notification.notifications,
    unreadCount: notification.unreadCount
  };
};

export default useNotification;
