'use client';

import { useState, useEffect } from 'react';

export default function LegalDisclaimer() {
  const [accepted, setAccepted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasAccepted = localStorage.getItem('legal-accepted');
    if (hasAccepted) {
      setAccepted(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('legal-accepted', 'true');
    setAccepted(true);
  };

  if (!mounted || accepted) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            ⚠️ Important Legal Notice
          </h2>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="prose dark:prose-invert max-w-none">
            <h3 className="text-lg font-semibold mb-2">Before Using BitRoute, You Must Acknowledge:</h3>
            
            <h4 className="font-bold text-red-600 dark:text-red-400 mt-4">🔴 High Risk</h4>
            <ul className="list-disc ml-6 mb-4">
              <li>Cryptocurrency trading involves substantial risk of loss</li>
              <li>You may lose all funds you use with this service</li>
              <li>Smart contracts may contain bugs despite auditing</li>
            </ul>

            <h4 className="font-bold text-blue-600 dark:text-blue-400 mt-4">🔒 Your Responsibility</h4>
            <ul className="list-disc ml-6 mb-4">
              <li>Securing your wallet and private keys</li>
              <li>Understanding slippage and transaction risks</li>
              <li>Verifying all transaction details before signing</li>
              <li>Compliance with your local laws and regulations</li>
            </ul>

            <h4 className="font-bold text-gray-700 dark:text-gray-300 mt-4">📋 No Guarantees</h4>
            <ul className="list-disc ml-6 mb-4">
              <li>We do NOT guarantee best prices or successful transactions</li>
              <li>Service may be unavailable at any time</li>
              <li>Transactions are irreversible</li>
            </ul>

            <h4 className="font-bold mt-6">⚖️ Legal Agreement</h4>
            <p className="mb-4">
              By clicking "I Accept", you agree to our{' '}
              <a href="/legal/terms" target="_blank" className="text-orange-600 hover:underline">
                Terms of Service
              </a>
              ,{' '}
              <a href="/legal/privacy" target="_blank" className="text-orange-600 hover:underline">
                Privacy Policy
              </a>
              , and{' '}
              <a href="/legal/risks" target="_blank" className="text-orange-600 hover:underline">
                Risk Disclosure
              </a>
              .
            </p>

            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 my-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 font-semibold text-center">
                ⚠️ This service is provided "AS IS" without warranty. Use at your own risk.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex gap-3">
          <button
            onClick={() => window.location.href = 'https://google.com'}
            className="flex-1 py-3 px-4 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            I Do Not Accept
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-semibold transition-colors shadow-lg hover:shadow-orange-500/30"
          >
            I Accept and Understand the Risks
          </button>
        </div>
      </div>
    </div>
  );
}
