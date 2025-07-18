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
RUN turbo prune --scope=api --docker

# Builder stage: Installs dependencies and builds the application
FROM base AS builder
WORKDIR /app

COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install

COPY --from=pruner /app/out/full/ .
COPY turbo.json turbo.json
RUN pnpm turbo run db:generate --filter=api...
RUN pnpm turbo build --filter=api...

# Runner stage: Creates the production-ready image
FROM base AS nodejs_runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs

COPY --from=builder --chown=nodejs:nodejs /app .

USER nodejs

ARG PORT=8080
ENV PORT=${PORT}
ENV NODE_ENV=production
EXPOSE ${PORT}

CMD ["tini", "-s", "node", "apps/api/dist/src/main.js"]