const fs = require("fs");
const prettier = require("prettier");

const units = ["B", "KiB", "MiB", "GiB"];
const formatSize = (size, signed) => {
  if (signed && Math.abs(size) <= 10) return "=";
  const sign = size < 0 ? "-" : signed ? "+" : "";
  size = Math.abs(size);
  rank = 0;
  while (size > 1024 && rank < units.length) {
    size /= 1024;
    rank++;
  }

  return `${sign}${size.toFixed(2)} ${units[rank]}`;
};

const baseStatsName = process.argv[process.argv.length - 2];
const statsName = process.argv[process.argv.length - 1];

let baseStats = fs.existsSync(baseStatsName)
  ? JSON.parse(fs.readFileSync(baseStatsName))
  : undefined;
const stats = fs.existsSync(statsName)
  ? JSON.parse(fs.readFileSync(statsName))
  : undefined;
if (baseStats != null && stats != null && baseStats.version !== stats.version) {
  baseStats = undefined;
}

const pagesOutput = () => {
  const row = (pageName) => {
    const page = stats.pages[pageName];
    const basePage = baseStats != null ? baseStats.pages[pageName] : undefined;
    const size = formatSize(page.size, false);
    const sizeDiff =
      basePage != null ? formatSize(page.size - basePage.size, true) : "N/A";
    const total = formatSize(page.totalSize, false);
    const totalDiff =
      basePage != null
        ? formatSize(page.totalSize - basePage.totalSize, true)
        : "N/A";
    return `| ${pageName} | ${size} | ${sizeDiff} | ${total} | ${totalDiff}`;
  };
  return `
  | Page | Size | +/- | First Load JS | +/- |
  | ---- | ---- | --- | ------------- | --- |
  ${Object.keys(stats.pages).map(row).join("\n")}
  `;
};

const commonSize = formatSize(stats.common.total, false);
const commonSizeDiff =
  baseStats != null
    ? ` (${formatSize(stats.common.total - baseStats.common.total, true)})`
    : "";

const output = `
Shared first load JS sizes is ${commonSize}${commonSizeDiff}.

${pagesOutput()}
`;

process.stdout.write(prettier.format(output, { parser: "markdown" }));
