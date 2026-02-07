/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      crypto: false,
      stream: false,
      assert: false,
      http: false,
      https: false,
      os: false,
      url: false,
      fs: false,
      net: false,
      tls: false,
    };
    return config;
  },

  // Production optimizations
  compiler: {
    // Remove console.log in production but keep errors/warnings
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Image optimization for potential token icons
  images: {
    domains: ['bitroute.io'],
    formats: ['image/avif', 'image/webp'],
  },

  // Enable compression
  compress: true,

  // Add bundle analyzer support if ANALYZE env is set
  poweredByHeader: false,
}

// Add bundle analyzer if needed
if (process.env.ANALYZE === 'true') {
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  })
  module.exports = withBundleAnalyzer(nextConfig)
} else {
  module.exports = nextConfig
}
