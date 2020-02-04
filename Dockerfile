FROM golang:1.13 as build-backend

ADD ./backend /backend
ENV GO111MODULE=on

# https://github.com/golang/go/issues/26492
RUN cd /backend && go build \
    -ldflags '-extldflags "-fno-PIC -static"' \
    -buildmode pie \
    -tags 'osusergo netgo static_build' \
    -o ./portal

FROM node:10.16.3 as build-frontend

ADD ./frontend /frontend
# ADD ./resources /resources
# RUN cd /frontend && npm ci && npm run build

FROM alpine:3.9

COPY --from=build-backend /backend/portal /mmorpg2019server 
COPY --from=build-backend /backend/schema /schema
# COPY --from=build-frontend /frontend/dist /dist 
# COPY --from=build-frontend /resources /resources
ADD ./config /config

ENTRYPOINT [ "sh", "-c" ]
CMD [ "/portal --addr=:${PORT:-80} --frontend=dir:///dist/ --resources=/resources --config-dir=/config" ]