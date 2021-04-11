module.exports = {
  plugins: [
    "tailwindcss",
    "postcss-flexbugs-fixes",
    "postcss-nested",
    [
      "postcss-preset-env",
      {
        autoprefixer: {
          flexbox: "no-2009",
          grid: "autoplace",
        },
        stage: 3,
        features: {
          "custom-properties": false,
        },
      },
    ],
    "postcss-focus-visible",
  ],
};
