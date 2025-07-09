# Agent Development Guide

## Commands
- **Build**: `pnpm build` (all apps), `turbo run build --filter=api` (single app)
- **Dev**: `pnpm dev` (all apps), `cd apps/api && pnpm dev` (single app)
- **Test**: `pnpm test` (all apps), `cd apps/api && pnpm test -- <file>` (single test)
- **Lint/Format**: `pnpm lint`, `pnpm format` (uses Biome)
- **Type Check**: `pnpm check-types`

## Architecture
- **Monorepo**: Turborepo with pnpm workspaces
- **Apps**: API (NestJS), Admin (Vite/React), Storefront (Next.js)  
- **Database**: PostgreSQL with Prisma ORM, schemas in `apps/api/prisma/`
- **Shared**: `packages/contracts` (API contracts), `packages/ui` (components)
- **Ports**: API :3000, Admin :3001, Storefront :3002

## Code Style
- **Formatter**: Biome with tabs, single quotes
- **Types**: Contracts in `packages/contracts` use Zod schemas as source of truth
- **Backend Types**: Separate TypeScript types in `apps/api/src/modules/*/types/` that match contract specs but don't import them
- **Naming**: Zod schemas: `UserSchema`, TypeScript types: `User`, enums: `UPPER_CASE`
- **API**: `@ts-rest/core` contracts define endpoints, pagination via `basePaginationQuery`
- **Imports**: Workspace packages via `@repo/*`
- **Files**: Use `.spec.ts` for tests, camelCase for variables/functions
