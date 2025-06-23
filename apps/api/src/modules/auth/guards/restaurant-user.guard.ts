import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RESTAURANT_USER_ROLES_KEY } from '../decorators';
import { RestaurantUserRole } from '../../restaurant/types';
import { ReqWithUser } from 'shared/types';
import { RestaurantService } from '../../restaurant/services';

@Injectable()
export class RestaurantUserGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private restaurantService: RestaurantService,
	) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<
			RestaurantUserRole[]
		>(RESTAURANT_USER_ROLES_KEY, [context.getHandler(), context.getClass()]);
		if (!requiredRoles) {
			return false;
		}

		const req: ReqWithUser = context.switchToHttp().getRequest();
		if (!req.user) {
			return false;
		}

		if (req.user.role === 'ADMIN') {
			return true;
		}

		const hasAccess = await this.restaurantService.isUserInRestaurantWithRoles(
			req.user.id,
			req.params.restaurantId,
			requiredRoles,
		);
		return hasAccess;
	}
}
