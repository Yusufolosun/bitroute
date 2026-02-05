import WalletConnect from '@/components/WalletConnect';
import SwapForm from '@/components/SwapForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                BitRoute
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Universal Liquidity Layer
              </p>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Swap Bitcoin L2 Assets
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Auto-routed across ALEX and Velar for best prices
            </p>
          </div>

          <SwapForm />
        </div>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              🎯 Best Prices
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Automatically routes through ALEX or Velar for optimal execution
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              ⚡ Fast Execution
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Powered by Stacks Nakamoto upgrade with 5-second blocks
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              🔒 Secure
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Non-custodial swaps secured by Bitcoin finality
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto py-6 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600 dark:text-gray-400">
            BitRoute - Built on Stacks • Secured by Bitcoin
          </p>
        </div>
      </footer>
    </div>
  );
}
