import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import socketService from '../services/socketService';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Initialize socket connection
  useEffect(() => {
    if (user && token) {
      connectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [user, token]);

  // Connect to socket
  const connectSocket = useCallback(() => {
    try {
      socketService.connect(token);
      setupSocketListeners();
      setConnectionError(null);
    } catch (error) {
      console.error('Socket connection error:', error);
      setConnectionError(error.message);
    }
  }, [token]);

  // Disconnect from socket
  const disconnectSocket = useCallback(() => {
    socketService.disconnect();
    setIsConnected(false);
    setOnlineUsers([]);
  }, []);

  // Setup socket event listeners
  const setupSocketListeners = useCallback(() => {
    // Connection events
    socketService.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      setConnectionError(null);

      // Join user's personal room
      if (user) {
        socketService.joinRoom(`user_${user.id}`);
        socketService.joinRoom(`role_${user.role}`);
        if (user.department) {
          socketService.joinRoom(`department_${user.department}`);
        }
      }
    });

    socketService.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    socketService.on('error', (error) => {
      console.error('Socket error:', error);
      setConnectionError(error.message);
    });

    socketService.on('reconnect', () => {
      console.log('Socket reconnected');
      setIsConnected(true);
      setConnectionError(null);
    });

    // Online users update
    socketService.on('online-users', (users) => {
      setOnlineUsers(users);
    });

    // User status changes
    socketService.on('user-status-change', ({ userId, status }) => {
      setOnlineUsers(prev => 
        prev.map(u => u.id === userId ? { ...u, status } : u)
      );
    });
  }, [user]);

  // Join a room
  const joinRoom = useCallback((roomName) => {
    if (isConnected) {
      socketService.joinRoom(roomName);
    }
  }, [isConnected]);

  // Leave a room
  const leaveRoom = useCallback((roomName) => {
    if (isConnected) {
      socketService.leaveRoom(roomName);
    }
  }, [isConnected]);

  // Subscribe to event
  const subscribe = useCallback((event, callback) => {
    socketService.on(event, callback);
    
    // Return unsubscribe function
    return () => {
      socketService.off(event, callback);
    };
  }, []);

  // Emit event
  const emit = useCallback((event, data) => {
    if (isConnected) {
      socketService.emit(event, data);
    }
  }, [isConnected]);

  // Send notification
  const sendNotification = useCallback((notification) => {
    emit('send-notification', notification);
  }, [emit]);

  // Send message
  const sendMessage = useCallback((message) => {
    emit('send-message', message);
  }, [emit]);

  // Emit typing indicator
  const emitTyping = useCallback((data) => {
    emit('typing', data);
  }, [emit]);

  // Emit emergency alert
  const emitEmergencyAlert = useCallback((alert) => {
    emit('emergency-alert', alert);
  }, [emit]);

  // Subscribe to notifications
  const onNotification = useCallback((callback) => {
    return subscribe('notification', callback);
  }, [subscribe]);

  // Subscribe to messages
  const onMessage = useCallback((callback) => {
    return subscribe('message', callback);
  }, [subscribe]);

  // Subscribe to appointment updates
  const onAppointmentUpdate = useCallback((callback) => {
    return subscribe('appointment-update', callback);
  }, [subscribe]);

  // Subscribe to patient status updates
  const onPatientStatusUpdate = useCallback((callback) => {
    return subscribe('patient-status-update', callback);
  }, [subscribe]);

  // Subscribe to queue updates
  const onQueueUpdate = useCallback((callback) => {
    return subscribe('queue-update', callback);
  }, [subscribe]);

  // Subscribe to emergency alerts
  const onEmergencyAlert = useCallback((callback) => {
    return subscribe('emergency-alert', callback);
  }, [subscribe]);

  // Subscribe to system updates
  const onSystemUpdate = useCallback((callback) => {
    return subscribe('system-update', callback);
  }, [subscribe]);

  // Check if user is online
  const isUserOnline = useCallback((userId) => {
    return onlineUsers.some(u => u.id === userId && u.status === 'online');
  }, [onlineUsers]);

  // Get user status
  const getUserStatus = useCallback((userId) => {
    const user = onlineUsers.find(u => u.id === userId);
    return user?.status || 'offline';
  }, [onlineUsers]);

  const value = {
    isConnected,
    connectionError,
    onlineUsers,
    joinRoom,
    leaveRoom,
    subscribe,
    emit,
    sendNotification,
    sendMessage,
    emitTyping,
    emitEmergencyAlert,
    onNotification,
    onMessage,
    onAppointmentUpdate,
    onPatientStatusUpdate,
    onQueueUpdate,
    onEmergencyAlert,
    onSystemUpdate,
    isUserOnline,
    getUserStatus,
    reconnect: connectSocket,
    disconnect: disconnectSocket
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
