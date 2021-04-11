/** @type{ import('tailwindcss/tailwind-config').TailwindConfig */
module.exports = {
  purge: ["src/components/**/*.{ts,tsx}", "pages/**/*.{ts,tsx}"],
  darkMode: "media",
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
};
