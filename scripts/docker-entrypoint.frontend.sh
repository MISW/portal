#!/bin/sh

set -eu

if [ "$ENVIRONMENT" = "prod" ]; then
    npm run start &
elif [ "$ENVIRONMENT" = "dev" ]; then
    npm install
    npm run docker
fi
