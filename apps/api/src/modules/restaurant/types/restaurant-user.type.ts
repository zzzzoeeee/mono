import { basePaginationQuery } from 'shared/types';

export type RestaurantUser = {
	id: string;
	restaurantId: string;
	userId: string;
	role: 'MANAGER' | 'STAFF';
	createdAt: Date;
	updatedAt: Date;
};

export type CreateRestaurantUserInput = Omit<
	RestaurantUser,
	'id' | 'restaurantId' | 'createdAt' | 'updatedAt'
>;

export type UpdateRestaurantUserInput = Pick<RestaurantUser, 'role'>;

export type GetRestaurantUsersQuery = basePaginationQuery & {
	sort?: 'createdAt' | 'updatedAt';
	role?: 'MANAGER' | 'STAFF';
};
