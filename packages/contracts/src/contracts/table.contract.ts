import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { basePaginationQuery } from '../shared/queries';
import { VisitSchema, VisitStatus } from './visit.contract';
import { zodBooleanString } from '../shared/utils';

extendZodWithOpenApi(z);

const c = initContract();

const TablesSchema = z.object({
	id: z.string(),
	restaurantId: z.string(),
	name: z.string(),
	capacity: z.number().min(1).max(100),
	isActive: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
	lastVisit: VisitSchema.nullable(),
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
				capacity: z.number().min(1).max(100),
				isActive: z.boolean(),
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
				capacity: z.number().min(1).max(100),
				isActive: z.boolean(),
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
				capacity: z
					.preprocess((val) => Number(val), z.number().min(1).max(100))
					.optional(),
				isActive: zodBooleanString.optional(),
				visitStatus: VisitStatus.optional(),
				sort: z
					.enum(['capacity', 'name', 'createdAt', 'updatedAt', 'isActive'])
					.optional(),
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
