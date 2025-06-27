import { Controller, Req, UseGuards } from '@nestjs/common';
import { c } from '@repo/contracts';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { ReqWithUser } from 'shared/types';
import { getUserOrThrow } from 'shared/utils';
import { RestaurantUserRoles, Roles } from '../../auth/decorators';
import { RestaurantUserGuard, RolesGuard } from '../../auth/guards';
import { RestaurantService } from '../services/restaurant.service';

@Controller()
export class RestaurantController {
	constructor(private readonly restaurantService: RestaurantService) {}

	@TsRestHandler(c.restaurants.getRestaurant)
	@UseGuards(RestaurantUserGuard)
	@RestaurantUserRoles('MANAGER')
	async getRestaurant() {
		return tsRestHandler(c.restaurants.getRestaurant, async ({ params }) => {
			const restaurant = await this.restaurantService.getRestaurant(
				params.restaurantId,
			);
			return {
				status: 200,
				body: restaurant,
			};
		});
	}

	@TsRestHandler(c.restaurants.getAllRestaurants)
	@UseGuards(RolesGuard)
	@Roles('ADMIN', 'USER')
	async getAllRestaurants(@Req() req: ReqWithUser) {
		return tsRestHandler(c.restaurants.getAllRestaurants, async ({ query }) => {
			const user = getUserOrThrow(req, c.restaurants.getAllRestaurants);
			const restaurants = await this.restaurantService.getAllRestaurants(
				user,
				query,
			);
			return {
				status: 200,
				body: restaurants,
			};
		});
	}

	@TsRestHandler(c.restaurants.createRestaurant)
	@UseGuards(RolesGuard)
	@Roles('ADMIN')
	async createRestaurant() {
		return tsRestHandler(c.restaurants.createRestaurant, async ({ body }) => {
			const restaurant = await this.restaurantService.createRestaurant({
				...body,
				phone: body.phone || null,
				website: body.website || null,
				image: body.image || null,
			});
			return {
				status: 201,
				body: restaurant,
			};
		});
	}

	@TsRestHandler(c.restaurants.updateRestaurant)
	@UseGuards(RestaurantUserGuard)
	@RestaurantUserRoles('MANAGER')
	async updateRestaurant() {
		return tsRestHandler(
			c.restaurants.updateRestaurant,
			async ({ params, body }) => {
				const restaurant = await this.restaurantService.updateRestaurant(
					params.restaurantId,
					body,
				);
				return {
					status: 200,
					body: restaurant,
				};
			},
		);
	}

	@TsRestHandler(c.restaurants.deleteRestaurant)
	@UseGuards(RolesGuard)
	@Roles('ADMIN')
	async deleteRestaurant() {
		return tsRestHandler(c.restaurants.deleteRestaurant, async ({ params }) => {
			await this.restaurantService.deleteRestaurant(params.restaurantId);
			return {
				status: 204,
				body: {},
			};
		});
	}
}
