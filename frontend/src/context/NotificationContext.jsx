import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useSocket } from "./SocketContext";
import notificationService from "../services/notificationService";

const NotificationContext = createContext();

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [notificationSettings, setNotificationSettings] = useState({
    email: true,
    sms: false,
    push: true,
    inApp: true,
    sound: true,
    desktop: true,
  });
  const [unreadCount, setUnreadCount] = useState(0);

  const { onNotification, isConnected } = useSocket();

  // ---- Add Notification ----
  const addNotification = useCallback(
    ({
      title,
      message,
      type = "info",
      duration = 5000,
      action = null,
      persistent = false,
    }) => {
      const id = Date.now() + Math.random();
      const notification = {
        id,
        title,
        message,
        type,
        duration,
        action,
        persistent,
        timestamp: new Date(),
        read: false,
      };

      setNotifications((prev) => [notification, ...prev]);

      if (!persistent && duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }

      return id;
    },
    []
  );

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  // ---- Real-time socket updates ----
  useEffect(() => {
    if (isConnected) {
      const unsubscribe = onNotification((notification) => {
        addNotification(notification);
        setUnreadCount((prev) => prev + 1);

        if (notificationSettings.sound) playNotificationSound();
        if (notificationSettings.desktop && "Notification" in window)
          showDesktopNotification(notification);
      });
      return unsubscribe;
    }
  }, [isConnected, notificationSettings, addNotification]);

  // ---- Unread management ----
  const fetchUnreadCount = async () => {
    try {
      const count = await notificationService.getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await notificationService.deleteNotification(notificationId);
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const updateNotificationSettings = async (settings) => {
    try {
      await notificationService.updateNotificationSettings(settings);
      setNotificationSettings((prev) => ({ ...prev, ...settings }));
    } catch (error) {
      console.error("Error updating notification settings:", error);
    }
  };

  // ---- Sound and Desktop Notifications ----
  const playNotificationSound = () => {
    const audio = new Audio("/sounds/notification.mp3");
    audio.play().catch((err) => console.error("Error playing sound:", err));
  };

  const showDesktopNotification = (notification) => {
    if (Notification.permission === "granted") {
      new Notification(notification.title, {
        body: notification.message,
        icon: "/logo192.png",
        badge: "/logo192.png",
      });
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
          showDesktopNotification(notification);
        }
      });
    }
  };

  // ---- Convenience methods ----
  const showSuccess = useCallback(
    (title, message, options = {}) =>
      addNotification({ title, message, type: "success", ...options }),
    [addNotification]
  );
  const showError = useCallback(
    (title, message, options = {}) =>
      addNotification({ title, message, type: "error", duration: 7000, ...options }),
    [addNotification]
  );
  const showWarning = useCallback(
    (title, message, options = {}) =>
      addNotification({ title, message, type: "warning", ...options }),
    [addNotification]
  );
  const showInfo = useCallback(
    (title, message, options = {}) =>
      addNotification({ title, message, type: "info", ...options }),
    [addNotification]
  );

  // ---- Context Value ----
  const value = {
    notifications,
    notificationSettings,
    unreadCount,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    updateNotificationSettings,
    fetchUnreadCount,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
};

// ---- UI Container for Notifications ----
const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  const getStyle = (type) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200 text-green-800";
      case "error":
        return "bg-red-50 border-red-200 text-red-800";
      case "warning":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-blue-50 border-blue-200 text-blue-800";
    }
  };

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((n) => (
        <div
          key={n.id}
          className={`max-w-sm w-full ${getStyle(n.type)} border rounded-lg shadow-lg animate-fade-in p-4`}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{n.title}</p>
              {n.message && <p className="text-sm mt-1">{n.message}</p>}
            </div>
            <button
              className="text-gray-500 hover:text-gray-700 ml-3"
              onClick={() => removeNotification(n.id)}
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
