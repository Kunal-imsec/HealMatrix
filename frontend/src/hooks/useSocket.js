import { useEffect, useCallback, useRef } from 'react';
import { useSocket as useSocketContext } from '../context/SocketContext';

const useSocket = () => {
  const socket = useSocketContext();
  const listenersRef = useRef([]);

  // Subscribe to socket events
  const on = useCallback((event, callback) => {
    if (socket.isConnected) {
      const unsubscribe = socket.subscribe(event, callback);
      listenersRef.current.push({ event, unsubscribe });
      return unsubscribe;
    }
  }, [socket]);

  // Emit socket events
  const emit = useCallback((event, data) => {
    if (socket.isConnected) {
      socket.emit(event, data);
    }
  }, [socket]);

  // Join a room
  const joinRoom = useCallback((roomName) => {
    socket.joinRoom(roomName);
  }, [socket]);

  // Leave a room
  const leaveRoom = useCallback((roomName) => {
    socket.leaveRoom(roomName);
  }, [socket]);

  // Cleanup listeners on unmount
  useEffect(() => {
    return () => {
      listenersRef.current.forEach(({ unsubscribe }) => {
        if (unsubscribe) unsubscribe();
      });
      listenersRef.current = [];
    };
  }, []);

  return {
    isConnected: socket.isConnected,
    on,
    emit,
    joinRoom,
    leaveRoom,
    onNotification: socket.onNotification,
    onMessage: socket.onMessage,
    onAppointmentUpdate: socket.onAppointmentUpdate,
    onPatientStatusUpdate: socket.onPatientStatusUpdate,
    onQueueUpdate: socket.onQueueUpdate,
    onEmergencyAlert: socket.onEmergencyAlert,
    sendMessage: socket.sendMessage,
    sendNotification: socket.sendNotification,
    emitTyping: socket.emitTyping,
    emitEmergencyAlert: socket.emitEmergencyAlert,
    isUserOnline: socket.isUserOnline,
    getUserStatus: socket.getUserStatus,
    onlineUsers: socket.onlineUsers
  };
};

export default useSocket;
