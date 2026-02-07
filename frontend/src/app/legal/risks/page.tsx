import Link from 'next/link';

export default function RiskPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2">
                        ← Back to App
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-red-600 px-8 py-10 text-white">
                        <h1 className="text-3xl font-bold">Risk Disclosure</h1>
                        <p className="mt-2 opacity-80">Last Updated: February 7, 2026</p>
                    </div>

                    <div className="p-8 md:p-12 prose dark:prose-invert max-w-none">
                        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-6 mb-8 rounded-r-lg">
                            <p className="text-red-800 dark:text-red-200 font-bold uppercase tracking-wide text-sm mb-2">Important Warning</p>
                            <p className="text-red-700 dark:text-red-300 font-medium">READ CAREFULLY BEFORE USING BITROUTE. Cryptocurrency trading involves substantial risk of loss.</p>
                        </div>

                        <h2 className="text-xl font-bold mt-8 mb-4">General Risks</h2>
                        <p>
                            <strong>Volatility:</strong> Prices are extremely volatile. You may lose all capital.
                        </p>
                        <p>
                            <strong>Irreversibility:</strong> Transactions cannot be reversed. Lost funds cannot be recovered.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">Smart Contract Risk</h2>
                        <p>
                            Smart contracts may contain unknown bugs. Exploits could result in loss of funds. Audits reduce but do not eliminate risk.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">DEX Aggregation Risks</h2>
                        <p>
                            <strong>Slippage:</strong> Actual price may differ from quoted price.
                        </p>
                        <p>
                            <strong>Front-Running:</strong> MEV bots may front-run your transactions.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">Mitigation Strategies</h2>
                        <ul>
                            <li>Start Small: Test with small amounts.</li>
                            <li>Use Hardware Wallets for significant amounts.</li>
                            <li>Set Slippage: Protect against price manipulation.</li>
                            <li>Verify Transactions before signing.</li>
                        </ul>

                        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 text-center">
                            <p className="text-gray-500 font-bold italic">
                                Don't invest more than you can afford to lose.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
