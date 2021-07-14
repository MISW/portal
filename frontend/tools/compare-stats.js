const fs = require("fs");
const prettier = require("prettier");

// 200B未満なら0とみなす
const THRESHOLD = 200;

const units = ["B", "KiB", "MiB", "GiB"];
const formatSize = (size, signed) => {
  const sign = signed ? (size >= 0 ? "+" : "-") : "";
  size = Math.abs(size);
  if (size < THRESHOLD) return "0";
  rank = 0;
  while (size > 1024 && rank < units.length) {
    size /= 1024;
    rank++;
  }

  return `${sign}${size.toFixed(2)}${units[rank]}`;
};

const baseStatsName = process.argv[process.argv.length - 2];
const statsName = process.argv[process.argv.length - 1];

const baseStats = fs.existsSync(baseStatsName)
  ? JSON.parse(fs.readFileSync(baseStatsName))
  : undefined;
const stats = fs.existsSync(statsName)
  ? JSON.parse(fs.readFileSync(statsName))
  : undefined;

const row = (page) => {
  const pageStat = stats[page];
  const base = baseStats[page];

  const rawSize = formatSize(pageStat.raw, false);
  const rawDiff =
    base != null ? `(${formatSize(pageStat.raw - base.raw, true)})` : "";

  const gzippedSize = formatSize(pageStat.gzipped, false);
  const gzippedDiff =
    base != null
      ? `(${formatSize(pageStat.gzipped - base.gzipped, true)})`
      : "";

  return `| ${page} | ${rawSize + rawDiff} | ${gzippedSize + gzippedDiff} |`;
};

const output = `
| Route | Size | Size(gzipped) |
| ----- | ---- | ------------- |
${Object.keys(stats).reduce((pre, page) => pre + row(page) + "\n", "")}
`;

process.stdout.write(prettier.format(output, { parser: "markdown" }));
