import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Railway/Docker deployment
  output: process.env.RAILWAY_ENVIRONMENT ? 'standalone' : undefined,

  // Optimize for production
  poweredByHeader: false,

  // Enable React strict mode
  reactStrictMode: true,
};

export default nextConfig;
