module.exports = {
  purge: ["src/components/**/*.{ts,tsx}", "src/pages/**/*.{ts,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      borderWidth: ["dark"],
      backgroundOpacity: ["active"],
      outline: ["focus-visible"],
    },
  },
  plugins: [],
};
