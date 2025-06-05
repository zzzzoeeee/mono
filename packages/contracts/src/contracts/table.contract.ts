import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { basePaginationQuery } from '../shared/queries';

extendZodWithOpenApi(z);

const c = initContract();

const TableStatus = z.enum(['available', 'occupied']);

const TablesSchema = z.object({
	id: z.string(),
	restaurantId: z.string(),
	name: z.string(),
	capacity: z.number(),
	status: TableStatus,
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const tableContract = c.router(
	{
		createTable: {
			method: 'POST',
			path: '',
			responses: {
				201: TablesSchema,
			},
			body: z.object({
				restaurantId: z.string(),
				name: z.string(),
				capacity: z.number(),
				status: TableStatus,
			}),
			summary: 'Create a table',
		},
		updateTable: {
			method: 'PUT',
			path: '/:id',
			responses: {
				200: TablesSchema,
			},
			body: z.object({
				name: z.string(),
				capacity: z.number(),
				status: TableStatus,
			}),
			summary: 'Update a table by id',
		},
		deleteTable: {
			method: 'DELETE',
			path: '/:id',
			responses: {
				200: z.object({
					message: z.string(),
				}),
			},
			summary: 'Delete a table by id',
		},
		getAllTables: {
			method: 'GET',
			path: '',
			query: basePaginationQuery.extend({
				capacity: z.number().optional(),
				status: TableStatus.optional(),
				sort: z.enum(['name', 'createdAt', 'updatedAt']).optional(),
			}),
			responses: {
				200: z.array(TablesSchema),
			},
			summary: 'Get all tables',
		},
		getTable: {
			method: 'GET',
			path: '/:id',
			responses: {
				200: TablesSchema,
			},
			summary: 'Get a table by id',
		},
	},
	{
		pathPrefix: '/restaurants/:restaurantId/tables',
	},
);
