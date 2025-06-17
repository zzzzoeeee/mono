import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';

extendZodWithOpenApi(z);

const c = initContract();

export const UserRoleSchema = z.enum(['ADMIN', 'USER']);

export const UserSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	firstName: z.string().nullable(),
	lastName: z.string().nullable(),
	role: UserRoleSchema,
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const userContract = c.router(
	{
		me: {
			method: 'GET',
			path: '/me',
			responses: {
				200: UserSchema,
			},
			summary: 'Get current user information',
		},
	},
	{
		pathPrefix: '/users',
	},
);
