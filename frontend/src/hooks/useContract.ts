'use client';

import { useState } from 'react';
import { openContractCall } from '@stacks/connect';
import { useWallet } from '@/contexts/WalletContext';
import {
  getBestRoute,
  executeAutoSwap,
  isContractPaused,
  getDexVolume,
  getDexName,
  BestRouteResponse,
} from '@/lib/contract';

export function useContract() {
  const { userSession } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Get price quote from contract
   */
  const getQuote = async (
    tokenIn: string,
    tokenOut: string,
    amountIn: number
  ): Promise<BestRouteResponse | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const route = await getBestRoute(tokenIn, tokenOut, amountIn);
      console.log('✅ Got quote:', route);
      return route;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get quote';
      console.error('❌ Quote error:', message);
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Execute swap transaction
   */
  const swap = async (
    tokenIn: string,
    tokenOut: string,
    amountIn: number,
    minAmountOut: number,
    onSuccess?: (txId: string) => void,
    onError?: (error: string) => void
  ) => {
    if (!userSession) {
      setError('Wallet not connected');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const txOptions = await executeAutoSwap(
        userSession,
        tokenIn,
        tokenOut,
        amountIn,
        minAmountOut,
        (data) => {
          console.log('✅ Swap successful:', data);
          if (onSuccess && data.txId) {
            onSuccess(data.txId);
          }
          setIsLoading(false);
        },
        () => {
          console.log('❌ Swap cancelled');
          setError('Transaction cancelled');
          setIsLoading(false);
          if (onError) {
            onError('Transaction cancelled');
          }
        }
      );

      // Open wallet popup to sign transaction
      await openContractCall(txOptions);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to execute swap';
      console.error('❌ Swap error:', message);
      setError(message);
      setIsLoading(false);
      if (onError) {
        onError(message);
      }
    }
  };

  /**
   * Check contract status
   */
  const checkStatus = async () => {
    try {
      const paused = await isContractPaused();
      return { paused };
    } catch (err) {
      console.error('❌ Status check error:', err);
      return { paused: false };
    }
  };

  return {
    getQuote,
    swap,
    checkStatus,
    getDexVolume,
    getDexName,
    isLoading,
    error,
    clearError: () => setError(null),
  };
}
