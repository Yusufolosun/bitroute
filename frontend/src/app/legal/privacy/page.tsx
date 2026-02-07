import Link from 'next/link';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Link href="/" className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2">
                        ← Back to App
                    </Link>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl overflow-hidden">
                    <div className="bg-blue-600 px-8 py-10 text-white">
                        <h1 className="text-3xl font-bold">Privacy Policy</h1>
                        <p className="mt-2 opacity-80">Last Updated: February 7, 2026</p>
                    </div>

                    <div className="p-8 md:p-12 prose dark:prose-invert max-w-none">
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                            BitRoute respects your privacy. This policy explains what data we collect and how we use it.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">1. What We Collect</h2>
                        <p>
                            <strong>Anonymous Analytics:</strong> Page views, feature usage, error reports, and aggregated transaction success rates.
                        </p>
                        <p>
                            <strong>What We DO NOT Collect:</strong> We never collect names, email addresses, wallet addresses (stored only in your browser), or private keys.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">2. Blockchain Data</h2>
                        <p>
                            All blockchain transactions are public. Anyone can see swap transactions. Wallet addresses are pseudonymous, and we do not link them to identities.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">3. How We Use Data</h2>
                        <p>
                            We use analytics data to improve user experience, fix bugs, and monitor system health. We do not sell data to third parties.
                        </p>

                        <h2 className="text-xl font-bold mt-8 mb-4">4. Cookies</h2>
                        <p>
                            We use cookies for session management and basic user preferences. You can disable them in your browser.
                        </p>

                        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700">
                            <p className="text-sm text-gray-500">
                                Privacy concerns? Contact privacy@bitroute.io
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
