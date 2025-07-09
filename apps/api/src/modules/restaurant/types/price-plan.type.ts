import { basePaginationQuery } from 'shared/types';

export type PricePlan = {
	id: string;
	restaurantId: string;
	name: string;
	description: string | null;
	price: number;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
};

export type CreatePricePlanInput = Omit<
	PricePlan,
	'id' | 'restaurantId' | 'createdAt' | 'updatedAt'
>;

export type UpdatePricePlanInput = Partial<CreatePricePlanInput>;

export type GetPricePlansQuery = basePaginationQuery & {
	sort?: 'price' | 'isActive' | 'name' | 'createdAt' | 'updatedAt';
	isActive?: boolean;
};
