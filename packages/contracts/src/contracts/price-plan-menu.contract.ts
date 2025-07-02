import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { basePaginationQuery } from '../shared/queries';
import { MenuSchema } from './menu.contract';

extendZodWithOpenApi(z);

const c = initContract();

const PricePlanMenuSchema = z.object({
	id: z.string(),
	pricePlanId: z.string(),
	menuId: z.string(),
	price: z.number().min(0),
	createdAt: z.date(),
	updatedAt: z.date(),
});

const PricePlanMenuWithRelationsSchema = PricePlanMenuSchema.extend({
	menu: MenuSchema,
});

export const pricePlanMenuContract = c.router(
	{
		createPricePlanMenu: {
			method: 'POST',
			path: '',
			responses: {
				201: PricePlanMenuSchema,
			},
			body: z.object({
				menuId: z.string(),
				price: z.number().min(0),
			}),
			summary: 'Add a menu item to a price plan',
		},
		updatePricePlanMenu: {
			method: 'PUT',
			path: '/:pricePlanMenuId',
			responses: {
				200: PricePlanMenuSchema,
			},
			body: z.object({
				price: z.number().min(0),
			}),
			summary: 'Update a price plan menu item price',
		},
		getPricePlanMenus: {
			method: 'GET',
			path: '',
			responses: {
				200: z.array(PricePlanMenuWithRelationsSchema),
			},
			query: basePaginationQuery.extend({
				sort: z.enum(['price', 'createdAt', 'updatedAt']).default('createdAt'),
				order: z.enum(['asc', 'desc']).default('asc'),
			}),
			summary: 'Get menu items for a price plan',
		},
		deletePricePlanMenu: {
			method: 'DELETE',
			path: '/:pricePlanMenuId',
			responses: {
				200: z.object({
					message: z.string(),
				}),
			},
			summary: 'Remove a menu item from a price plan',
		},
	},
	{
		pathPrefix: '/restaurants/:restaurantId/price-plans/:pricePlanId/menus',
	},
);
