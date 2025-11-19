import { io } from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  // Initialize socket connection
  connect(token) {
    const SOCKET_URL =
      import.meta.env.VITE_SOCKET_URL ||
      process.env.REACT_APP_SOCKET_URL ||
      'http://localhost:5000';

    if (this.socket?.connected) {
      console.log('Socket already connected');
      return this.socket;
    }

    try {
      this.socket = io(SOCKET_URL, {
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: this.maxReconnectAttempts,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        timeout: 20000,
      });

      this.setupDefaultListeners();
      return this.socket;
    } catch (error) {
      console.error('Socket connection error:', error);
      throw error;
    }
  }

  // Setup default event listeners
  setupDefaultListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('✅ Socket connected:', this.socket.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
      }
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket reconnected after', attemptNumber, 'attempts');
      this.reconnectAttempts = 0;
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('🔁 Reconnection attempt:', attemptNumber);
    });

    this.socket.on('reconnect_error', (error) => {
      console.error('Reconnection error:', error);
    });

    this.socket.on('reconnect_failed', () => {
      console.error('❌ Reconnection failed');
    });
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.listeners.clear();
      console.log('Socket disconnected and cleaned up');
    }
  }

  // Join a room
  joinRoom(roomName) {
    if (this.socket?.connected) {
      this.socket.emit('join-room', roomName);
      console.log('Joined room:', roomName);
    } else {
      console.warn('Cannot join room - socket not connected');
    }
  }

  // Leave a room
  leaveRoom(roomName) {
    if (this.socket?.connected) {
      this.socket.emit('leave-room', roomName);
      console.log('Left room:', roomName);
    }
  }

  // Subscribe to an event
  on(eventName, callback) {
    if (!this.socket) {
      console.warn('Socket not connected');
      return null;
    }

    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, []);
    }
    this.listeners.get(eventName).push(callback);
    this.socket.on(eventName, callback);

    // Return unsubscribe function
    return () => this.off(eventName, callback);
  }

  // Unsubscribe from an event
  off(eventName, callback) {
    if (!this.socket) return;

    if (callback) {
      this.socket.off(eventName, callback);
      if (this.listeners.has(eventName)) {
        const callbacks = this.listeners.get(eventName);
        const index = callbacks.indexOf(callback);
        if (index > -1) callbacks.splice(index, 1);
        if (callbacks.length === 0) this.listeners.delete(eventName);
      }
    } else {
      this.socket.off(eventName);
      this.listeners.delete(eventName);
    }
  }

  // Emit event
  emit(eventName, data) {
    if (this.socket?.connected) {
      this.socket.emit(eventName, data);
    } else {
      console.warn('Cannot emit - socket not connected');
    }
  }

  // Emit with acknowledgment
  emitWithAck(eventName, data, timeout = 5000) {
    return new Promise((resolve, reject) => {
      if (!this.socket?.connected) {
        reject(new Error('Socket not connected'));
        return;
      }

      const timer = setTimeout(() => reject(new Error('Ack timeout')), timeout);

      this.socket.emit(eventName, data, (response) => {
        clearTimeout(timer);
        resolve(response);
      });
    });
  }

  // ===============================
  // Utility Methods
  // ===============================
  getSocketId() {
    return this.socket?.id || null;
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  reconnect() {
    if (this.socket) this.socket.connect();
  }

  getActiveListeners() {
    return Array.from(this.listeners.keys());
  }

  clearAllListeners() {
    if (this.socket) this.socket.removeAllListeners();
    this.listeners.clear();
  }

  getStatus() {
    return {
      connected: this.isConnected(),
      socketId: this.getSocketId(),
      reconnectAttempts: this.reconnectAttempts,
      activeListeners: this.getActiveListeners(),
    };
  }

  // ===============================
  // HOSPITAL MANAGEMENT EVENTS
  // ===============================

  // Notifications
  onNotification(cb) { return this.on('notification', cb); }
  offNotification(cb) { this.off('notification', cb); }
  sendNotification(data) { this.emit('send-notification', data); }

  // Appointments
  onAppointmentUpdate(cb) { return this.on('appointment-update', cb); }
  offAppointmentUpdate(cb) { this.off('appointment-update', cb); }
  onAppointmentCreated(cb) { return this.on('appointment-created', cb); }
  offAppointmentCreated(cb) { this.off('appointment-created', cb); }
  onAppointmentCancelled(cb) { return this.on('appointment-cancelled', cb); }

  // Patients
  onPatientStatusUpdate(cb) { return this.on('patient-status-update', cb); }
  offPatientStatusUpdate(cb) { this.off('patient-status-update', cb); }
  onPatientAdmitted(cb) { return this.on('patient-admitted', cb); }
  onPatientDischarged(cb) { return this.on('patient-discharged', cb); }

  // Chat / Messaging
  onMessage(cb) { return this.on('message', cb); }
  offMessage(cb) { this.off('message', cb); }
  sendMessage(data) { this.emit('send-message', data); }
  onTyping(cb) { return this.on('typing', cb); }
  offTyping(cb) { this.off('typing', cb); }
  emitTyping(data) { this.emit('typing', data); }

  // Queue
  onQueueUpdate(cb) { return this.on('queue-update', cb); }
  offQueueUpdate(cb) { this.off('queue-update', cb); }

  // Emergency
  onEmergencyAlert(cb) { return this.on('emergency-alert', cb); }
  offEmergencyAlert(cb) { this.off('emergency-alert', cb); }
  emitEmergencyAlert(data) { this.emit('emergency-alert', data); }

  // User presence
  onUserStatusChange(cb) { return this.on('user-status-change', cb); }
  offUserStatusChange(cb) { this.off('user-status-change', cb); }

  // System
  onSystemUpdate(cb) { return this.on('system-update', cb); }
  offSystemUpdate(cb) { this.off('system-update', cb); }
  onMaintenanceMode(cb) { return this.on('maintenance-mode', cb); }
  offMaintenanceMode(cb) { this.off('maintenance-mode', cb); }

  // Vital Signs
  onVitalSignsUpdate(cb) { return this.on('vital-signs-update', cb); }
  offVitalSignsUpdate(cb) { this.off('vital-signs-update', cb); }
  emitVitalSigns(data) { this.emit('vital-signs', data); }

  // Prescription
  onPrescriptionDispensed(cb) { return this.on('prescription-dispensed', cb); }

  // Billing
  onPaymentReceived(cb) { return this.on('payment-received', cb); }

  // Staff
  onStaffAssigned(cb) { return this.on('staff-assigned', cb); }

  // Lab results
  onLabResultReady(cb) { return this.on('lab-result-ready', cb); }

  // Bed availability
  onBedAvailabilityUpdate(cb) { return this.on('bed-availability-update', cb); }
}

const socketService = new SocketService();
export default socketService;
