import { AppRoute } from '@ts-rest/core';
import { TsRestException } from '@ts-rest/nest';
import { User } from 'modules/user/types';
import { ReqWithUser } from 'shared/types';

export const getUserOrThrow = (req: ReqWithUser, errorType: AppRoute): User => {
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
