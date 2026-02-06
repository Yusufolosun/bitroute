'use client';

import { useState } from 'react';

export interface Token {
  symbol: string;
  name: string;
  address?: string;
  decimals: number;
}

interface TokenSelectorProps {
  selectedToken: Token | null;
  onSelectToken: (token: Token) => void;
  label: string;
  disabled?: boolean;
}

// Mock tokens for now (will be from constants later)
const AVAILABLE_TOKENS: Token[] = [
  { symbol: 'STX', name: 'Stacks', decimals: 6, address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.stx-token' },
  { symbol: 'USDA', name: 'USD Arkadiko', decimals: 6, address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.usda-token' },
  { symbol: 'sBTC', name: 'Synthetic Bitcoin', decimals: 8, address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM.sbtc-token' },
];

export default function TokenSelector({
  selectedToken,
  onSelectToken,
  label,
  disabled = false,
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (token: Token) => {
    onSelectToken(token);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      
      <button
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className="w-full px-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-between hover:border-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {selectedToken ? (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
              {selectedToken.symbol.charAt(0)}
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">
              {selectedToken.symbol}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {selectedToken.name}
            </span>
          </div>
        ) : (
          <span className="text-gray-500 dark:text-gray-400">Select token</span>
        )}
        
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown menu */}
          <div className="absolute z-20 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl">
            {AVAILABLE_TOKENS.map((token) => (
              <button
                key={token.symbol}
                onClick={() => handleSelect(token)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  {token.symbol.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="font-semibold text-gray-900 dark:text-white">
                    {token.symbol}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {token.name}
                  </div>
                </div>
                {selectedToken?.symbol === token.symbol && (
                  <svg className="w-5 h-5 ml-auto text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
