#!/usr/bin/env sh
npm install -g pnpm
cd frontend/
pnpm i --frozen-lockfile
pnpm build
pnpm export
cd ..
mv -v frontend/out/ dist/
