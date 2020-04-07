FROM node:12.16.1-stretch-slim

ENV DEBIAN_FRONTEND=noninteractive
ENV PATH=$PATH:/usr/local/go/bin
RUN apt-get update \
    && apt-get install -y ca-certificates tzdata \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ADD ./frontend /frontend
WORKDIR /frontend

RUN npm install

COPY ./scripts/* /bin/

ENTRYPOINT [ "/bin/docker-entrypoint.frontend.sh" ]
