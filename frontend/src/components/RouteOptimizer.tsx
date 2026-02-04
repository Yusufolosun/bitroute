'use client';

import { useState } from 'react';
import { useStacks } from '@/lib/hooks/useStacks';

export default function RouteOptimizer() {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [fee, setFee] = useState('');
  const [routes, setRoutes] = useState<any[]>([]);
  const { address, connect, createRoute, getRoute } = useStacks();

  const handleCreateRoute = async () => {
    if (!source || !destination || !fee) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const result = await createRoute(source, destination, parseInt(fee));
      alert(`Route created successfully! Route ID: ${result}`);
      setSource('');
      setDestination('');
      setFee('');
    } catch (error) {
      console.error('Error creating route:', error);
      alert('Failed to create route');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Wallet Connection */}
      <div className="bg-gray-800 rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Connect Wallet</h2>
        {!address ? (
          <button
            onClick={connect}
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Connect Stacks Wallet
          </button>
        ) : (
          <div className="text-green-400">
            Connected: {address.substring(0, 8)}...{address.substring(address.length - 8)}
          </div>
        )}
      </div>

      {/* Create Route Form */}
      {address && (
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Create New Route</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Source Address</label>
              <input
                type="text"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                placeholder="Enter source Bitcoin address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Destination Address</label>
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                placeholder="Enter destination Bitcoin address"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Fee (in satoshis)</label>
              <input
                type="number"
                value={fee}
                onChange={(e) => setFee(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:border-orange-500"
                placeholder="Enter fee amount"
              />
            </div>
            <button
              onClick={handleCreateRoute}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Create Route
            </button>
          </div>
        </div>
      )}

      {/* Routes List */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Active Routes</h2>
        {routes.length === 0 ? (
          <p className="text-gray-400">No routes yet. Create one to get started!</p>
        ) : (
          <div className="space-y-4">
            {routes.map((route, index) => (
              <div key={index} className="bg-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Route #{route.id}</p>
                    <p className="text-sm text-gray-300">
                      {route.source} → {route.destination}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-orange-400 font-semibold">{route.fee} sats</p>
                    <p className="text-xs text-gray-400">
                      {route.active ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
