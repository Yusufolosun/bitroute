'use client';

import { useState } from 'react';
import TokenSelector, { Token } from './TokenSelector';
import AmountInput from './AmountInput';
import { useWallet } from '@/contexts/WalletContext';

export default function SwapForm() {
  const { isConnected } = useWallet();
  
  const [tokenIn, setTokenIn] = useState<Token | null>(null);
  const [tokenOut, setTokenOut] = useState<Token | null>(null);
  const [amountIn, setAmountIn] = useState('');
  const [amountOut, setAmountOut] = useState('');
  const [slippage, setSlippage] = useState('0.5');
  const [isLoading, setIsLoading] = useState(false);

  const handleSwapTokens = () => {
    // Flip tokens and amounts
    setTokenIn(tokenOut);
    setTokenOut(tokenIn);
    setAmountIn(amountOut);
    setAmountOut(amountIn);
  };

  const handleGetQuote = () => {
    if (!tokenIn || !tokenOut || !amountIn) return;
    
    setIsLoading(true);
    // TODO: Call get-best-route contract function
    
    // Mock quote for now
    setTimeout(() => {
      const mockOutput = (parseFloat(amountIn) * 0.95).toFixed(6);
      setAmountOut(mockOutput);
      setIsLoading(false);
    }, 500);
  };

  const handleSwap = () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    
    // TODO: Call execute-auto-swap contract function
    console.log('Executing swap:', { tokenIn, tokenOut, amountIn, amountOut, slippage });
  };

  const isFormValid = tokenIn && tokenOut && amountIn && parseFloat(amountIn) > 0;

  return (
    <div className="space-y-4">
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
              setAmountOut(''); // Clear output when input changes
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
            {isLoading ? 'Getting Quote...' : 'Get Best Price'}
          </button>
        )}

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          disabled={!isConnected || !isFormValid || !amountOut}
          className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
        >
          {!isConnected ? 'Connect Wallet to Swap' : 'Swap Tokens'}
        </button>
      </div>

      {/* Quote Display (when available) */}
      {amountOut && tokenIn && tokenOut && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Rate</span>
            <span className="font-semibold text-gray-900 dark:text-white">
              1 {tokenIn.symbol} = {(parseFloat(amountOut) / parseFloat(amountIn)).toFixed(6)} {tokenOut.symbol}
            </span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">Route</span>
            <span className="font-semibold text-orange-600 dark:text-orange-400">
              ALEX {/* TODO: Show actual DEX from quote */}
            </span>
          </div>
          <div className="flex justify-between items-center">
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
