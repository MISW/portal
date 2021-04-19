FROM node:12.22.1-buster-slim AS base

ENV DEBIAN_FRONTEND=noninteractive

RUN echo "deb http://deb.debian.org/debian testing main\ndeb-src http://deb.debian.org/debian testing main" >> /etc/apt/sources.list \
    && apt-get update \
    && apt-get -t testing install -y ca-certificates tzdata libc6 libstdc++6 fonts-noto-cjk \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /frontend
COPY ./frontend/package.json ./frontend/package-lock.json /frontend/

# 開発環境
FROM base AS dev

COPY ./scripts/* /bin/

WORKDIR /frontend
COPY ./frontend /frontend

ENTRYPOINT [ "/bin/docker-entrypoint.frontend.sh" ]

# node_modulesのインストール
FROM base AS install

WORKDIR /frontend
RUN npm ci

# ビルド
FROM install AS build

WORKDIR /frontend
COPY ./frontend /frontend
RUN npm run build

# node_modulesから本番で使わないものを取り除く
FROM install AS prune

WORKDIR /frontend
RUN npm prune --production

# 本番環境
FROM base AS prod

ENV NODE_ENV=production

WORKDIR /frontend
COPY --from=prune /frontend/node_modules ./node_modules
COPY --from=build /frontend/.next ./.next

ENTRYPOINT ["npm", "start"]