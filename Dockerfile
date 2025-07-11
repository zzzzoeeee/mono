ARG NODE_VERSION=22.17.0
ARG PNPM_VERSION=10.13.1
ARG TURBO_VERSION=2.5.4

# Setup alpine base
FROM node:${NODE_VERSION}-alpine AS alpine
RUN apk update
RUN apk add --no-cache tini

# Setup pnpm and turbo
FROM alpine AS base
RUN npm install pnpm@${PNPM_VERSION} turbo@${TURBO_VERSION} --global
RUN pnpm config set store-dir ~/.pnpm-store

# Prune project
FROM base AS pruner
ARG PROJECT

WORKDIR /app
COPY . .
RUN turbo prune --scope=${PROJECT} --docker

# Build project
FROM base AS builder
ARG PROJECT

WORKDIR /app

COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=pruner /app/out/json/ .

RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm install --frozen-lockfile

COPY --from=pruner /app/out/full/ .

RUN turbo run db:generate --filter=${PROJECT}
RUN turbo build --filter=${PROJECT}

RUN --mount=type=cache,id=pnpm,target=~/.pnpm-store pnpm prune --prod --no-optional
RUN rm -rf ./**/*/src

# Final image
FROM alpine AS runner
ARG PROJECT

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
USER nodejs

WORKDIR /app
COPY --from=builder --chown=nodejs:nodejs /app .
WORKDIR /app/apps/${PROJECT}

ARG PORT=8080
ENV PORT=${PORT}
ENV NODE_ENV=production
EXPOSE ${PORT}

CMD ["tini", "-s", "node", "dist/src/main.js"]
