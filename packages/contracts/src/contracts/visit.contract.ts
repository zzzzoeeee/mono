import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { basePaginationQuery } from '../shared/queries';

extendZodWithOpenApi(z);

const c = initContract();

export const VisitStatus = z.enum(['USING', 'FINISHED']);

export const VisitSchema = z.object({
	id: z.string(),
	restaurantId: z.string(),
	tableId: z.string(),
	pricePlanId: z.string(),
	customerCount: z.number().min(1).max(100),
	createdAt: z.date(),
	updatedAt: z.date(),
	visitedAt: z.date(),
	departedAt: z.date().nullable(),
	duration: z.number().nullable().describe('Duration in minutes'),
	status: VisitStatus,
	notes: z.string().nullable(),
});

const departedTimeMustBeAfterVisitedTime = (obj: {
	visitedAt?: Date;
	departedAt?: Date | null;
}) => {
	if (obj.departedAt && obj.visitedAt && obj.departedAt <= obj.visitedAt) {
		return false;
	}
	return true;
};

const departedTimeMustBeAfterVisitedTimeMessage = {
	message: 'Departed time must be after visited time',
};

const statusMustBeConsistentWithDepartedAt = (obj: {
	status: z.infer<typeof VisitStatus>;
	departedAt?: Date | null;
}) => {
	if (obj.status === 'USING' && obj.departedAt) {
		return false;
	}
	if (obj.status === 'FINISHED' && !obj.departedAt) {
		return false;
	}
	return true;
};

const statusMustBeConsistentWithDepartedAtMessage = {
	message:
		'Status FINISHED must have departedAt and if status USING must not have departedAt',
};

export const visitContract = c.router(
	{
		createVisit: {
			method: 'POST',
			path: '',
			responses: {
				201: VisitSchema,
			},
			body: z
				.object({
					tableId: z.string(),
					pricePlanId: z.string(),
					customerCount: z.number(),
					visitedAt: z.coerce.date(),
					departedAt: z.coerce.date().nullable(),
					duration: z.number().nullable().describe('Duration in minutes'),
					status: VisitStatus,
					notes: z.string().nullable(),
				})
				.refine(
					departedTimeMustBeAfterVisitedTime,
					departedTimeMustBeAfterVisitedTimeMessage,
				)
				.refine(
					statusMustBeConsistentWithDepartedAt,
					statusMustBeConsistentWithDepartedAtMessage,
				),
			summary: 'Create a visit',
		},
		updateVisit: {
			method: 'PUT',
			path: '/:visitId',
			responses: {
				200: VisitSchema,
			},
			body: z
				.object({
					tableId: z.string(),
					pricePlanId: z.string(),
					customerCount: z.number(),
					visitedAt: z.coerce.date(),
					departedAt: z.coerce.date().nullable(),
					duration: z.number().nullable().describe('Duration in minutes'),
					status: VisitStatus,
					notes: z.string().nullable(),
				})
				.refine(
					departedTimeMustBeAfterVisitedTime,
					departedTimeMustBeAfterVisitedTimeMessage,
				)
				.refine(
					statusMustBeConsistentWithDepartedAt,
					statusMustBeConsistentWithDepartedAtMessage,
				),
			summary: 'Update a visit by id',
		},
		deleteVisit: {
			method: 'DELETE',
			path: '/:visitId',
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
			query: basePaginationQuery
				.extend({
					tableId: z.string().optional(),
					pricePlanId: z.string().optional(),
					customerCount: z
						.preprocess((val) => Number(val), z.number().min(1).max(100))
						.optional(),
					status: VisitStatus.optional(),
					visitedAt: z.coerce.date().optional(),
					usingTime: z.coerce.date().optional(),
					departedAt: z.coerce.date().optional(),
					sort: z.enum(['createdAt', 'updatedAt']).optional(),
				})
				.refine(
					(val) => {
						if ((val.visitedAt || val.departedAt) && val.usingTime) {
							return false;
						}
						return true;
					},
					{
						message:
							'Start and end time cannot be used at the same time as using time',
					},
				)
				.refine(
					(val) => {
						if (
							(val.visitedAt && !val.departedAt) ||
							(!val.visitedAt && val.departedAt)
						) {
							return false;
						}
						return true;
					},
					{
						message: 'Start and end time must be used together',
					},
				)
				.refine(
					departedTimeMustBeAfterVisitedTime,
					departedTimeMustBeAfterVisitedTimeMessage,
				),
			responses: {
				200: z.array(VisitSchema),
			},
			summary: 'Get all visits',
		},
		getVisit: {
			method: 'GET',
			path: '/:visitId',
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
