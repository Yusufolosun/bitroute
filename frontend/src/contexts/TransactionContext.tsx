'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Transaction, TransactionStatus, TransactionState } from '@/types/transaction';

interface TransactionContextType extends TransactionState {
  addTransaction: (tx: Omit<Transaction, 'status' | 'timestamp'>) => void;
  updateTransactionStatus: (txId: string, status: TransactionStatus, error?: string) => void;
  clearCurrent: () => void;
  clearHistory: () => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export function TransactionProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Transaction | null>(null);
  const [history, setHistory] = useState<Transaction[]>([]);

  const addTransaction = (tx: Omit<Transaction, 'status' | 'timestamp'>) => {
    const newTx: Transaction = {
      ...tx,
      status: TransactionStatus.PENDING,
      timestamp: Date.now(),
    };
    setCurrent(newTx);
  };

  const updateTransactionStatus = (txId: string, status: TransactionStatus, error?: string) => {
    setCurrent(prev => {
      if (!prev || prev.txId !== txId) return prev;
      const updated = { ...prev, status, error };
      // Move to history if completed
      if (status === TransactionStatus.SUCCESS || status === TransactionStatus.FAILED) {
        setHistory(h => [updated, ...h].slice(0, 10)); // Keep last 10
        setTimeout(() => setCurrent(null), 3000); // Clear after 3s
      }
      return updated;
    });
  };

  const clearCurrent = () => setCurrent(null);
  const clearHistory = () => setHistory([]);

  return (
    <TransactionContext.Provider value={{ current, history, addTransaction, updateTransactionStatus, clearCurrent, clearHistory }}>
      {children}
    </TransactionContext.Provider>
  );
}

export function useTransaction() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransaction must be used within TransactionProvider');
  }
  return context;
}
