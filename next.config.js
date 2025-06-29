/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
  // Enable React strict mode
  reactStrictMode: true,
  // Enable TypeScript type checking during build
  typescript: {
    ignoreBuildErrors: false,
  },
  // Enable ESLint during build
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Environment variables that should be available on the client side
  env: {
    // Add any environment variables that should be available on the client side
  },
  // Configure webpack to handle Prisma client properly
  experimental: {
    esmExternals: false,
  },
};

module.exports = nextConfig;
