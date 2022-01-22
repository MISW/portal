const withTM = require("next-transpile-modules")(["ky"]);

/** @type {import('next/dist/next-server/server/config-shared')} */
const config = {
  reactStrictMode: true,
  async rewrites() {
    return [{ source: "/card-image/:path*", destination: "/api/card/:path*" }];
  },
};

module.exports = withTM(config);
