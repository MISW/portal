#!/bin/sh

set -eu

pnpm i --frozen-lockfile
pnpm run docker
