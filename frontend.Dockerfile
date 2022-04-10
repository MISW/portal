FROM node:gallium-bullseye-slim AS base

ENV DEBIAN_FRONTEND=noninteractive

RUN apt update && \
    apt install -y ca-certificates tzdata fonts-noto-cjk && \
    apt clean && \
    rm -rf /var/lib/apt/lists/*
WORKDIR /frontend
COPY ./frontend/package.json ./frontend/package-lock.json /frontend/

# 開発環境
FROM base AS development

COPY ./scripts/* /bin/

WORKDIR /frontend
COPY ./frontend /frontend

ENTRYPOINT [ "/bin/docker-entrypoint.frontend.sh" ]

# node_modulesのインストール
FROM base AS install-modules

WORKDIR /frontend
RUN npm install --force

# ビルド
FROM install-modules AS build-frontend

WORKDIR /frontend
COPY ./frontend /frontend
RUN npm run build

# node_modulesから本番で使わないものを取り除く
FROM install-modules AS prune-modules

WORKDIR /frontend
RUN npm prune --production

# 本番環境
FROM base AS production

ENV NODE_ENV=production

WORKDIR /frontend
COPY --from=prune-modules /frontend/node_modules ./node_modules
COPY --from=build-frontend /frontend/.next ./.next
COPY --from=build-frontend /frontend/next.config.js ./next.config.js

ENTRYPOINT ["npm", "start"]
