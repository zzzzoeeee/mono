import { basePaginationQuery } from 'shared/types';

export type MenuCategory = 'APPETIZER' | 'MAIN' | 'DESSERT' | 'BEVERAGE';

export type Menu = {
	id: string;
	restaurantId: string;
	name: string;
	description: string | null;
	image: string | null;
	price: number;
	category: MenuCategory;
	isAvailable: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type CreateMenuInput = Omit<
	Menu,
	'id' | 'restaurantId' | 'createdAt' | 'updatedAt'
>;

export type UpdateMenuInput = Partial<CreateMenuInput>;

export type GetMenusQuery = basePaginationQuery & {
	category?: MenuCategory;
	sort?: 'name' | 'price' | 'isAvailable' | 'createdAt' | 'updatedAt';
};
