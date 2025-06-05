import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { c } from '@repo/contracts';
import { RestaurantService } from '../services/restaurant.service';

@Controller()
export class RestaurantController {
	constructor(private readonly restaurantService: RestaurantService) {}

	@TsRestHandler(c.restaurants.getRestaurant)
	async getRestaurant() {
		return tsRestHandler(c.restaurants.getRestaurant, async ({ params }) => {
			const restaurant = await this.restaurantService.getRestaurant(params.id);
			return {
				status: 200,
				body: restaurant,
			};
		});
	}

	@TsRestHandler(c.restaurants.getAllRestaurants)
	async getAllRestaurants() {
		return tsRestHandler(c.restaurants.getAllRestaurants, async ({query}) => {
			const restaurants = await this.restaurantService.getAllRestaurants(query);
			return {
				status: 200,
				body: restaurants,
			};
		});
	}

	@TsRestHandler(c.restaurants.createRestaurant)
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
	async updateRestaurant() {
		return tsRestHandler(
			c.restaurants.updateRestaurant,
			async ({ params, body }) => {
				const restaurant = await this.restaurantService.updateRestaurant(
					params.id,
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
