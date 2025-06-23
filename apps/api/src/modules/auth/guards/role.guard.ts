import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ReqWithUser } from 'shared/types';
import { UserRole } from '../../user/types';
import { ROLES_KEY } from '../decorators';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
			ROLES_KEY,
			[context.getHandler(), context.getClass()],
		);
		if (!requiredRoles) {
			return false;
		}

		const req: ReqWithUser = context.switchToHttp().getRequest();
		if (!req.user) {
			return false;
		}

		return requiredRoles.includes(req.user.role);
	}
}
