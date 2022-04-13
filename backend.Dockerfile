ARG go_version=1.18

# ツール類
FROM golang:${go_version} AS tools
ARG dockerize_version=v0.6.1
ARG sqldef_version=v0.11.50
ARG dbenv_version=v1.1.0

RUN wget https://github.com/jwilder/dockerize/releases/download/${dockerize_version}/dockerize-linux-amd64-${dockerize_version}.tar.gz \
    && tar -C /usr/local/bin -xf dockerize-linux-amd64-${dockerize_version}.tar.gz \
    && rm dockerize-linux-amd64-${dockerize_version}.tar.gz

RUN wget https://github.com/k0kubun/sqldef/releases/download/${sqldef_version}/mysqldef_linux_amd64.tar.gz \
    && tar -C /usr/local/bin -xf mysqldef_linux_amd64.tar.gz \
    && rm mysqldef_linux_amd64.tar.gz

ENV DBENV_VERSION v1.1.0
RUN wget https://github.com/cs3238-tsuzu/dbenv/releases/download/${dbenv_version}/dbenv_linux_x86_64.tar.gz \
    && tar -C /usr/local/bin -xf dbenv_linux_x86_64.tar.gz \
    && rm dbenv_linux_x86_64.tar.gz

# 開発環境
FROM golang:${go_version} AS development

COPY --from=tools /usr/local/bin/dockerize /bin
COPY --from=tools /usr/local/bin/mysqldef /bin
COPY --from=tools /usr/local/bin/dbenv /bin

COPY ./backend /backend
COPY ./backend/schema /schema
COPY ./scripts/docker-entrypoint.backend.sh /bin

ENTRYPOINT ["/bin/docker-entrypoint.backend.sh"]
CMD ["-d", "-w", "-m"]

# ビルド
FROM golang:${go_version} AS build-backend

ADD ./backend /backend
ENV GO111MODULE=on

# https://github.com/golang/go/issues/26492
RUN cd /backend && \
    go install && \
    go build \
    -ldflags '-extldflags "-fno-PIC -static"' \
    -buildmode pie \
    -tags 'osusergo netgo static_build' \
    -o ./portal

# 本番環境
# distrolessのdebugを使っているのは、distrolessにshellが含まれないため
FROM gcr.io/distroless/base:debug AS production

COPY --from=tools /usr/local/bin/dockerize /bin
COPY --from=tools /usr/local/bin/mysqldef /bin
COPY --from=tools /usr/local/bin/dbenv /bin
COPY --from=build-backend /backend/portal /bin/portal 
COPY --from=build-backend /backend/schema /schema

COPY ./scripts/docker-entrypoint.backend.sh /bin/
ADD ./config /config

ENTRYPOINT [ "sh", "/bin/docker-entrypoint.backend.sh" ]
CMD [ "-w", "-m" ]
