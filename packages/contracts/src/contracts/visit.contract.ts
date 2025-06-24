import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { basePaginationQuery } from '../shared/queries';

extendZodWithOpenApi(z);

const c = initContract();

export const VisitStatus = z.enum(['USING', 'FINISHED']);

export const VisitSchema = z.object({
	id: z.string(),
	tableId: z.string(),
	pricePlanId: z.string(),
	customerCount: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
	startTime: z.date(),
	endTime: z.date().nullable(),
	duration: z.number().nullable().describe('Duration in minutes'),
	status: VisitStatus,
	notes: z.string().nullable(),
});

export const visitContract = c.router(
	{
		createVisit: {
			method: 'POST',
			path: '',
			responses: {
				201: VisitSchema,
			},
			body: z.object({
				tableId: z.string(),
				startTime: z.date(),
				endTime: z.date().nullable(),
				duration: z.number().nullable().describe('Duration in minutes'),
				status: VisitStatus,
				notes: z.string().nullable(),
			}),
			summary: 'Create a visit',
		},
		updateVisit: {
			method: 'PUT',
			path: '/:id',
			responses: {
				200: VisitSchema,
			},
			body: z.object({
				tableId: z.string(),
				startTime: z.date(),
				endTime: z.date().nullable(),
				duration: z.number().nullable().describe('Duration in minutes'),
				status: VisitStatus,
				notes: z.string().nullable(),
			}),
			summary: 'Update a visit by id',
		},
		deleteVisit: {
			method: 'DELETE',
			path: '/:id',
			responses: {
				200: z.object({
					message: z.string(),
				}),
			},
			summary: 'Delete a visit by id',
		},
		getAllVisits: {
			method: 'GET',
			path: '',
			query: basePaginationQuery.extend({
				tableId: z.string().optional(),
				pricePlanId: z.string().optional(),
				customerCount: z.number().optional(),
				status: VisitStatus.optional(),
				startTime: z.date().optional(),
				endTime: z.date().optional(),
				sort: z.enum(['createdAt', 'updatedAt']).optional(),
			}),
			responses: {
				200: z.array(VisitSchema),
			},
			summary: 'Get all visits',
		},
		getVisit: {
			method: 'GET',
			path: '/:id',
			responses: {
				200: VisitSchema,
			},
			summary: 'Get a visit by id',
		},
	},
	{
		pathPrefix: '/restaurants/:restaurantId/visits',
	},
);
