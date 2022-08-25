/**
 * @type {import('next').NextConfig}
 **/

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    swcTraceProfiling: true,
  },
  compiler: {
    emotion: true,
  },
  async rewrites() {
    return [
      {
        source: '/card-image/:path*',
        destination: '/api/card/:path*',
      },
    ]
  },
};

module.exports = nextConfig;
