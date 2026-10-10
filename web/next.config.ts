import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow cross-origin requests from the API for images etc
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
