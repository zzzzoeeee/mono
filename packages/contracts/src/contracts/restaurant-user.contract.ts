import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { basePaginationQuery } from '../shared/queries';

extendZodWithOpenApi(z);

const c = initContract();

const RestaurantUserRole = z.enum(['MANAGER', 'STAFF']);

const RestaurantUserSchema = z.object({
	id: z.string(),
	restaurantId: z.string(),
	userId: z.string(),
	role: RestaurantUserRole,
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const restaurantUserContract = c.router(
	{
		createRestaurantUser: {
			method: 'POST',
			path: '',
			responses: {
				201: RestaurantUserSchema,
			},
			body: z.object({
				userId: z.string(),
				role: RestaurantUserRole,
			}),
			summary: 'Create a restaurant user',
		},
		updateRestaurantUser: {
			method: 'PUT',
			path: '/:id',
			responses: {
				200: RestaurantUserSchema,
			},
			body: z.object({
				role: RestaurantUserRole,
			}),
			summary: 'Update a restaurant user by id',
		},
		deleteRestaurantUser: {
			method: 'DELETE',
			path: '/:id',
			responses: {
				200: z.object({
					message: z.string(),
				}),
			},
			summary: 'Delete a restaurant user by id',
		},
		getAllRestaurantUsers: {
			method: 'GET',
			path: '',
			query: basePaginationQuery.extend({
				sort: z.enum(['createdAt', 'updatedAt']).optional(),
				role: RestaurantUserRole.optional(),
			}),
			responses: {
				200: z.array(RestaurantUserSchema),
			},
			summary: 'Get all restaurant users',
		},
		getRestaurantUser: {
			method: 'GET',
			path: '/:id',
			responses: {
				200: RestaurantUserSchema,
			},
			summary: 'Get a restaurant user by id',
		},
	},
	{
		pathPrefix: '/restaurants/:restaurantId/restaurant-users',
	},
);
