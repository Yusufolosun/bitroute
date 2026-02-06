'use client';

import { useState } from 'react';
import TokenSelector, { Token } from './TokenSelector';
import AmountInput from './AmountInput';
import { useWallet } from '@/contexts/WalletContext';
import { useContract } from '@/hooks/useContract';
import { microToStx } from '@/lib/stacks';
import { CONTRACT_ADDRESS, DEFAULT_NETWORK } from '@/lib/constants';
import { useTransaction } from '@/contexts/TransactionContext';
import { TransactionStatus } from '@/types/transaction';

export default function SwapForm() {
  const { isConnected, userAddress } = useWallet();
  const { getQuote, swap, isLoading, error, getDexName } = useContract();
  
  const { addTransaction, updateTransactionStatus } = useTransaction();

  const [tokenIn, setTokenIn] = useState<Token | null>(null);
  const [tokenOut, setTokenOut] = useState<Token | null>(null);
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [routeInfo, setRouteInfo] = useState<{
    dexName: string;
    alexQuote: string;
    velarQuote: string;
  } | null>(null);
  const [txId, setTxId] = useState<string | null>(null);

  const handleSwapTokens = () => {
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setAmountIn(amountOut);
    setAmountOut('');
    setRouteInfo(null);
  };

  const handleGetQuote = async () => {
    if (!tokenIn || !tokenOut || !amountIn) return;
    
    // Use token addresses directly (all tokens now have valid contract addresses)
    const tokenInAddress = tokenIn.address!;
    const tokenOutAddress = tokenOut.address!;
    
    const quote = await getQuote(
      tokenInAddress,
      tokenOutAddress,
      parseFloat(amountIn)
    );

    if (quote) {
      const outputAmount = microToStx(quote.expectedAmountOut);
      setAmountOut(outputAmount.toString());
      
      setRouteInfo({
        dexName: getDexName(quote.bestDex),
        alexQuote: microToStx(quote.alexQuote).toFixed(6),
        velarQuote: microToStx(quote.velarQuote).toFixed(6),
      });
    }
  };

  const handleSwap = async () => {
    if (!isConnected || !tokenIn || !tokenOut || !amountIn || !amountOut) {
      alert('Please fill all fields and get a quote first');
      return;
    }

    // Calculate minimum amount out based on slippage
    const minOut = parseFloat(amountOut) * (1 - parseFloat(slippage) / 100);
    
    // Use token addresses directly (all tokens now have valid contract addresses)
    const tokenInAddress = tokenIn.address!;
    const tokenOutAddress = tokenOut.address!;

    // Create transaction record
    const tempTxId = `temp-${Date.now()}`;
    addTransaction({
      txId: tempTxId,
      type: 'swap',
      tokenIn: tokenIn.symbol,
      tokenOut: tokenOut.symbol,
      amountIn: amountIn,
      amountOut: amountOut,
      dex: routeInfo?.dexName || 'Unknown',
    });

    await swap(
      tokenInAddress,
      tokenOutAddress,
      parseFloat(amountIn),
      minOut,
      (txId) => {
        // Update with real TX ID
        updateTransactionStatus(tempTxId, TransactionStatus.PENDING);
        addTransaction({
          txId: txId,
          type: 'swap',
          tokenIn: tokenIn.symbol,
          tokenOut: tokenOut.symbol,
          amountIn: amountIn,
          amountOut: amountOut,
          dex: routeInfo?.dexName || 'Unknown',
        });
        
        // Monitor transaction status
        checkTransactionStatus(txId);
        
        // Reset form
        setAmountIn('');
        setAmountOut('');
        setRouteInfo(null);
      },
      (error) => {
        updateTransactionStatus(tempTxId, TransactionStatus.FAILED, error);
      }
    );
  };

  const checkTransactionStatus = async (txId: string) => {
    // Poll for transaction confirmation
    let attempts = 0;
    const maxAttempts = 30; // 5 minutes max
    
    const poll = setInterval(async () => {
      attempts++;
      
      try {
        const response = await fetch(
          `https://api.testnet.hiro.so/extended/v1/tx/${txId}`
        );
        const data = await response.json();
        
        if (data.tx_status === 'success') {
          updateTransactionStatus(txId, TransactionStatus.SUCCESS);
          clearInterval(poll);
        } else if (data.tx_status === 'abort_by_response' || data.tx_status === 'abort_by_post_condition') {
          updateTransactionStatus(txId, TransactionStatus.FAILED, 'Transaction aborted');
          clearInterval(poll);
        }
        
        if (attempts >= maxAttempts) {
          clearInterval(poll);
        }
      } catch (error) {
        console.error('Error checking tx status:', error);
      }
    }, 10000); // Check every 10 seconds
  };

  const isFormValid = tokenIn && tokenOut && amountIn && parseFloat(amountIn) > 0;

  return (
    <div className="space-y-4">
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-sm text-red-600 dark:text-red-400">
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* Success Display */}
      {txId && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <p className="text-sm text-green-600 dark:text-green-400">
            ✅ Swap submitted! TX: {txId.slice(0, 10)}...
          </p>
        </div>
      )}

      {/* Token In */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
        <TokenSelector
          selectedToken={tokenIn}
          onSelectToken={setTokenIn}
          label="From"
          disabled={!isConnected}
        />
        
        <div className="mt-4">
          <AmountInput
            value={amountIn}
            onChange={(val) => {
              setAmountIn(val);
              setAmountOut('');
              setRouteInfo(null);
            }}
            label="Amount"
            disabled={!isConnected}
          />
        </div>
      </div>

      {/* Swap Direction Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button
          onClick={handleSwapTokens}
          disabled={!isConnected}
          className="bg-white dark:bg-gray-800 border-4 border-gray-100 dark:border-gray-900 rounded-xl p-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
          </svg>
        </button>
      </div>

      {/* Token Out */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
        <TokenSelector
          selectedToken={tokenOut}
          onSelectToken={setTokenOut}
          label="To"
          disabled={!isConnected}
        />
        
        <div className="mt-4">
          <AmountInput
            value={amountOut}
            onChange={setAmountOut}
            label="Amount (estimated)"
            disabled={true}
            placeholder="0.00"
          />
        </div>
      </div>

      {/* Slippage Settings */}
      {isConnected && (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Slippage Tolerance
          </label>
          <div className="flex gap-2">
            {['0.1', '0.5', '1.0'].map((val) => (
              <button
                key={val}
                onClick={() => setSlippage(val)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  slippage === val
                    ? 'bg-orange-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
              >
                {val}%
              </button>
            ))}
            <input
              type="text"
              value={slippage}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^\d*\.?\d*$/.test(val)) {
                  setSlippage(val);
                }
              }}
              className="flex-1 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 dark:text-white"
              placeholder="Custom"
            />
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Get Quote Button */}
        {isConnected && isFormValid && !amountOut && (
          <button
            onClick={handleGetQuote}
            disabled={isLoading}
            className="w-full py-4 bg-orange-400 hover:bg-orange-500 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Getting Quote...
              </span>
            ) : (
              'Get Best Price'
            )}
          </button>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={!isConnected || !isFormValid || !amountOut || isLoading}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {!isConnected ? 'Connect Wallet to Swap' : isLoading ? 'Processing...' : 'Swap Tokens'}
        </button>
      </div>

      {/* Quote Display */}
      {amountOut && routeInfo && tokenIn && tokenOut && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Rate</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              1 {tokenIn.symbol} = {(parseFloat(amountOut) / parseFloat(amountIn)).toFixed(6)} {tokenOut.symbol}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Best Route</span>
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              {routeInfo.dexName}
            </span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 dark:text-gray-500">ALEX Quote:</span>
            <span className="text-gray-700 dark:text-gray-300">{routeInfo.alexQuote}</span>
          </div>
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500 dark:text-gray-500">Velar Quote:</span>
            <span className="text-gray-700 dark:text-gray-300">{routeInfo.velarQuote}</span>
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-blue-200 dark:border-blue-800">
            <span className="text-sm text-gray-600 dark:text-gray-400">Minimum Received</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              {(parseFloat(amountOut) * (1 - parseFloat(slippage) / 100)).toFixed(6)} {tokenOut.symbol}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
