'use client';

import { useTransaction } from '@/contexts/TransactionContext';
import { TransactionStatus } from '@/types/transaction';
import { useEffect, useState } from 'react';

export default function TransactionToast() {
  const { current } = useTransaction();
  const [visible, setVisible] = useState(false);

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
          message: 'Waiting for confirmation...',
        };
      case TransactionStatus.SUCCESS:
        return {
          bg: 'bg-green-500',
          icon: '✅',
          title: 'Swap Successful',
          message: 'Your tokens have been swapped',
        };
      case TransactionStatus.FAILED:
        return {
          bg: 'bg-red-500',
          icon: '❌',
          title: 'Transaction Failed',
          message: current.error || 'Something went wrong',
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
          <div className="text-sm opacity-90">{config.message}</div>
          {current.txId && (
            <a
              href={`https://explorer.hiro.so/txid/${current.txId}?chain=testnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs underline opacity-75 hover:opacity-100"
            >
              View on Explorer →
            </a>
          )}
        </div>
        {current.status === TransactionStatus.PENDING && (
          <span className="ml-2 animate-spin">🔄</span>
        )}
      </div>
    </div>
  );
}
