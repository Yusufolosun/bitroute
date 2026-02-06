'use client';

import { useTransaction } from '@/contexts/TransactionContext';
import { TransactionStatus } from '@/types/transaction';

export default function TransactionHistory() {
  const { history, clearHistory } = useTransaction();
  const [filter, setFilter] = useState<TransactionStatus | 'all'>('all');

  // Sort by timestamp descending
  const sortedHistory = [...history].sort((a, b) => b.timestamp - a.timestamp);
  // Filter by status
  const filteredHistory = sortedHistory.filter(
    tx => filter === 'all' || tx.status === filter
  );

  const getStatusBadge = (status: TransactionStatus) => {
    const configs = {
      [TransactionStatus.SUCCESS]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      [TransactionStatus.FAILED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      [TransactionStatus.PENDING]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      [TransactionStatus.IDLE]: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    };
    return (
      <span className={`px-2 py-1 rounded text-xs font-semibold ${configs[status]}`}>{status}</span>
    );
  };

  if (history.length === 0) return null;

  return (
    <div className="mt-8 bg-white dark:bg-gray-900 rounded-xl shadow p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-semibold text-gray-900 dark:text-white">Recent Transactions</span>
        <button
          onClick={clearHistory}
          className="text-xs text-gray-400 hover:text-red-500 dark:hover:text-red-300"
        >
          Clear
        </button>
      </div>
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1 text-xs rounded ${
            filter === 'all' 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          All
        </button>
        <button
          onClick={() => setFilter(TransactionStatus.SUCCESS)}
          className={`px-3 py-1 text-xs rounded ${
            filter === TransactionStatus.SUCCESS
              ? 'bg-green-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Success
        </button>
        <button
          onClick={() => setFilter(TransactionStatus.FAILED)}
          className={`px-3 py-1 text-xs rounded ${
            filter === TransactionStatus.FAILED
              ? 'bg-red-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          Failed
        </button>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-gray-800">
        {filteredHistory.map((tx, index) => (
          <div key={tx.txId} className="py-2 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 dark:text-gray-200">{tx.tokenIn} → {tx.tokenOut}</span>
                {getStatusBadge(tx.status)}
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{tx.amountIn} {tx.tokenIn} via {tx.dex}</span>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">{new Date(tx.timestamp).toLocaleTimeString()}</span>
            <a
              href={`https://explorer.hiro.so/txid/${tx.txId}?chain=testnet`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-orange-600 dark:text-orange-400 hover:underline"
            >
              {tx.txId.slice(0, 8)}...{tx.txId.slice(-8)} →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
