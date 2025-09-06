import { useState, useEffect, useCallback } from 'react';

export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineNotification, setShowOfflineNotification] = useState(false);
  const [hasTestedConnection, setHasTestedConnection] = useState(false);

  const testConnection = useCallback(async () => {
    try {
      // Test with a simple endpoint or Google's DNS
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('/api/v1/search', {
        method: 'HEAD',
        cache: 'no-cache',
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      if (response.ok || response.status === 405) {
        // 405 Method Not Allowed is fine - means server is reachable
        setIsOnline(true);
        setShowOfflineNotification(false);
        return true;
      } else {
        throw new Error('Server not responding correctly');
      }
    } catch (error) {
      // Only show notification if we've tried multiple times or it's a clear network error
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn('Connection test timed out');
      } else {
        console.warn('Connection test failed:', error);
      }
      
      // Only mark as offline and show notification if we're sure there's an issue
      if (hasTestedConnection) {
        setIsOnline(false);
        setShowOfflineNotification(true);
      }
      return false;
    }
  }, [hasTestedConnection]);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineNotification(false);
      testConnection();
    };

    const handleOffline = () => {
      setIsOnline(false);
      // Wait a bit before showing notification to avoid false positives
      setTimeout(() => {
        setShowOfflineNotification(true);
      }, 2000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial connection test with delay to avoid immediate popup
    const initialTest = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
      await testConnection();
      setHasTestedConnection(true);
      
      // If still no connection after initial test, run one more test
      if (!isOnline) {
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 more seconds
        await testConnection();
      }
    };

    initialTest();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [testConnection, isOnline]);

  const dismissOfflineNotification = () => {
    setShowOfflineNotification(false);
  };

  const retryConnection = async () => {
    setShowOfflineNotification(false);
    const isConnected = await testConnection();
    if (!isConnected) {
      // If still not connected, show notification again after a delay
      setTimeout(() => {
        setShowOfflineNotification(true);
      }, 1000);
    }
  };

  return { 
    isOnline, 
    showOfflineNotification, 
    dismissOfflineNotification,
    retryConnection,
    testConnection
  };
};