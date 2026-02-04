'use client';

import { useConnect } from '@/hooks/useConnect';

export default function WalletConnect() {
  const { userAddress, isConnected, connect, disconnect } = useConnect();

  // Format address for display (ST1...GZGM)
  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  if (isConnected && userAddress) {
    return (
      <div className="flex items-center gap-3">
        <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <p className="text-sm font-mono text-gray-700 dark:text-gray-300">
            {formatAddress(userAddress)}
          </p>
        </div>
        <button
          onClick={disconnect}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
    >
      Connect Wallet
    </button>
  );
}
