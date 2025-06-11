import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { restaurantContract } from './restaurant.contract';
import { tableContract } from './table.contract';
import { visitContract } from './visit.contract';
import { pricePlanContract } from './price-plan.contract';
import { menuContract } from './menu.contract';
import { orderContract } from './order.contract';
import { authContract } from './auth.contract';
import { userContract } from './user.contract';

extendZodWithOpenApi(z);

const contract = initContract();

export const c = contract.router(
	{
		restaurants: restaurantContract,
		menus: menuContract,
		pricePlans: pricePlanContract,
		tables: tableContract,
		visits: visitContract,
		orders: orderContract,
		auth: authContract,
		users: userContract,
	},
	{
		commonResponses: {
			400: z.object(
				{
					statusCode: z.number().default(400),
					message: z.string().default('Bad Request'),
				},
				{
					description: 'Bad Request',
				},
			),
			404: z.object(
				{
					statusCode: z.number().default(404),
					message: z.string().default('Not Found'),
				},
				{
					description: 'Not Found',
				},
			),
			409: z.object(
				{
					statusCode: z.number().default(409),
					message: z.string().default('Conflict'),
				},
				{
					description: 'Conflict',
				},
			),
			422: z.object(
				{
					statusCode: z.number().default(422),
					message: z.string().default('Unprocessable Entity'),
				},
				{
					description: 'Unprocessable Entity',
				},
			),
			500: z.object(
				{
					statusCode: z.number().default(500),
					message: z.string().default('Internal Server Error'),
				},
				{
					description: 'Internal Server Error',
				},
			),
		},
	},
);
