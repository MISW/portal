#!/bin/sh

set -eu

npm install -g pnpm
pnpm i --frozen-lockfile
pnpm build
pnpm docker
