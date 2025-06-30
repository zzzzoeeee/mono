import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { ReqWithUser } from 'shared/types';
import { RestaurantService, VisitService } from '../../restaurant/services';
import { RestaurantUserRole } from '../../restaurant/types';
import { IS_PUBLIC_KEY, RESTAURANT_USER_ROLES_KEY } from '../decorators';

@Injectable()
export class RestaurantUserGuard implements CanActivate {
	constructor(
		private reflector: Reflector,
		private restaurantService: RestaurantService,
		private visitService: VisitService,
	) {}

	private async validateUserRoles(
		req: ReqWithUser,
		requiredRoles: RestaurantUserRole[],
	): Promise<boolean> {
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

	private async validateGuestVisit(req: Request): Promise<boolean> {
		const visitId = req.headers['visit-id'] || req.params.visitId;

		if (!visitId || typeof visitId !== 'string') {
			return false;
		}

		const visit = await this.visitService.getVisit(
			req.params.restaurantId,
			visitId,
		);
		if (visit.status !== 'USING') {
			return false;
		}
		return true;
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const requiredRoles = this.reflector.getAllAndOverride<
			(RestaurantUserRole | 'GUEST')[]
		>(RESTAURANT_USER_ROLES_KEY, [context.getHandler(), context.getClass()]);
		if (!requiredRoles) {
			return false;
		}

		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}

		const req: ReqWithUser = context.switchToHttp().getRequest();

		const { restaurantUserRoles, hasGuest } = requiredRoles.reduce(
			(a, curr) => {
				if (curr === 'GUEST') {
					return {
						hasGuest: true,
						restaurantUserRoles: a.restaurantUserRoles,
					};
				} else {
					return {
						hasGuest: a.hasGuest,
						restaurantUserRoles: [...a.restaurantUserRoles, curr],
					};
				}
			},
			{
				hasGuest: false,
				restaurantUserRoles: [] as RestaurantUserRole[],
			},
		);

		const results = await Promise.all([
			...(hasGuest ? [this.validateGuestVisit(req)] : []),
			...(restaurantUserRoles.length
				? [this.validateUserRoles(req, restaurantUserRoles)]
				: []),
		]);

		return results.some((result) => result);
	}
}
