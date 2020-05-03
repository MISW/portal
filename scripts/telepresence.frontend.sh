#! /bin/sh

cd $(git rev-parse --show-toplevel)

mkdir -p tmp/frontend-volume

telepresence --swap-deployment portal-frontend-deployment \
    --docker-run -ti --rm \
    -e "TZ=Asia/Tokyo" \
    -e "ENVIRONMENT=dev" \
    -v `pwd`/frontend:/frontend \
    -v `pwd`/scripts/docker-entrypoint.frontend.sh:/bin/docker-entrypoint.frontend.sh \
    portal_frontend
