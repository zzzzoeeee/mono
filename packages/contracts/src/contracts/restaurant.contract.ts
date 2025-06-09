import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { basePaginationQuery } from '../shared/queries';

extendZodWithOpenApi(z);

const c = initContract();

const RestaurantsSchema = z.object({
	id: z.string(),
	name: z.string(),
	address: z.string(),
	phone: z.string().nullable(),
	website: z.string().nullable(),
	image: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const restaurantContract = c.router({
	createRestaurant: {
		method: 'POST',
		path: '/restaurants',
		responses: {
			201: RestaurantsSchema,
		},
		body: z.object({
			name: z.string(),
			address: z.string(),
			phone: z.string().nullable(),
			website: z.string().nullable(),
			image: z.string().nullable(),
		}),
		summary: 'Create a restaurant',
	},
	updateRestaurant: {
		method: 'PUT',
		path: '/restaurants/:id',
		responses: {
			200: RestaurantsSchema,
		},
		body: z.object({
			name: z.string(),
			address: z.string(),
			phone: z.string().nullable(),
			website: z.string().nullable(),
			image: z.string().nullable(),
		}),
		summary: 'Update a restaurant by id',
	},
	deleteRestaurant: {
		method: 'DELETE',
		path: '/restaurants/:id',
		responses: {
			200: z.object({
				message: z.string(),
			}),
		},
		summary: 'Delete a restaurant by id',
	},
	getAllRestaurants: {
		method: 'GET',
		path: '/restaurants',
		query: basePaginationQuery.extend({
			sort: z.enum(['name', 'createdAt', 'updatedAt']).optional(),
		}),
		responses: {
			200: z.array(RestaurantsSchema),
		},
		summary: 'Get all restaurants',
	},
	getRestaurant: {
		method: 'GET',
		path: '/restaurants/:id',
		responses: {
			200: RestaurantsSchema,
		},
		summary: 'Get a restaurant by id',
	},
});
