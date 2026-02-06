'use client';

import { useTransaction } from '@/contexts/TransactionContext';
import { TransactionStatus } from '@/types/transaction';
import { useEffect, useState } from 'react';

export default function TransactionToast() {
  const { current } = useTransaction();
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyTxId = () => {
    if (current?.txId) {
      navigator.clipboard.writeText(current.txId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  useEffect(() => {
    if (current) {
      setVisible(true);
    } else {
      setVisible(false);
    }
  }, [current]);

  if (!visible || !current) return null;

  const getStatusConfig = () => {
    switch (current.status) {
      case TransactionStatus.PENDING:
        return {
          bg: 'bg-blue-500',
          icon: '⏳',
          title: 'Transaction Pending',
          message: 'Waiting for blockchain confirmation...',
          showSpinner: true,
        };
      case TransactionStatus.SUCCESS:
        return {
          bg: 'bg-green-500',
          icon: '✅',
          title: 'Swap Successful!',
          message: `${current.tokenIn} → ${current.tokenOut} completed`,
          showSpinner: false,
        };
      case TransactionStatus.FAILED:
        return {
          bg: 'bg-red-500',
          icon: '❌',
          title: 'Transaction Failed',
          message: current.error || 'Please try again',
          showSpinner: false,
        };
      default:
        return null;
    }
  };

  const config = getStatusConfig();
  if (!config) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 min-w-[320px] max-w-xs rounded-lg shadow-lg text-white animate-slide-up ${config.bg}`}>
      <div className="flex items-center gap-3 px-5 py-4">
        <span className="text-2xl">{config.icon}</span>
        <div className="flex-1">
          <div className="font-bold text-base">{config.title}</div>
          <p className="text-sm opacity-90 mb-2">
            {current.status === TransactionStatus.SUCCESS && (
              <span className="font-semibold">
                {current.amountIn} {current.tokenIn} → {current.amountOut} {current.tokenOut}
              </span>
            )}
            {config.message}
          </p>
          {current.txId && (
            <div className="flex gap-2 items-center">
              <a
                href={`https://explorer.hiro.so/txid/${current.txId}?chain=testnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs underline opacity-75 hover:opacity-100 flex-1"
              >
                View on Explorer →
              </a>
              <button
                onClick={copyTxId}
                className="text-xs px-2 py-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
              >
                {copied ? '✓ Copied' : 'Copy ID'}
              </button>
            </div>
          )}
        </div>
        {config.showSpinner && (
          <span className="ml-2 animate-spin">🔄</span>
        )}
      </div>
    </div>
  );
}
