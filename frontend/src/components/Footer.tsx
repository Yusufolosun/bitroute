import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold">B</div>
                            <h3 className="font-bold text-gray-900 dark:text-white text-xl">
                                BitRoute
                            </h3>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                            Universal Liquidity Layer for Bitcoin Layer 2s. Find the best rates across all major Stacks DEXs in one click.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-xs">
                            Legal
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/legal/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/legal/risks" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                    Risk Disclosure
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-4 uppercase tracking-wider text-xs">
                            Resources
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="https://docs.bitroute.io" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                    Documentation
                                </Link>
                            </li>
                            <li>
                                <Link href="https://github.com/yusufolosun/bitroute" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                    GitHub
                                </Link>
                            </li>
                            <li>
                                <Link href="https://twitter.com/bitroute" className="text-sm text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400 transition-colors">
                                    Twitter
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            © {new Date().getFullYear()} BitRoute. Built on Stacks.
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 px-3 py-1 rounded-full border border-gray-100 dark:border-gray-800">
                            ⚠️ Use at your own risk. Not financial advice.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
