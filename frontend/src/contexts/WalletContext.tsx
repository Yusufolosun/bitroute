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
      console.log('📍 Profile:', userData.profile);
      console.log('🌐 DEFAULT_NETWORK:', DEFAULT_NETWORK);
      
      let address: string | null = null;
      
      // Try multiple methods to get address
      
      // Method 1: Try testnet first (most common for development)
      if (userData.profile?.stxAddress?.testnet) {
        address = userData.profile.stxAddress.testnet;
        console.log('✅ Method 1 (testnet):', address);
      }
      
      // Method 2: Try mainnet
      else if (userData.profile?.stxAddress?.mainnet) {
        address = userData.profile.stxAddress.mainnet;
        console.log('✅ Method 2 (mainnet):', address);
      }
      
      // Method 3: Try DEFAULT_NETWORK
      else if (userData.profile?.stxAddress?.[DEFAULT_NETWORK]) {
        address = userData.profile.stxAddress[DEFAULT_NETWORK];
        console.log('✅ Method 3 (DEFAULT_NETWORK):', address);
      }
      
      // Method 4: Direct string format
      else if (typeof userData.profile?.stxAddress === 'string') {
        address = userData.profile.stxAddress;
        console.log('✅ Method 4 (direct string):', address);
      }
      
      // Method 5: Leather wallet format (identities)
      else if ((userData as any).identities?.length > 0) {
        address = (userData as any).identities[0].address;
        console.log('✅ Method 5 (identities):', address);
      }
      
      if (address) {
        console.log('✅ Final address:', address);
        console.log('📝 Setting state - address:', address, 'connected: true');
        setUserAddress(address);
        setIsConnected(true);
        console.log('✅ State updated successfully');
      } else {
        console.error('❌ Could not extract address from user data');
        console.log('Full userData structure:', JSON.stringify(userData, null, 2));
      }
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
          checkConnection();
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
