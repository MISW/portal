FROM golang:1.14.1 as tools

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/${DOCKERIZE_VERSION}/dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && tar -C /usr/local/bin -xzvf dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
    && rm dockerize-linux-amd64-$DOCKERIZE_VERSION.tar.gz

ENV SQLDEF_VERSION v0.5.12
RUN wget https://github.com/k0kubun/sqldef/releases/download/${SQLDEF_VERSION}/mysqldef_linux_amd64.tar.gz \
    && tar -C /usr/local/bin -xzvf mysqldef_linux_amd64.tar.gz \
    && rm mysqldef_linux_amd64.tar.gz

ENV DBENV_VERSION v1.1.0
RUN wget https://github.com/cs3238-tsuzu/dbenv/releases/download/${DBENV_VERSION}/dbenv_linux_x86_64.tar.gz \
    && tar -C /usr/local/bin -xzvf dbenv_linux_x86_64.tar.gz \
    && rm dbenv_linux_x86_64.tar.gz


FROM golang:1.14.3 as build-backend

ADD ./backend /backend
ENV GO111MODULE=on

# https://github.com/golang/go/issues/26492
RUN cd /backend && go build \
    -ldflags '-extldflags "-fno-PIC -static"' \
    -buildmode pie \
    -tags 'osusergo netgo static_build' \
    -o ./portal

FROM golang:1.14.1

COPY --from=tools /usr/local/bin/dockerize /bin
COPY --from=tools /usr/local/bin/mysqldef /bin
COPY --from=tools /usr/local/bin/dbenv /bin
COPY --from=build-backend /backend/portal /bin/portal 
COPY --from=build-backend /backend/schema /schema

COPY ./scripts/* /bin/
ADD ./config /config

ENTRYPOINT [ "/bin/docker-entrypoint.backend.sh" ]
CMD [ "-w", "-m" ]
