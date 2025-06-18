import { Controller, Param, Req } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { c } from '@repo/contracts';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../auth/guards';
import { Roles } from '../../auth/decorators';
import { ReqWithUser } from 'shared/types';
import { RestaurantUserService } from '../services';
import { throwIfNoUserInRequest } from 'shared/utils';

@Controller()
@UseGuards(RolesGuard)
export class RestaurantUserController {
	constructor(private readonly restaurantUserService: RestaurantUserService) {}

	@TsRestHandler(c.restaurantUsers.createRestaurantUser)
	@Roles('ADMIN', 'USER')
	async createRestaurantUser(@Req() req: ReqWithUser) {
		return tsRestHandler(
			c.restaurantUsers.createRestaurantUser,
			async ({ params, body }) => {
				const user = throwIfNoUserInRequest(
					req,
					c.restaurantUsers.createRestaurantUser,
				);

				const restaurantUser =
					await this.restaurantUserService.createRestaurantUser(
						params.restaurantId,
						body,
						user,
					);
				return {
					status: 201,
					body: restaurantUser,
				};
			},
		);
	}

	@TsRestHandler(c.restaurantUsers.updateRestaurantUser)
	@Roles('ADMIN', 'USER')
	async updateRestaurantUser(@Req() req: ReqWithUser) {
		return tsRestHandler(
			c.restaurantUsers.updateRestaurantUser,
			async ({ params, body }) => {
				const user = throwIfNoUserInRequest(
					req,
					c.restaurantUsers.updateRestaurantUser,
				);

				const restaurantUser =
					await this.restaurantUserService.updateRestaurantUser(
						params.restaurantId,
						params.id,
						body,
						user,
					);
				return {
					status: 200,
					body: restaurantUser,
				};
			},
		);
	}

	@TsRestHandler(c.restaurantUsers.deleteRestaurantUser)
	@Roles('ADMIN', 'USER')
	async deleteRestaurantUser(@Req() req: ReqWithUser) {
		return tsRestHandler(
			c.restaurantUsers.deleteRestaurantUser,
			async ({ params }) => {
				const user = throwIfNoUserInRequest(
					req,
					c.restaurantUsers.deleteRestaurantUser,
				);

				await this.restaurantUserService.deleteRestaurantUser(
					params.restaurantId,
					params.id,
					user,
				);
				return {
					status: 200,
					body: { message: 'Restaurant user deleted' },
				};
			},
		);
	}

	@TsRestHandler(c.restaurantUsers.getAllRestaurantUsers)
	@Roles('ADMIN', 'USER')
	async getAllRestaurantUsers(@Req() req: ReqWithUser) {
		return tsRestHandler(
			c.restaurantUsers.getAllRestaurantUsers,
			async ({ params, query }) => {
				const user = throwIfNoUserInRequest(
					req,
					c.restaurantUsers.getAllRestaurantUsers,
				);

				const restaurantUsers =
					await this.restaurantUserService.getAllRestaurantUsers(
						params.restaurantId,
						query,
						user,
					);
				return {
					status: 200,
					body: restaurantUsers,
				};
			},
		);
	}

	@TsRestHandler(c.restaurantUsers.getRestaurantUser)
	@Roles('ADMIN', 'USER')
	async getRestaurantUser(@Req() req: ReqWithUser) {
		return tsRestHandler(
			c.restaurantUsers.getRestaurantUser,
			async ({ params }) => {
				const user = throwIfNoUserInRequest(
					req,
					c.restaurantUsers.getRestaurantUser,
				);

				const restaurantUser =
					await this.restaurantUserService.getRestaurantUser(
						params.restaurantId,
						params.id,
						user,
					);
				return {
					status: 200,
					body: restaurantUser,
				};
			},
		);
	}
}
