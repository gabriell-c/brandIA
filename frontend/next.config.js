/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  experimental: {
    clientSegmentQueueing: true,
  },
};

module.exports = nextConfig;
