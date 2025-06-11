import { Controller, Req, UseGuards } from '@nestjs/common';
import { TsRestException, TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { c } from '@repo/contracts';
import { AuthService } from '../services';
import { LocalAuthGuard } from '../guards';
import { ReqWithUser } from 'shared/types';

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@TsRestHandler(c.auth.register)
	async register() {
		return tsRestHandler(c.auth.register, async ({ body }) => {
			const result = await this.authService.register(body);
			return {
				status: 201,
				body: result,
			};
		});
	}

	@UseGuards(LocalAuthGuard)
	@TsRestHandler(c.auth.login)
	async login(@Req() req: ReqWithUser) {
		return tsRestHandler(c.auth.login, async () => {
			if (!req.user) {
				throw new TsRestException(c.auth.login, {
					body: {
						message: 'Invalid credentials',
					},
					status: 401,
				});
			}

			return {
				status: 200,
				body: {
					user: req.user,
				},
			};
		});
	}
}
