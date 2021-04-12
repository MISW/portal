FROM node:12.22.1-buster-slim

ENV DEBIAN_FRONTEND=noninteractive

RUN echo "deb http://deb.debian.org/debian testing main\ndeb-src http://deb.debian.org/debian testing main" >> /etc/apt/sources.list \
    && apt-get update \
    && apt-get -t testing install -y ca-certificates tzdata libc6 libstdc++6 fonts-noto-cjk \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

ADD ./frontend /frontend
WORKDIR /frontend

RUN npm ci && npm run build

COPY ./scripts/* /bin/

ENTRYPOINT [ "/bin/docker-entrypoint.frontend.sh" ]
