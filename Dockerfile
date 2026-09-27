# syntax=docker/dockerfile:1.7
FROM node:24.19.0-bookworm-slim@sha256:e5a8dee7bc1e6a215d224a7ef8206f7e77271bc3cabd5febf2beafac0674f174 AS build
WORKDIR /app
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .node-version ./
RUN corepack enable && corepack pnpm install --frozen-lockfile
COPY . .
RUN corepack pnpm run assets:prepare && corepack pnpm run build

FROM node:24.19.0-bookworm-slim@sha256:e5a8dee7bc1e6a215d224a7ef8206f7e77271bc3cabd5febf2beafac0674f174 AS runtime
WORKDIR /app
# Patch Debian security packages and omit package managers from the runtime image.
RUN apt-get update \
    && apt-get upgrade -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /usr/local/lib/node_modules/npm /usr/local/lib/node_modules/corepack /opt/yarn-v1.22.22 \
    && rm -f /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack /usr/local/bin/yarn /usr/local/bin/yarnpkg \
    && test -x /usr/local/bin/node
ENV NODE_ENV=production HOST=0.0.0.0 PORT=80 ASTRO_NODE_LOGGING=disabled
RUN groupadd --system --gid 10001 portfolio && useradd --system --uid 10001 --gid portfolio --home-dir /app portfolio
COPY --from=build --chown=portfolio:portfolio /app/dist ./dist
USER portfolio
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || '80') + '/api/salud').then((r) => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"
CMD ["node", "dist/server/entry.mjs"]
