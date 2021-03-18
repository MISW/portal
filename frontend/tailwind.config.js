module.exports = {
  purge: ["src/components/**/*.{ts,tsx}", "src/pages/**/*.{ts,tsx}"],
  darkMode: "media", // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      opacity: ["disabled"],
      textColor: ["disabled", "dark"],
      borderWidth: ["dark"],
      backgroundColor: ["disabled", "active"],
      backgroundOpacity: ["active"],
      outline: ["focus-visible"],
      cursor: ["disabled"],
    },
  },
  plugins: [],
};
