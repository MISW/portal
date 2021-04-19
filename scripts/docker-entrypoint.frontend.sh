#!/bin/sh

set -eu

npm install

if [ "${ENVIRONMENT:-}" = "prod" ]; then
    npm run build
    npm run start
elif [ "${ENVIRONMENT:-}" = "dev" ]; then
    npm run docker
fi
