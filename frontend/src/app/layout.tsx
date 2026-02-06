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
  title: "BitRoute - Universal Liquidity Layer",
  description: "Auto-route swaps across Bitcoin L2 DEXs",
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
