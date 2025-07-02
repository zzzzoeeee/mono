import { basePaginationQuery } from 'shared/types';
import { Menu } from './menu.type';

export type PricePlanMenu = {
	id: string;
	pricePlanId: string;
	menuId: string;
	price: number;
	createdAt: Date;
	updatedAt: Date;
};

export type PricePlanMenuWithMenu = PricePlanMenu & {
	menu: Menu;
};

export type CreatePricePlanMenuInput = {
	menuId: string;
	price: number;
};

export type UpdatePricePlanMenuInput = {
	price: number;
};

export type GetPricePlanMenusQuery = basePaginationQuery & {
	sort?: 'price' | 'createdAt' | 'updatedAt';
	order?: 'asc' | 'desc';
};
