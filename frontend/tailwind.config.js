const transformer = (ext) => (content) =>
  require('@babel/core').transformSync(content, { filename: `content.${ext}` })
    .code;

/** @type{ import('tailwindcss/tailwind-config').TailwindConfig */
module.exports = {
  content: [
    'src/components/**/*.{ts,tsx}',
    'src/pages/**/*.{ts,tsx}',
  ],
  transform: {
    '.ts': transformer('ts'),
    '.tsx': transformer('tsx'),
    ts: transformer('ts'),
    tsx: transformer('tsx'),
  },
};
