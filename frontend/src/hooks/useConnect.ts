'use client';

import { useEffect, useState } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { DEFAULT_NETWORK } from '@/lib/constants';

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export function useConnect() {
  const [mounted, setMounted] = useState(false);
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Check if already connected
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      const address = userData.profile.stxAddress[DEFAULT_NETWORK];
      setUserAddress(address);
      setIsConnected(true);
    }
  }, []);

  const connect = () => {
    showConnect({
      appDetails: {
        name: 'BitRoute',
        icon: '/bitroute-icon.png', // Add icon to public folder
      },
      redirectTo: '/',
      onFinish: () => {
        const userData = userSession.loadUserData();
        const address = userData.profile.stxAddress[DEFAULT_NETWORK];
        setUserAddress(address);
        setIsConnected(true);
      },
      onCancel: () => {
        console.log('User cancelled connection');
      },
      userSession,
    });
  };

  const disconnect = () => {
    userSession.signUserOut();
    setUserAddress(null);
    setIsConnected(false);
  };

  // Prevent hydration mismatch
  if (!mounted) {
    return {
      userAddress: null,
      isConnected: false,
      connect: () => {},
      disconnect: () => {},
      userSession: null,
    };
  }

  return {
    userAddress,
    isConnected,
    connect,
    disconnect,
    userSession,
  };
}
