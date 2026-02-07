type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
    level: LogLevel;
    message: string;
    timestamp: string;
    context?: Record<string, any>;
    userId?: string;
}

class Logger {
    private isDevelopment = process.env.NODE_ENV === 'development';
    private logs: LogEntry[] = [];
    private maxLogs = 1000;

    private createEntry(
        level: LogLevel,
        message: string,
        context?: Record<string, any>
    ): LogEntry {
        return {
            level,
            message,
            timestamp: new Date().toISOString(),
            context,
            userId: this.getUserId(),
        };
    }

    private getUserId(): string | undefined {
        // Get anonymized user ID from localStorage
        if (typeof window === 'undefined') return undefined;

        let userId = localStorage.getItem('anonymous-user-id');
        if (!userId) {
            userId = `anon-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('anonymous-user-id', userId);
        }
        return userId;
    }

    private output(entry: LogEntry) {
        // Console output
        const style = {
            debug: 'color: #888',
            info: 'color: #0066cc',
            warn: 'color: #ff9900',
            error: 'color: #cc0000; font-weight: bold',
        }[entry.level];

        if (this.isDevelopment || entry.level !== 'debug') {
            console.log(
                `%c[${entry.level.toUpperCase()}] ${entry.message}`,
                style,
                entry.context || ''
            );
        }

        // Store in memory
        this.logs.push(entry);
        if (this.logs.length > this.maxLogs) {
            this.logs.shift();
        }

        // Send errors to Sentry
        if (entry.level === 'error' && typeof window !== 'undefined' && (window as any).Sentry) {
            (window as any).Sentry.captureMessage(entry.message, {
                level: 'error',
                contexts: {
                    log: entry.context,
                },
            });
        }
    }

    debug(message: string, context?: Record<string, any>) {
        this.output(this.createEntry('debug', message, context));
    }

    info(message: string, context?: Record<string, any>) {
        this.output(this.createEntry('info', message, context));
    }

    warn(message: string, context?: Record<string, any>) {
        this.output(this.createEntry('warn', message, context));
    }

    error(message: string, context?: Record<string, any>) {
        this.output(this.createEntry('error', message, context));
    }

    // Get recent logs for debugging
    getRecentLogs(count: number = 50): LogEntry[] {
        return this.logs.slice(-count);
    }

    // Export logs as JSON
    exportLogs(): string {
        return JSON.stringify(this.logs, null, 2);
    }

    // Clear logs
    clear() {
        this.logs = [];
    }
}

export const logger = new Logger();

// Convenience exports
export const log = {
    debug: (msg: string, ctx?: any) => logger.debug(msg, ctx),
    info: (msg: string, ctx?: any) => logger.info(msg, ctx),
    warn: (msg: string, ctx?: any) => logger.warn(msg, ctx),
    error: (msg: string, ctx?: any) => logger.error(msg, ctx),
    getRecent: (count?: number) => logger.getRecentLogs(count),
    export: () => logger.exportLogs(),
    clear: () => logger.clear(),
};
