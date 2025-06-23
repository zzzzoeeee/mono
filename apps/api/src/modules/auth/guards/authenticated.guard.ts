import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ReqWithUser } from 'shared/types';
import { IS_PUBLIC_KEY } from '../decorators';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	async canActivate(context: ExecutionContext) {
		const request: ReqWithUser = context.switchToHttp().getRequest();

		const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
			context.getHandler(),
			context.getClass(),
		]);
		if (isPublic) {
			return true;
		}

		return !!request.user;
	}
}
