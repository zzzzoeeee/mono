import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { getPaginationQuery } from '../shared/queries';

extendZodWithOpenApi(z);

const c = initContract();

const PricePlanSchema = z.object({
	id: z.string(),
	restaurantId: z.string(),
	name: z.string(),
	description: z.string().optional(),
	price: z.number(),
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
				restaurantId: z.string(),
				name: z.string(),
				description: z.string().optional(),
				price: z.number(),
			}),
			summary: 'Create a new price plan',
		},
		updatePricePlan: {
			method: 'PUT',
			path: '/:id',
			responses: {
				200: PricePlanSchema,
				404: z.object({
					message: z.string(),
				}),
			},
			body: z.object({
				name: z.string(),
				description: z.string().optional(),
				price: z.number(),
			}),
			summary: 'Update a price plan',
		},
		getPricePlans: {
			method: 'GET',
			path: '',
			responses: {
				200: z.array(PricePlanSchema),
			},
			query: getPaginationQuery({ sort: ['name', 'createdAt', 'updatedAt'] }),
			summary: 'Get price plans for a restaurant',
		},
		deletePricePlan: {
			method: 'DELETE',
			path: '/:id',
			responses: {
				200: z.object({
					message: z.string(),
				}),
				404: z.object({
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
