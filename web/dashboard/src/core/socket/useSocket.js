import { useEffect, useCallback } from 'react';
import socketService from './socketService';

/**
 * Hook for using Socket.IO in React components
 */
export const useSocket = (userId) => {
  useEffect(() => {
    if (!userId) return;

    // Get API URL from environment
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
    const socketUrl = apiUrl.replace('/api', ''); // Remove /api suffix

    console.log('🔌 Connecting to socket server:', socketUrl);
    socketService.connect(socketUrl, userId);

    return () => {
      // Optional: disconnect on unmount
      // socketService.disconnect();
    };
  }, [userId]);

  const subscribe = useCallback((event, callback) => {
    return socketService.subscribe(event, callback);
  }, []);

  const isConnected = useCallback(() => {
    return socketService.isConnected();
  }, []);

  return {
    subscribe,
    isConnected,
    socketService,
  };
};
