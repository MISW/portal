#!/usr/bin/env sh

set -eu

pnpm i --frozen-lockfile
pnpm docker
