ARG node_version=20

# development
FROM node:${node_version}-bookworm-slim AS development

RUN corepack enable \
  && corepack prepare pnpm@latest --activate

RUN mkdir -p /frontend

COPY ./frontend/docker-entrypoint.sh /bin/docker-entrypoint.sh

WORKDIR /frontend

ENV NODE_ENV=development

EXPOSE 3000

ENTRYPOINT ["/bin/docker-entrypoint.sh"]

# workspace
FROM node:${node_version}-bookworm-slim AS workspace

RUN corepack enable \
  && corepack prepare pnpm@latest --activate

COPY ./frontend /frontend

WORKDIR /frontend

RUN pnpm i --frozen-lockfile \
  && pnpm build

# pruned
FROM workspace AS pruned

WORKDIR /frontend

RUN pnpm prune --prod --no-optional

# production
FROM gcr.io/distroless/nodejs${node_version}:debug AS production

RUN ["/busybox/sh", "-c", "ln -s /busybox/sh /bin/sh"]
RUN ["/busybox/sh", "-c", "ln -s /bin/env /usr/bin/env"]
RUN ["/busybox/sh", "-c", "ln -s /nodejs/bin/node /bin/node"]

COPY --from=workspace /frontend/next.config.js /portal/next.config.js

COPY --from=workspace /frontend/.next /portal/.next

COPY --from=pruned /frontend/node_modules /portal/node_modules

WORKDIR /portal

ENV NODE_ENV=production

ENTRYPOINT ["sh", "/portal/node_modules/.bin/next"]
CMD ["start", "--hostname", "0.0.0.0"]
