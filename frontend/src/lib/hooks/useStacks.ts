'use client';

import { useState, useEffect } from 'react';
import { showConnect } from '@stacks/connect';
import { StacksTestnet } from '@stacks/network';
import {
  makeContractCall,
  broadcastTransaction,
  AnchorMode,
  stringAsciiCV,
  uintCV,
} from '@stacks/transactions';
import { contractAddress, contractName } from '../stacks-config';

export function useStacks() {
  const [address, setAddress] = useState<string | null>(null);
  const [network] = useState(new StacksTestnet());

  useEffect(() => {
    // Check if user is already connected
    const savedAddress = localStorage.getItem('stacks-address');
    if (savedAddress) {
      setAddress(savedAddress);
    }
  }, []);

  const connect = () => {
    showConnect({
      appDetails: {
        name: 'BitRoute',
        icon: window.location.origin + '/logo.png',
      },
      onFinish: (data) => {
        setAddress(data.userSession.loadUserData().profile.stxAddress.testnet);
        localStorage.setItem('stacks-address', data.userSession.loadUserData().profile.stxAddress.testnet);
      },
      userSession: undefined,
    });
  };

  const createRoute = async (source: string, destination: string, fee: number) => {
    if (!address) throw new Error('Wallet not connected');

    const txOptions = {
      contractAddress,
      contractName,
      functionName: 'create-route',
      functionArgs: [
        stringAsciiCV(source),
        stringAsciiCV(destination),
        uintCV(fee),
      ],
      senderKey: '', // Will be filled by Stacks wallet
      network,
      anchorMode: AnchorMode.Any,
    };

    const transaction = await makeContractCall(txOptions);
    const result = await broadcastTransaction(transaction, network);
    return result;
  };

  const getRoute = async (routeId: number) => {
    // Implement read-only function call
    // This would use the Stacks API or @stacks/blockchain-api-client
    return null;
  };

  return {
    address,
    connect,
    createRoute,
    getRoute,
  };
}
