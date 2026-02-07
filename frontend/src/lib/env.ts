// Environment variable validation

const requiredEnvVars = {
    NEXT_PUBLIC_NETWORK: ['mainnet', 'testnet', 'devnet'],
    NEXT_PUBLIC_STACKS_API_URL: null, // Any URL
} as const;

const optionalEnvVars = {
    NEXT_PUBLIC_GA_ID: null,
    NEXT_PUBLIC_SENTRY_DSN: null,
} as const;

export function validateEnv() {
    const errors: string[] = [];

    // Check required vars
    Object.entries(requiredEnvVars).forEach(([key, allowedValues]) => {
        const value = process.env[key];

        if (!value) {
            errors.push(`Missing required environment variable: ${key}`);
        } else if (allowedValues && !allowedValues.includes(value as any)) {
            errors.push(`Invalid value for ${key}. Must be one of: ${allowedValues.join(', ')}`);
        }
    });

    // Warn about missing optional vars
    Object.keys(optionalEnvVars).forEach((key) => {
        if (!process.env[key]) {
            console.warn(`⚠️ Optional environment variable not set: ${key}`);
        }
    });

    if (errors.length > 0) {
        throw new Error(
            `Environment validation failed:\n${errors.join('\n')}`
        );
    }

    console.log('✅ Environment variables validated');
}

// Validate on import (build-time check)
if (process.env.NODE_ENV !== 'test') {
    try {
        validateEnv();
    } catch (err) {
        console.error(err);
    }
}
