import { basePaginationQuery } from 'shared/types';

export type RestaurantUserRole = 'MANAGER' | 'STAFF';

export type RestaurantUser = {
	id: string;
	restaurantId: string;
	userId: string;
	role: RestaurantUserRole;
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
