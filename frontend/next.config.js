const withTM = require("next-transpile-modules")(["ky"]);

/** @type {import('next/dist/next-server/server/config-shared')} */
const config = {
  async rewrites() {
    return [{ source: "/card-image/:path*", destination: "/api/card/:path*" }];
  },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.png$/,
      // サーバーなら Data URL として、クライアントならよしなに
      ...(isServer
        ? { type: "asset/inline" }
        : {
            type: "asset/resource",
            generator: {
              filename: "static/images/[hash][ext][query]",
            },
          }),
    });
    return config;
  },
};

module.exports = withTM(config);
