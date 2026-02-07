import { trackEvent } from './analytics';

// Web Vitals tracking
export function reportWebVitals(metric: any) {
    if (process.env.NODE_ENV === 'production') {
        // Track Core Web Vitals
        switch (metric.name) {
            case 'FCP': // First Contentful Paint
            case 'LCP': // Largest Contentful Paint
            case 'CLS': // Cumulative Layout Shift
            case 'FID': // First Input Delay
            case 'TTFB': // Time to First Byte
                trackEvent('web_vital', {
                    event_category: 'performance',
                    event_label: metric.name,
                    value: Math.round(metric.value),
                    metric_id: metric.id,
                    metric_rating: metric.rating,
                });
                break;
            default:
                break;
        }
    }
}

// Track function performance
export function measurePerformance<T>(
    functionName: string,
    fn: () => Promise<T>
): Promise<T> {
    const start = performance.now();

    return fn().then(
        (result) => {
            const duration = performance.now() - start;

            trackEvent('function_performance', {
                event_category: 'performance',
                event_label: functionName,
                value: Math.round(duration),
            });

            return result;
        },
        (error) => {
            const duration = performance.now() - start;

            trackEvent('function_error', {
                event_category: 'performance',
                event_label: functionName,
                value: Math.round(duration),
                error: error.message,
            });

            throw error;
        }
    );
}

// Monitor API call performance
export async function monitoredFetch(
    url: string,
    options?: RequestInit
): Promise<Response> {
    const start = performance.now();
    const endpoint = new URL(url).pathname;

    try {
        const response = await fetch(url, options);
        const duration = performance.now() - start;

        trackEvent('api_call', {
            event_category: 'performance',
            event_label: endpoint,
            value: Math.round(duration),
            status: response.status,
        });

        return response;
    } catch (error) {
        const duration = performance.now() - start;

        trackEvent('api_call_failed', {
            event_category: 'performance',
            event_label: endpoint,
            value: Math.round(duration),
            error: (error as Error).message,
        });

        throw error;
    }
}
