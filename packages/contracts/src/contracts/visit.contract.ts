import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { getPaginationQuery } from '../shared/queries';

extendZodWithOpenApi(z);

const c = initContract();

const VisitStatus = z.enum(['using', 'finished']);

const VisitSchema = z.object({
	id: z.string(),
	tableId: z.string(),
	pricePlanId: z.string(),
	customerCount: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
	startTime: z.date(),
	endTime: z.date().optional(),
	duration: z.number().optional().describe('Duration in minutes'),
	status: VisitStatus,
	notes: z.string().optional(),
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
				endTime: z.date().optional(),
				duration: z.number().optional().describe('Duration in minutes'),
				status: VisitStatus,
				notes: z.string().optional(),
			}),
			summary: 'Create a visit',
		},
		updateVisit: {
			method: 'PUT',
			path: '/:id',
			responses: {
				200: VisitSchema,
				404: z.object({
					message: z.string(),
				}),
			},
			body: z.object({
				tableId: z.string(),
				startTime: z.date(),
				endTime: z.date().optional(),
				duration: z.number().optional().describe('Duration in minutes'),
				status: VisitStatus,
				notes: z.string().optional(),
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
				404: z.object({
					message: z.string(),
				}),
			},
			summary: 'Delete a visit by id',
		},
		getAllVisits: {
			method: 'GET',
			path: '',
			query: getPaginationQuery({ sort: ['createdAt', 'updatedAt'] }).extend({
				tableId: z.string().optional(),
				pricePlanId: z.string().optional(),
				customerCount: z.number().optional(),
				status: VisitStatus.optional(),
				startTime: z.date().optional(),
				endTime: z.date().optional(),
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
				404: z.object({
					message: z.string(),
				}),
			},
			summary: 'Get a visit by id',
		},
	},
	{
		pathPrefix: '/restaurants/:restaurantId/visits',
	},
);
