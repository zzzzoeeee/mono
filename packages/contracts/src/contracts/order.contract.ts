import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { basePaginationQuery } from '../shared/queries';

extendZodWithOpenApi(z);

const c = initContract();

const OrderStatus = z.enum(['PENDING', 'PREPARING', 'COMPLETED', 'CANCELLED']);

const OrderSchema = z.object({
	id: z.string(),
	visitId: z.string(),
	note: z.string().nullable(),
	createdAt: z.date(),
	updatedAt: z.date(),
	status: OrderStatus,
	items: z.array(
		z.object({
			id: z.string(),
			menuId: z.string(),
			quantity: z.number(),
			price: z.number(),
			note: z.string().nullable(),
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
			body: z
				.object({
					visitId: z.string(),
					note: z.string().nullable(),
					items: z
						.array(
							z.object({
								menuId: z.string(),
								quantity: z.number().min(1).max(10).default(1),
								note: z.string().nullable(),
							}),
						)
						.min(1)
						.max(10),
				})
				.refine(
					(val) => {
						const items = val.items.map(
							(item) => `${item.menuId}-${item.note}`,
						);
						const uniqueItems = new Set(items);
						return uniqueItems.size === items.length;
					},
					{
						message: 'Item with the same menuId and note must be unique',
					},
				),
			summary: 'Create a new order',
		},
		deleteOrder: {
			method: 'DELETE',
			path: '/:orderId',
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
				visitId: z.string().optional(),
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
			path: '/:orderId',
			responses: {
				200: OrderSchema,
			},
			summary: 'Get an order by id',
		},
		updateOrderStatus: {
			method: 'PUT',
			path: '/:orderId/status',
			responses: {
				200: OrderSchema,
			},
			body: z.object({
				status: OrderStatus,
			}),
			summary: 'Update an order status by id',
		},
	},
	{
		pathPrefix: '/restaurants/:restaurantId/orders',
		meta: OrderSchema,
	},
);
