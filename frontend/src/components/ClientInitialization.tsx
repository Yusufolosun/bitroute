'use client';

import { useEffect } from 'react';
import { initSentry } from '@/lib/sentry';

export default function ClientInitialization() {
    useEffect(() => {
        // Initialize Sentry on client side
        initSentry();

        // Track page views/context
        if ((window as any).Sentry) {
            (window as any).Sentry.setContext('app', {
                network: process.env.NEXT_PUBLIC_NETWORK,
                version: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
            });
        }

        // Register service worker
        if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
            navigator.serviceWorker.register('/sw.js')
                .then((reg) => console.log('Service Worker registered', reg))
                .catch((err) => console.error('Service Worker registration failed', err));
        }
    }, []);

    return null;
}
