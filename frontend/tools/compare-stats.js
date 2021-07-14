const fs = require("fs");

const baseStatsName = process.argv[process.argv.length - 2];
const statsName = process.argv[process.argv.length - 1];

const baseStats = fs.existsSync(baseStatsName)
  ? JSON.parse(fs.readFileSync(baseStatsName))
  : undefined;
const stats = fs.existsSync(statsName)
  ? JSON.parse(fs.readFileSync(statsName))
  : undefined;

process.stdout.write(JSON.stringify(stats, null, 2));
