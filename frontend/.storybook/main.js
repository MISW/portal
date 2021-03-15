const path = require("path");

module.exports = {
  stories: ["../src/**/*.stories.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    {
      name: "@storybook/addon-essentials",
      options: {
        backgrounds: false,
      },
    },
    "storybook-dark-mode/register",
  ],
  webpackFinal: async (config) => {
    // パス解決できるようにする
    config.resolve.modules.push(path.resolve("./src"));

    // *.cssにマッチする正規表現を持つRuleを探す
    const cssRules = config.module.rules.filter((rule) =>
      rule.test.test(".css")
    );
    for (const rule of cssRules) {
      // PostCSS@8を使う
      const postCSSLoaderIndex = rule.use.findIndex(
        (l) => l?.loader?.includes("/postcss-loader/") ?? false
      );
      // @storybook/coreの持つpostcss-loaderはStorybookのpostcssを参照しているので、ルートのpostcss-loaderにしてしまう
      rule.use[postCSSLoaderIndex] = {
        loader: "postcss-loader",
        options: {
          postcssOptions: require("./postcss.config.js"),
        },
      };

      // CSS Modulesを使う
      const cssLoader = rule.use.find((l) =>
        l?.loader?.includes("/css-loader/")
      );
      cssLoader.options.modules = {
        auto: true,
        localIdentName: "[name]__[local]--[hash:base64:5]",
      };
    }

    return config;
  },
};
