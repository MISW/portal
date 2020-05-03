#! /bin/sh

cd $(git rev-parse --show-toplevel)

mkdir -p tmp/backend-volume

telepresence --swap-deployment portal-backend-deployment \
    --docker-run -ti --rm \
    -e "TZ=Asia/Tokyo" \
    -e "ENVIRONMENT=dev" \
    -v `pwd`/backend:/backend \
    -v `pwd`/backend/schema:/schema \
    -v `pwd`/scripts/docker-entrypoint.backend.sh:/bin/docker-entrypoint.backend.sh \
    -v `pwd`/tmp/backend-volume:/go/pkg \
    portal_backend
