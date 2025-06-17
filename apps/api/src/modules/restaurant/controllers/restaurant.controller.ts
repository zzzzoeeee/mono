import { Controller, Req } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { c } from '@repo/contracts';
import { RestaurantService } from '../services/restaurant.service';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../auth/guards';
import { Roles } from '../../auth/decorators';
import { ReqWithUser } from 'shared/types';
import { TsRestException } from '@ts-rest/nest';

@Controller()
@UseGuards(RolesGuard)
export class RestaurantController {
	constructor(private readonly restaurantService: RestaurantService) {}

	@TsRestHandler(c.restaurants.getRestaurant)
	@Roles('ADMIN', 'USER')
	async getRestaurant(@Req() req: ReqWithUser) {
		return tsRestHandler(c.restaurants.getRestaurant, async ({ params }) => {
			if (!req.user) {
				throw new TsRestException(c.restaurants.getRestaurant, {
					body: {
						message: 'Unauthorized',
					},
					status: 401,
				});
			}

			const restaurant = await this.restaurantService.getRestaurant(
				params.id,
				req.user.id,
				req.user.role,
			);
			return {
				status: 200,
				body: restaurant,
			};
		});
	}

	@TsRestHandler(c.restaurants.getAllRestaurants)
	@Roles('ADMIN')
	async getAllRestaurants() {
		return tsRestHandler(c.restaurants.getAllRestaurants, async ({ query }) => {
			const restaurants = await this.restaurantService.getAllRestaurants(query);
			return {
				status: 200,
				body: restaurants,
			};
		});
	}

	@TsRestHandler(c.restaurants.createRestaurant)
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
	@Roles('ADMIN', 'USER')
	async updateRestaurant(@Req() req: ReqWithUser) {
		return tsRestHandler(
			c.restaurants.updateRestaurant,
			async ({ params, body }) => {
				if (!req.user) {
					throw new TsRestException(c.restaurants.updateRestaurant, {
						body: {
							message: 'Unauthorized',
						},
						status: 401,
					});
				}

				const restaurant = await this.restaurantService.updateRestaurant(
					params.id,
					body,
					req.user.id,
					req.user.role,
				);
				return {
					status: 200,
					body: restaurant,
				};
			},
		);
	}

	@TsRestHandler(c.restaurants.deleteRestaurant)
	@Roles('ADMIN')
	async deleteRestaurant() {
		return tsRestHandler(c.restaurants.deleteRestaurant, async ({ params }) => {
			await this.restaurantService.deleteRestaurant(params.id);
			return {
				status: 204,
				body: {},
			};
		});
	}
}
