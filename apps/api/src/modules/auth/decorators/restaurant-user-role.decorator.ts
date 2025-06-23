import { SetMetadata } from '@nestjs/common';
import { RestaurantUserRole } from '../../restaurant/types';

export const RESTAURANT_USER_ROLES_KEY = 'restaurant-user-roles';
export const RestaurantUserRoles = (...roles: RestaurantUserRole[]) =>
	SetMetadata(RESTAURANT_USER_ROLES_KEY, roles);
