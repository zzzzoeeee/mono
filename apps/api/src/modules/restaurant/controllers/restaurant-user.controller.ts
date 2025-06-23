import { Controller, Param, Req } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { c } from '@repo/contracts';
import { UseGuards } from '@nestjs/common';
import { RestaurantUserGuard } from '../../auth/guards';
import { RestaurantUserRoles } from '../../auth/decorators';
import { ReqWithUser } from 'shared/types';
import { RestaurantUserService } from '../services';
import { getUserOrThrow } from 'shared/utils';

@Controller()
@UseGuards(RestaurantUserGuard)
@RestaurantUserRoles('MANAGER')
export class RestaurantUserController {
	constructor(private readonly restaurantUserService: RestaurantUserService) {}

	@TsRestHandler(c.restaurantUsers.createRestaurantUser)
	async createRestaurantUser() {
		return tsRestHandler(
			c.restaurantUsers.createRestaurantUser,
			async ({ params, body }) => {
				const restaurantUser =
					await this.restaurantUserService.createRestaurantUser(
						params.restaurantId,
						body,
					);
				return {
					status: 201,
					body: restaurantUser,
				};
			},
		);
	}

	@TsRestHandler(c.restaurantUsers.updateRestaurantUser)
	async updateRestaurantUser(@Req() req: ReqWithUser) {
		return tsRestHandler(
			c.restaurantUsers.updateRestaurantUser,
			async ({ params, body }) => {
				const user = getUserOrThrow(
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
	async deleteRestaurantUser(@Req() req: ReqWithUser) {
		return tsRestHandler(
			c.restaurantUsers.deleteRestaurantUser,
			async ({ params }) => {
				const user = getUserOrThrow(
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
	async getAllRestaurantUsers() {
		return tsRestHandler(
			c.restaurantUsers.getAllRestaurantUsers,
			async ({ params, query }) => {
				const restaurantUsers =
					await this.restaurantUserService.getAllRestaurantUsers(
						params.restaurantId,
						query,
					);
				return {
					status: 200,
					body: restaurantUsers,
				};
			},
		);
	}

	@TsRestHandler(c.restaurantUsers.getRestaurantUser)
	async getRestaurantUser() {
		return tsRestHandler(
			c.restaurantUsers.getRestaurantUser,
			async ({ params }) => {
				const restaurantUser =
					await this.restaurantUserService.getRestaurantUser(
						params.restaurantId,
						params.id,
					);
				return {
					status: 200,
					body: restaurantUser,
				};
			},
		);
	}
}
