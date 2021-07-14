const util = require("util");
const path = require("path");
const fs = require("fs");
const readFile = util.promisify(fs.readFile);
const zlib = require("zlib");
const gzip = util.promisify(zlib.gzip);

const buildManifest = require("../.next/build-manifest.json");

const nextOutdir = ".next";

const bundleSize = async (filename) => {
  const filepath = path.join(process.cwd(), nextOutdir, filename);
  const file = await readFile(filepath);
  const gzipped = await gzip(file);
  return {
    raw: file.byteLength,
    gzipped: gzipped.byteLength,
  };
};

const pageSizes = async () => {
  const fileSet = new Set();
  for (const files of Object.values(buildManifest.pages)) {
    for (const file of files) {
      fileSet.add(file);
    }
  }

  const bundleSizes = new Map();
  await Promise.all(
    [...fileSet].map(async (filename) => {
      bundleSizes.set(filename, await bundleSize(filename));
    })
  );

  const stats = Object.fromEntries(
    Object.entries(buildManifest.pages).map(([page, files]) => {
      const stat = files.reduce(
        (pre, filename) => {
          const size = bundleSizes.get(filename);
          return {
            raw: pre.raw + size.raw,
            gzipped: pre.gzipped + size.gzipped,
          };
        },
        { raw: 0, gzipped: 0 }
      );
      return [page, stat];
    })
  );

  return stats;
};

pageSizes()
  .then((stats) => {
    fs.writeFileSync(
      path.join(process.cwd(), nextOutdir, "build-stats.json"),
      JSON.stringify(stats, null, 2)
    );
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
