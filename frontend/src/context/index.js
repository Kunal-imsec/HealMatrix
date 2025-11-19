export { AuthProvider, useAuth } from './AuthContext';
export { ThemeProvider, useTheme } from './ThemeContext';
export { NotificationProvider, useNotification } from './NotificationContext';
export { SettingsProvider, useSettings } from './SettingsContext';
export { SocketProvider, useSocket } from './SocketContext';

// Combined provider for wrapping the app
import React from 'react';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';
import { NotificationProvider } from './NotificationContext';
import { SettingsProvider } from './SettingsContext';
import { SocketProvider } from './SocketContext';

export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <SettingsProvider>
          <SocketProvider>
            <NotificationProvider>
              {children}
            </NotificationProvider>
          </SocketProvider>
        </SettingsProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};
