import { Controller, Req, UseGuards } from '@nestjs/common';
import { TsRestException, TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { c } from '@repo/contracts';
import { AuthService } from '../services';
import { LoginAuthGuard } from '../guards';
import { ReqWithUser } from 'shared/types';
import { Public } from '../decorators';

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
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

	@UseGuards(LoginAuthGuard)
	@Public()
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

	@TsRestHandler(c.auth.logout)
	async logout(@Req() req: ReqWithUser) {
		return tsRestHandler(c.auth.logout, async () => {
			return new Promise((resolve, reject) => {
				req.logout((err) => {
					if (err) {
						return reject(err);
					}

					resolve({
						status: 204,
						body: {},
					});
				});
			});
		});
	}
}
