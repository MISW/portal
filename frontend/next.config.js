/**
 * @type {import('next').NextConfig}
 **/

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  staticPageGenerationTimeout: 240,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    swcTraceProfiling: true,
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
