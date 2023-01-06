ARG node_version=18

# tools
FROM archlinux:base-devel AS tools

RUN mkdir -p /tools/bin

WORKDIR /tools

ARG pnpm_version=v7.23.0
RUN curl -fsSL https://github.com/pnpm/pnpm/releases/download/${pnpm_version}/pnpm-linux-x64 -o /tools/bin/pnpm \
  && chmod +x /tools/bin/pnpm

# base
FROM node:${node_version}-bullseye-slim AS base

RUN apt update \
  && DEBIAN_FRONTEND=noninteractive apt install -y ca-certificates fonts-noto-cjk tzdata \
  && apt clean \
  && rm -rf /var/lib/apt/lists/*

COPY --from=tools /tools/bin/pnpm /bin

COPY ./frontend /frontend

# development
FROM base AS development

COPY ./frontend/docker-entrypoint.sh /bin/docker-entrypoint.sh

WORKDIR /frontend

ENV NODE_ENV=development

EXPOSE 3000

ENTRYPOINT ["/bin/docker-entrypoint.sh"]

# workspace
FROM base AS workspace

WORKDIR /frontend

RUN pnpm i --frozen-lockfile \
  && pnpm build

# pruned
FROM workspace AS pruned

WORKDIR /frontend

RUN pnpm prune --prod --no-optional

# production
FROM gcr.io/distroless/nodejs:${node_version}-debug AS production

RUN ["/busybox/sh", "-c", "ln -s /busybox/sh /bin/sh"]
RUN ["/busybox/sh", "-c", "ln -s /bin/env /usr/bin/env"]
RUN ["/busybox/sh", "-c", "ln -s /nodejs/bin/node /bin/node"]

COPY --from=base /frontend/next.config.js /portal/next.config.js

COPY --from=workspace /frontend/.next /portal/.next

COPY --from=pruned /frontend/node_modules /portal/node_modules

WORKDIR /portal

ENV NODE_ENV=production

ENTRYPOINT ["sh", "/portal/node_modules/.bin/next"]
CMD ["start", "--hostname", "0.0.0.0"]
