const path = require("path");
const fs = require("fs");
const zlib = require("zlib");
const prettier = require("prettier");

const buildManifest = require("../.next/build-manifest.json");

const nextOutdir = ".next";

const gzipSize = (filename) =>
  new Promise((resolve, reject) => {
    const filepath = path.join(process.cwd(), nextOutdir, filename);
    const stream = fs.createReadStream(filepath);
    stream.on("error", reject);

    let size = 0;
    // https://github.com/sindresorhus/gzip-size/blob/fdb1ec139fef8fec1fb3e2c8219f1fc87b279128/index.js#L8
    const gzipStream = zlib
      .createGzip({ level: 9 })
      .on("error", reject)
      .on("data", (buf) => {
        size += buf.byteLength;
      })
      .on("end", () => {
        resolve(size);
      });

    stream.pipe(gzipStream);
  });

const pageSizes = async () => {
  const fileMap = new Map();
  for (const [page, files] of Object.entries(buildManifest.pages)) {
    for (const file of files) {
      if (page === "/_app") {
        fileMap.set(file, Infinity);
      } else if (fileMap.has(file)) {
        fileMap.set(file, fileMap.get(file) + 1);
      } else {
        fileMap.set(file, 1);
      }
    }
  }
  const allFiles = [...fileMap.keys()];

  const appFiles = buildManifest.pages["/_app"] || [];

  const commonFiles = new Set(
    [...fileMap.entries()]
      .filter(
        ([, count]) =>
          count >= Object.keys(buildManifest.pages) - 1 || count === Infinity
      )
      .map(([f]) => f)
  );

  const uniqueFiles = new Set(
    [...fileMap.entries()].filter(([, count]) => count === 1).map(([f]) => f)
  );

  const bundleSizes = new Map();
  await Promise.all(
    allFiles.map(async (filename) => {
      bundleSizes.set(filename, await gzipSize(filename));
    })
  );

  const calcSizes = (filenames) =>
    filenames.reduce((pre, filename) => pre + bundleSizes.get(filename), 0);

  const pages = {};
  for (const [page, files] of Object.entries(buildManifest.pages)) {
    if (["/_document", "/_app", "/_error"].includes(page)) continue;

    let size = 0,
      totalSize = 0;
    for (const file of new Set([...files, ...appFiles])) {
      if (!file.endsWith("js")) continue;
      totalSize += bundleSizes.get(file);
      if (uniqueFiles.has(file)) {
        size += bundleSizes.get(file);
      }
    }

    pages[page] = { size, totalSize };
  }

  return {
    version: 1,
    common: {
      files: [...commonFiles].map((file) => [file, bundleSizes.get(file)]),
      total: calcSizes([...commonFiles]),
    },
    pages,
  };
};

pageSizes()
  .then((stats) => {
    process.stdout.write(
      prettier.format(JSON.stringify(stats), { parser: "json" })
    );
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
