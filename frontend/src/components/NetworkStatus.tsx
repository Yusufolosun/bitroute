'use client';

import { DEFAULT_NETWORK } from '@/lib/constants';

export default function NetworkStatus() {
  const getNetworkColor = () => {
    switch (DEFAULT_NETWORK) {
      case 'mainnet':
        return 'bg-green-500';
      case 'testnet':
        return 'bg-yellow-500';
      case 'devnet':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm ${getNetworkColor()}`}>
      <span className="w-2 h-2 rounded-full bg-white/80"></span>
      {DEFAULT_NETWORK}
    </div>
  );
}
