import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { WalletProvider } from "@/contexts/WalletContext";
import { TransactionProvider } from "@/contexts/TransactionContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import ClientInitialization from "@/components/ClientInitialization";
import { validateEnv } from '@/lib/env';
import Script from 'next/script';
import { GA_TRACKING_ID } from '@/lib/analytics';
import { reportWebVitals } from '@/lib/performance';
import "./globals.css";

// Validate environment on backend start
if (typeof window === 'undefined') {
  validateEnv();
}

export { reportWebVitals };

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
      <head>
        <ClientInitialization />
        {/* Google Analytics */}
        {GA_TRACKING_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                  anonymize_ip: true,
                });
              `}
            </Script>
          </>
        )}
      </head >
      <body className={inter.className}>
        <ErrorBoundary>
          <WalletProvider>
            <TransactionProvider>
              {children}
            </TransactionProvider>
          </WalletProvider>
        </ErrorBoundary>
      </body>
    </html >
  );
}
