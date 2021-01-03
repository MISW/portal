module.exports = {
  plugins: [
    [
      "tailwindcss",
      {
        ...require("../tailwind.config"),
        darkMode: "class",
      },
    ],
    "postcss-nested",
  ],
};
