import { basePaginationQuery } from 'shared/types';

export type Restaurant = {
	id: string;
	name: string;
	address: string;
	phone: string | null;
	website: string | null;
	image: string | null;
	createdAt: Date;
	updatedAt: Date;
};

export type CreateRestaurantInput = Omit<
	Restaurant,
	'id' | 'createdAt' | 'updatedAt'
>;

export type UpdateRestaurantInput = Partial<CreateRestaurantInput>;

export type GetRestaurantsQuery = basePaginationQuery & {
	sort?: 'name' | 'createdAt' | 'updatedAt';
};
