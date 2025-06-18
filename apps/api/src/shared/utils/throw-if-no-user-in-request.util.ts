import { ReqWithUser } from 'shared/types';
import { TsRestException } from '@ts-rest/nest';
import { AppRoute } from '@ts-rest/core';
import { User } from 'modules/user/types';

export const throwIfNoUserInRequest = (
	req: ReqWithUser,
	errorType: AppRoute,
): User => {
	if (!req.user) {
		throw new TsRestException(errorType, {
			body: {
				message: 'Unauthorized',
			},
			status: 401,
		});
	}

	return req.user;
};
