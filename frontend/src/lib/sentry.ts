import * as Sentry from "@sentry/nextjs";

export function initSentry() {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        Sentry.init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

            // Performance Monitoring
            tracesSampleRate: 1.0,

            // Error filtering
            beforeSend(event, hint) {
                // Don't send user-cancelled transactions
                if (event.message?.includes('User rejected')) {
                    return null;
                }

                // Don't send network errors from dev
                if (process.env.NODE_ENV === 'development') {
                    return null;
                }

                return event;
            },

            // Release tracking
            release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA,
            environment: process.env.NEXT_PUBLIC_NETWORK || 'development',

            // User context (privacy-safe)
            beforeBreadcrumb(breadcrumb, hint) {
                // Don't log wallet addresses
                if (breadcrumb.message?.includes('ST') || breadcrumb.message?.includes('SP')) {
                    breadcrumb.message = '[WALLET ADDRESS REDACTED]';
                }
                return breadcrumb;
            },
        });
    }
}

// Custom error tracking functions
export function captureSwapError(error: Error, context: {
    tokenIn: string;
    tokenOut: string;
    amount: string;
}) {
    Sentry.captureException(error, {
        tags: {
            errorType: 'swap_failed',
        },
        contexts: {
            swap: {
                tokenIn: context.tokenIn,
                tokenOut: context.tokenOut,
                amount: context.amount,
            },
        },
    });
}

export function captureContractError(error: Error, contractFunction: string) {
    Sentry.captureException(error, {
        tags: {
            errorType: 'contract_call_failed',
            function: contractFunction,
        },
    });
}

export function captureQuoteError(error: Error, dex: string) {
    Sentry.captureException(error, {
        tags: {
            errorType: 'quote_failed',
            dex,
        },
    });
}
