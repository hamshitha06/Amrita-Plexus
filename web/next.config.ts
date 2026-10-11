import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow cross-origin requests from the API for images etc
  images: {
    remotePatterns: [],
  },
  async rewrites() {
    return [
      { source: '/parcels', destination: '/parcels/my-parcels' },
      { source: '/mess-menu', destination: '/hostel/mess' },
      { source: '/rides', destination: '/carpool' },
    ];
  },
};

export default nextConfig;
