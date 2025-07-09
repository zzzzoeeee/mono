# Contracts Package

This package contains shared contracts, DTOs, and API endpoints used across different services in the monorepo.
It's built using [ts-rest](https://ts-rest.com/), a TypeScript-first contract library that ensures type safety
and consistency between frontend and backend implementations.

## Features

- Type-safe API contracts with runtime validation
- Automatic OpenAPI 3.0 specification generation
- Built-in Swagger UI for API documentation
- Shared types between frontend and backend

## Installation

To install dependencies:

```bash
pnpm install
```

## Building

To build the contracts package:

```bash
pnpm build
```

## Usage

Import contracts and DTOs from this package into other packages:

### NestJS

```typescript
import { c } from '@repo/contracts';

@Controller()
export class AuthController {
    @Public()
	@TsRestHandler(c.auth.register)
	async register() {
		...
	}
}
```

### React - Vite

```typescript
import { c } from "@repo/contracts";

export const tsr = initTsrReactQuery(c, {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  baseHeaders: {
    "x-app-source": "ts-rest",
  },
});

const { data, isPending, error } = tsr.restaurants.getAllRestaurants.useQuery({
  queryKey: ["restaurants"],
});
```

## OpenAPI and Swagger UI

To generate OpenAPI 3.0 specification and start Swagger UI

```
pnpm start:openapi
```

- Swagger UI will be available at [http://localhost:3100](http://localhost:3100).
- OpenAPI document json will be available at [http://localhost:3100/openapi](http://localhost:3100/openapi)

## License

This project is [MIT licensed](LICENSE).