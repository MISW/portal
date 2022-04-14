/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
  reactStrictMode: true,
  compiler: {
  },
  swcMinify: true,
  swcLoader: true,
  cpus: 8,
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
