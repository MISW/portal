const transformer = (ext) => (content) =>
  require('@babel/core').transformSync(content, { filename: `content.${ext}` })
    .code;

module.exports = {
  content: [
    'src/pages/**/*.{js,ts,jsx,tsx}',
    'src/components/**/*.{js,ts,jsx,tsx}',
  ],
  transform: {
    '.ts': transformer('ts'),
    '.tsx': transformer('tsx'),
    ts: transformer('ts'),
    tsx: transformer('tsx'),
  },
};
