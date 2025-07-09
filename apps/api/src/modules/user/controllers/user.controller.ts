import { Controller, Req, UseGuards } from '@nestjs/common';
import { c } from '@repo/contracts';
import { TsRestException, TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { ReqWithUser } from 'shared/types';
import { AuthenticatedGuard } from '../../auth/guards/authenticated.guard';

@Controller()
export class UserController {
	@UseGuards(AuthenticatedGuard)
	@TsRestHandler(c.users.me)
	async me(@Req() req: ReqWithUser) {
		return tsRestHandler(c.users.me, async () => {
			if (!req.user) {
				throw new TsRestException(c.users.me, {
					body: {
						message: 'User not found',
					},
					status: 404,
				});
			}
			return {
				status: 200,
				body: req.user,
			};
		});
	}
}
