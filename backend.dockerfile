ARG go_version=1.24

# tools
FROM archlinux:base-devel AS tools

RUN mkdir -p /tools/bin

WORKDIR /tools

ARG dbenv_version=v1.1.0
RUN curl -fsSL https://github.com/tsuzu/dbenv/releases/download/${dbenv_version}/dbenv_linux_x86_64.tar.gz -o ./dbenv.tar.gz \
  && tar xvf ./dbenv.tar.gz -C /tools/bin \
  && chmod +x /tools/bin/dbenv \
  && rm -f ./dbenv.tar.gz

ARG dockerize_version=v0.7.0
RUN curl -fsSL https://github.com/jwilder/dockerize/releases/download/${dockerize_version}/dockerize-linux-amd64-${dockerize_version}.tar.gz -o ./dockerize.tar.gz \
  && tar xvf ./dockerize.tar.gz -C /tools/bin \
  && chmod +x /tools/bin/dockerize \
  && rm -f ./dockerize.tar.gz

ARG sqldef_version=v0.16.7
RUN curl -fsSL https://github.com/k0kubun/sqldef/releases/download/${sqldef_version}/mysqldef_linux_amd64.tar.gz -o ./mysqldef.tar.gz \
  && tar xvf ./mysqldef.tar.gz -C /tools/bin \
  && chmod +x /tools/bin/mysqldef \
  && rm -f ./mysqldef.tar.gz

# development
FROM golang:${go_version} AS development

RUN apt update \
  && DEBIAN_FRONTEND=noninteractive apt install -y mariadb-client \
  && apt clean \
  && rm -rf /var/lib/apt/lists/*

COPY --from=tools /tools/bin/dbenv /bin
COPY --from=tools /tools/bin/dockerize /bin
COPY --from=tools /tools/bin/mysqldef /bin

RUN mkdir -p /backend

COPY ./backend/docker-entrypoint.sh /bin/docker-entrypoint.sh

WORKDIR /backend

EXPOSE 80

ENTRYPOINT ["/bin/docker-entrypoint.sh"]
CMD ["-d", "-w", "-m", "-s"]

# workspace
FROM golang:${go_version} AS workspace

COPY ./backend /backend

WORKDIR /backend

RUN go mod download \
  && CGO_ENABLED=0 go build -buildmode pie -buildvcs=false -o /backend/portal

# production
FROM gcr.io/distroless/base:debug AS production

RUN ["/busybox/sh", "-c", "ln -s /busybox/sh /bin/sh"]
RUN ["/busybox/sh", "-c", "ln -s /bin/env /usr/bin/env"]

COPY --from=tools /tools/bin/dbenv /bin
COPY --from=tools /tools/bin/dockerize /bin
COPY --from=tools /tools/bin/mysqldef /bin

COPY --from=workspace /backend/portal /bin/portal

COPY ./backend/schema /schema
COPY ./backend/docker-entrypoint.sh /bin/docker-entrypoint.sh

ENTRYPOINT ["sh", "/bin/docker-entrypoint.sh"]
CMD ["-w", "-m"]
