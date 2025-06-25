import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { basePaginationQuery } from '../shared/queries';
import { zodBooleanString } from '../shared/utils';

extendZodWithOpenApi(z);

const c = initContract();

const PricePlanSchema = z.object({
	id: z.string(),
	restaurantId: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	price: z.number().min(0),
	isActive: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const pricePlanContract = c.router(
	{
		createPricePlan: {
			method: 'POST',
			path: '',
			responses: {
				201: PricePlanSchema,
			},
			body: z.object({
				name: z.string(),
				description: z.string().nullable(),
				price: z.number().min(0),
				isActive: z.boolean(),
			}),
			summary: 'Create a new price plan',
		},
		updatePricePlan: {
			method: 'PUT',
			path: '/:pricePlanId',
			responses: {
				200: PricePlanSchema,
			},
			body: z.object({
				name: z.string(),
				description: z.string().nullable(),
				price: z.number().min(0),
				isActive: z.boolean(),
			}),
			summary: 'Update a price plan',
		},
		getPricePlans: {
			method: 'GET',
			path: '',
			responses: {
				200: z.array(PricePlanSchema),
			},
			query: basePaginationQuery.extend({
				sort: z
					.enum(['price', 'isActive', 'name', 'createdAt', 'updatedAt'])
					.default('price'),
				order: z.enum(['asc', 'desc']).default('asc'),
				isActive: zodBooleanString.optional(),
			}),
			summary: 'Get price plans for a restaurant',
		},
		getPricePlan: {
			method: 'GET',
			path: '/:pricePlanId',
			responses: {
				200: PricePlanSchema,
			},
			summary: 'Get a price plan by id',
		},
		deletePricePlan: {
			method: 'DELETE',
			path: '/:pricePlanId',
			responses: {
				200: z.object({
					message: z.string(),
				}),
			},
			summary: 'Delete a price plan',
		},
	},
	{
		pathPrefix: '/restaurants/:restaurantId/price-plans',
	},
);
