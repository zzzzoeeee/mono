import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { UserSchema } from './user.contract';
import { securityCookieAuth } from '../shared/openapi-options';

extendZodWithOpenApi(z);

const c = initContract();

export const LoginResponseSchema = z.object({
	user: UserSchema,
});

export const authContract = c.router(
	{
		register: {
			method: 'POST',
			path: '/register',
			responses: {
				201: UserSchema,
			},
			body: z.object({
				email: z.string().email(),
				password: z.string(),
				firstName: z.string().nullable(),
				lastName: z.string().nullable(),
			}),
			summary: 'Register a new user',
		},
		login: {
			method: 'POST',
			path: '/login',
			responses: {
				200: LoginResponseSchema,
			},
			body: z.object({
				email: z.string().email(),
				password: z.string(),
			}),
			summary: 'Login with email and password',
		},
		logout: {
			method: 'POST',
			path: '/logout',
			responses: {
				200: z.object({
					message: z.string(),
				}),
			},
			body: z.object({}).optional(),
			summary: 'Logout the current user',
			metadata: {
				...securityCookieAuth,
			},
		},
	},
	{
		pathPrefix: '/auth',
	},
);
