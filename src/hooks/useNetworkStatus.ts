import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.dismiss();
      toast.success("Back online!")
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.loading('Network unavailable');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [navigator.onLine]);


  return { isOnline };
}

export default useNetworkStatus;