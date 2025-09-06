import { useState, useEffect } from 'react';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineNotification, setShowOfflineNotification] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineNotification(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineNotification(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial connection and test with a request
    const checkConnection = async () => {
      try {
        const response = await fetch('/api/health', {
          method: 'HEAD',
          cache: 'no-cache',
          timeout: 5000
        } as RequestInit);
        
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
      } catch (error) {
        console.warn('Connection test failed:', error);
        setIsOnline(false);
        setShowOfflineNotification(true);
      }
    };

    checkConnection();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const dismissOfflineNotification = () => {
    setShowOfflineNotification(false);
  };

  return { 
    isOnline, 
    showOfflineNotification, 
    dismissOfflineNotification 
  };
};