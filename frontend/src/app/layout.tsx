import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { WalletProvider } from "@/contexts/WalletContext";
import { TransactionProvider } from "@/contexts/TransactionContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BitRoute - Universal Liquidity Layer for Bitcoin L2s",
  description: "Auto-route token swaps across ALEX and Velar DEXs on Stacks blockchain for best prices. Non-custodial, secure, and Bitcoin-powered DeFi aggregator.",
  keywords: ["DeFi", "DEX aggregator", "Stacks", "Bitcoin", "ALEX", "Velar", "cryptocurrency", "trading"],
  authors: [{ name: "BitRoute Team" }],
  openGraph: {
    title: "BitRoute - DEX Aggregator for Stacks",
    description: "Get the best prices for token swaps on Stacks blockchain",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BitRoute - Universal Liquidity Layer",
    description: "Auto-route swaps across ALEX and Velar for best prices",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ErrorBoundary>
          <WalletProvider>
            <TransactionProvider>
              {children}
            </TransactionProvider>
          </WalletProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}
