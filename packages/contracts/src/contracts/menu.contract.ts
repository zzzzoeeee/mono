import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { basePaginationQuery } from '../shared/queries';

extendZodWithOpenApi(z);

const c = initContract();

const MenuCategorySchema = z.enum(['APPETIZER', 'MAIN', 'DESSERT', 'BEVERAGE']);

export const MenuSchema = z.object({
	id: z.string(),
	restaurantId: z.string(),
	name: z.string(),
	description: z.string().nullable(),
	image: z.string().nullable(),
	price: z.number().min(0),
	category: MenuCategorySchema,
	isAvailable: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export const menuContract = c.router(
	{
		createMenu: {
			method: 'POST',
			path: '',
			responses: {
				201: MenuSchema,
			},
			body: z.object({
				name: z.string(),
				description: z.string().nullable(),
				image: z.string().nullable(),
				price: z.number().min(0),
				category: MenuCategorySchema,
				isAvailable: z.boolean().default(true),
			}),
			summary: 'Create a new menu item',
		},
		updateMenu: {
			method: 'PUT',
			path: '/:menuId',
			responses: {
				200: MenuSchema,
			},
			body: z.object({
				name: z.string(),
				description: z.string().nullable(),
				image: z.string().nullable(),
				price: z.number().min(0),
				category: MenuCategorySchema,
				isAvailable: z.boolean(),
			}),
			summary: 'Update a menu item',
		},
		getMenus: {
			method: 'GET',
			path: '',
			responses: {
				200: z.array(MenuSchema),
			},
			query: basePaginationQuery.extend({
				category: MenuCategorySchema.optional(),
				sort: z
					.enum(['name', 'price', 'isAvailable', 'createdAt', 'updatedAt'])
					.optional(),
			}),
			summary: 'Get menu items for a restaurant',
		},
		deleteMenu: {
			method: 'DELETE',
			path: '/:menuId',
			responses: {
				200: z.object({
					message: z.string(),
				}),
			},
			summary: 'Delete a menu item',
		},
	},
	{
		pathPrefix: '/restaurants/:restaurantId/menus',
	},
);
