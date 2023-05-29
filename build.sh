#!/usr/bin/env sh
cd ./frontend/
corepack enable
corepack prepare pnpm@latest --activate
pnpm i --frozen-lockfile
pnpm build
pnpm export
cd ..
mv -v ./frontend/out/ ./dist/
