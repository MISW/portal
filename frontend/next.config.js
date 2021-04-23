/** @type {import('next/dist/next-server/server/config-shared')} */
module.exports = {
  future: {
    webpack5: true,
  },
  async rewrites() {
    return [{ source: "/card-image/:path*", destination: "/api/card/:path*" }];
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.png$/,
      // サーバーなら Data URL として、クライアントならよしなに
      type: isServer ? "asset/inline" : "asset",
    });
    return config;
  },
};
