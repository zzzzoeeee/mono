import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { authContract } from './auth.contract';
import { menuContract } from './menu.contract';
import { orderContract } from './order.contract';
import { pricePlanContract } from './price-plan.contract';
import { pricePlanMenuContract } from './price-plan-menu.contract';
import { restaurantContract } from './restaurant.contract';
import { restaurantUserContract } from './restaurant-user.contract';
import { tableContract } from './table.contract';
import { userContract } from './user.contract';
import { visitContract } from './visit.contract';

extendZodWithOpenApi(z);

const contract = initContract();

export const commonResponses = {
	400: z.object(
		{
			statusCode: z.number().default(400),
			message: z.string().default('Bad Request'),
			detail: z.string().or(z.object({})).nullable().default(null),
		},
		{
			description: 'Bad Request',
		},
	),
	401: z.object(
		{
			statusCode: z.number().default(401),
			message: z.string().default('Unauthorized'),
		},
		{
			description: 'Unauthorized',
		},
	),
	403: z.object(
		{
			statusCode: z.number().default(403),
			message: z.string().default('Forbidden'),
		},
		{
			description: 'Forbidden',
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
};

export const c = contract.router(
	{
		restaurants: restaurantContract,
		menus: menuContract,
		pricePlans: pricePlanContract,
		pricePlanMenus: pricePlanMenuContract,
		tables: tableContract,
		visits: visitContract,
		orders: orderContract,
		auth: authContract,
		users: userContract,
		restaurantUsers: restaurantUserContract,
	},
	{
		commonResponses,
	},
);
