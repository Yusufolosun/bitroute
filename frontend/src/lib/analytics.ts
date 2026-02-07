// Google Analytics 4
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    dataLayer: any[];
  }
}

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;

// Initialize GA4
export function initGA() {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_TRACKING_ID, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure',
  });
}

// Page view tracking
export function trackPageView(url: string) {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return;

  window.gtag('config', GA_TRACKING_ID, {
    page_path: url,
  });
}

// Event tracking with enhanced properties
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (!GA_TRACKING_ID || typeof window === 'undefined') return;

  console.log('📊 Event:', eventName, properties);

  window.gtag('event', eventName, {
    ...properties,
    network: process.env.NEXT_PUBLIC_NETWORK,
    timestamp: Date.now(),
  });
};

// Specific event trackers
export const trackSwap = (data: {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  dex: string;
  txId?: string;
}) => {
  trackEvent('swap_executed', {
    event_category: 'swap',
    event_label: `${data.tokenIn}_${data.tokenOut}`,
    value: parseFloat(data.amountIn),
    dex: data.dex,
    tx_id: data.txId,
  });
};

export const trackQuote = (data: {
  tokenIn: string;
  tokenOut: string;
  bestDex: string;
  alexQuote: string;
  velarQuote: string;
}) => {
  trackEvent('quote_requested', {
    event_category: 'quote',
    event_label: `${data.tokenIn}_${data.tokenOut}`,
    best_dex: data.bestDex,
    alex_quote: data.alexQuote,
    velar_quote: data.velarQuote,
  });
};

export const trackWalletConnect = (walletType: string) => {
  trackEvent('wallet_connected', {
    event_category: 'wallet',
    event_label: walletType,
  });
};

export const trackWalletDisconnect = () => {
  trackEvent('wallet_disconnected', {
    event_category: 'wallet',
  });
};

export const trackError = (error: {
  type: string;
  message: string;
  component?: string;
}) => {
  trackEvent('error_occurred', {
    event_category: 'error',
    event_label: error.type,
    error_message: error.message,
    component: error.component,
  });
};

export const trackSlippageChange = (slippage: string) => {
  trackEvent('slippage_changed', {
    event_category: 'settings',
    value: parseFloat(slippage),
  });
};

export const trackNetworkSwitch = (network: string) => {
  trackEvent('network_switched', {
    event_category: 'settings',
    event_label: network,
  });
};
