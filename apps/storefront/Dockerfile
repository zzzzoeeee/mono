ARG NODE_VERSION=22.17.0
ARG PNPM_VERSION=10.13.1
ARG TURBO_VERSION=2.5.4

# Base stage: Sets up the Node.js environment with pnpm
FROM node:${NODE_VERSION}-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apk update
RUN apk add --no-cache tini
RUN corepack enable
RUN corepack install --global pnpm@${PNPM_VERSION}

# Pruner stage: Prepares the build environment and prunes the monorepo
FROM base AS pruner
WORKDIR /app

RUN pnpm install turbo@${TURBO_VERSION} --global
COPY . .
RUN turbo prune --scope=storefront --docker

# Builder stage: Installs dependencies and builds the application
FROM base AS builder
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo build --filter=storefront...

# Runner stage: Creates the production-ready image
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=Builder --chown=nodejs:nodejs /app/apps/storefront/.next/standalone ./
COPY --from=Builder --chown=nodejs:nodejs /app/apps/storefront/.next/static ./apps/storefront/.next/static
COPY --from=Builder --chown=nodejs:nodejs /app/apps/storefront/public ./apps/storefront/public

USER nodejs

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"

CMD ["tini", "-s", "node", "apps/storefront/server.js"]