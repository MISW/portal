/** @type{ import('tailwindcss/tailwind-config').TailwindConfig */
module.exports = {
  mode: "jit",
  purge: ["src/components/**/*.{ts,tsx}", "src/pages/**/*.{ts,tsx}"],
  darkMode: "media",
};
