import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { basePaginationQuery } from '../shared/queries';

extendZodWithOpenApi(z);

const c = initContract();

const OrderStatus = z.enum(['pending', 'preparing', 'completed', 'cancelled']);

const OrderSchema = z.object({
	id: z.string(),
	tableUsageId: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	status: OrderStatus,
	items: z.array(
		z.object({
			menuId: z.string(),
			quantity: z.number(),
		}),
	),
});

export const orderContract = c.router(
	{
		createOrder: {
			method: 'POST',
			path: '',
			responses: {
				201: OrderSchema,
			},
			body: z.object({
				tableUsageId: z.string(),
				items: z.array(
					z.object({
						menuId: z.string(),
						quantity: z.number().optional().default(1),
					}),
				),
			}),
			summary: 'Create a new order',
		},
		updateOrder: {
			method: 'PUT',
			path: '/:id',
			responses: {
				200: OrderSchema,
			},
			body: z.object({
				tableUsageId: z.string(),
				items: z.array(
					z.object({
						menuId: z.string(),
						quantity: z.number().optional().default(1),
					}),
				),
			}),
			summary: 'Update an order by id',
		},
		deleteOrder: {
			method: 'DELETE',
			path: '/:id',
			responses: {
				200: z.object({
					message: z.string(),
				}),
			},
			summary: 'Delete an order by id',
		},
		getAllOrders: {
			method: 'GET',
			path: '',
			query: basePaginationQuery.extend({
				tableUsageId: z.string().optional(),
				status: OrderStatus.optional(),
				sort: z.enum(['createdAt', 'updatedAt']).optional(),
			}),
			responses: {
				200: z.array(OrderSchema),
			},
			summary: 'Get all orders',
		},
		getOrder: {
			method: 'GET',
			path: '/:id',
			responses: {
				200: OrderSchema,
			},
			summary: 'Get an order by id',
		},
	},
	{
		pathPrefix: '/restaurants/:restaurantId/orders',
	},
);
