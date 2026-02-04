'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AppConfig, UserSession, showConnect } from '@stacks/connect';
import { DEFAULT_NETWORK } from '@/lib/constants';

interface WalletContextType {
  userAddress: string | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  userSession: UserSession | null;
}

const WalletContext = createContext<WalletContextType>({
  userAddress: null,
  isConnected: false,
  connect: () => {},
  disconnect: () => {},
  userSession: null,
});

const appConfig = new AppConfig(['store_write', 'publish_data']);
const userSession = new UserSession({ appConfig });

export function WalletProvider({ children }: { children: ReactNode }) {
  const [userAddress, setUserAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    checkConnection();
  }, []);

  const checkConnection = () => {
    console.log('🔍 Checking wallet connection...');
    if (userSession.isUserSignedIn()) {
      const userData = userSession.loadUserData();
      console.log('📦 User data:', userData);
      // Try different address formats (Leather uses different structure than Hiro)
      const address = userData.profile.stxAddress?.[DEFAULT_NETWORK] 
        || userData.profile.stxAddress?.mainnet 
        || userData.profile.stxAddress?.testnet;
      console.log('✅ Wallet connected:', address);
      setUserAddress(address);
      setIsConnected(true);
    } else {
      console.log('❌ No wallet connected');
    }
  };

  const connect = () => {
    console.log('🔌 Initiating wallet connection...');
    showConnect({
      appDetails: {
        name: 'BitRoute',
        icon: window.location.origin + '/bitroute-icon.png',
      },
      redirectTo: '/',
      onFinish: () => {
        console.log('✅ Wallet connection finished');
        // Wait for user session to be saved, then update state
        setTimeout(() => {
          if (userSession.isUserSignedIn()) {
            const userData = userSession.loadUserData();
            console.log('📦 User data after connect:', userData);
            // Try different address formats
            const address = userData.profile.stxAddress?.[DEFAULT_NETWORK] 
              || userData.profile.stxAddress?.mainnet 
              || userData.profile.stxAddress?.testnet;
            console.log('✅ Wallet connected:', address);
            setUserAddress(address);
            setIsConnected(true);
          }
        }, 500);
      },
      onCancel: () => {
        console.log('❌ User cancelled connection');
      },
      userSession,
    });
  };

  const disconnect = () => {
    console.log('🔌 Disconnecting wallet...');
    userSession.signUserOut();
    setUserAddress(null);
    setIsConnected(false);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <WalletContext.Provider
      value={{
        userAddress,
        isConnected,
        connect,
        disconnect,
        userSession,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
