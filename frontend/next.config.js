module.exports = {
  future: {
    webpack5: true,
  },
  async rewrites() {
    return [{ source: "/card-image/:path*", destination: "/api/card/:path*" }];
  },
};
