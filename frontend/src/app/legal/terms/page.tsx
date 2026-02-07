import Link from 'next/link';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2">
                        ← Back to App
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-orange-600 px-8 py-10 text-white">
                        <h1 className="text-3xl font-bold">Terms of Service</h1>
                        <p className="mt-2 opacity-80">Last Updated: February 7, 2026</p>
                    </div>

                    <div className="p-8 md:p-12 prose dark:prose-invert max-w-none">
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            By accessing or using BitRoute ("Service"), you agree to these Terms of Service ("Terms"). If you do not agree, do not use the Service.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">1. Description of Service</h2>
                        <p>
                            BitRoute is a decentralized exchange aggregator that routes token swaps through multiple DEXs on the Stacks blockchain to find optimal prices.
                        </p>
                        <p>
                            <strong>The Service:</strong>
                        </p>
                        <ul>
                            <li>Provides price quotes across multiple DEXs</li>
                            <li>Routes swap transactions to the best available DEX</li>
                            <li>Does NOT custody user funds</li>
                            <li>Does NOT provide financial advice</li>
                        </ul>

                        <h2 className="text-xl font-bold mt-8 mb-4">2. Eligibility</h2>
                        <p>
                            You must be 18 years or older, have legal capacity to enter contracts, and not be in a jurisdiction where the Service is prohibited.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">3. Risks and Disclaimers</h2>
                        <p>
                            Cryptocurrency trading involves substantial risk. You may lose all funds. Smart contracts may contain bugs. Blockchain networks may experience downtime. Transactions are irreversible.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">4. No Warranty</h2>
                        <p>
                            THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. We do not warrant uninterrupted service, error-free operation, or security against all attacks.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">5. Limitation of Liability</h2>
                        <p>
                            TO THE MAXIMUM EXTENT PERMITTED BY LAW: We are NOT liable for loss of funds, failed transactions, price slippage, front-running, or smart contract bugs.
                        </p>

                        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-gray-500">
                                Questions? Contact legal@bitroute.io
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
