export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    console.log('📊 Event:', eventName, properties);
    // TODO: Integrate with analytics service (GA4, Mixpanel, etc.)
  }
};

export const trackSwap = (data: {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  dex: string;
}) => {
  trackEvent('swap_executed', data);
};

export const trackQuote = (data: {
  tokenIn: string;
  tokenOut: string;
  bestDex: string;
}) => {
  trackEvent('quote_requested', data);
};

export const trackWalletConnect = (walletType: string) => {
  trackEvent('wallet_connected', { walletType });
};
