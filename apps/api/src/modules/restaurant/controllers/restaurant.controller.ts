import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { c } from '@repo/contracts';

@Controller()
export class RestaurantController {
	@TsRestHandler(c.restaurants.getRestaurant)
	async getRestaurant() {
		return tsRestHandler(c.restaurants.getRestaurant, async ({ params }) => {
			return {
				status: 200,
				body: {
					id: '1',
					name: 'Restaurant 1',
					address: 'Address 1',
					phone: 'Phone 1',
					website: 'Website 1',
					image: 'Image 1',
				},
			};
		});
	}

	@TsRestHandler(c.restaurants.getAllRestaurants)
	async getAllRestaurants() {
		return tsRestHandler(c.restaurants.getAllRestaurants, async () => {
			return {
				status: 200,
				body: [
					{
						id: '1',
						name: 'Restaurant 1',
						address: 'Address 1',
						phone: 'Phone 1',
						website: 'Website 1',
						image: 'Image 1',
					},
				],
			};
		});
	}

	@TsRestHandler(c.restaurants.createRestaurant)
	async createRestaurant() {
		return tsRestHandler(c.restaurants.createRestaurant, async ({ body }) => {
			return {
				status: 201,
				body: {
					id: '1',
					name: 'Restaurant 1',
					address: 'Address 1',
					phone: 'Phone 1',
					website: 'Website 1',
					image: 'Image 1',
				},
			};
		});
	}

	@TsRestHandler(c.restaurants.updateRestaurant)
	async updateRestaurant() {
		return tsRestHandler(
			c.restaurants.updateRestaurant,
			async ({ params, body }) => {
				return {
					status: 200,
					body: {
						id: '1',
						name: 'Restaurant 1',
						address: 'Address 1',
						phone: 'Phone 1',
						website: 'Website 1',
						image: 'Image 1',
					},
				};
			},
		);
	}

	@TsRestHandler(c.restaurants.deleteRestaurant)
	async deleteRestaurant() {
		return tsRestHandler(c.restaurants.deleteRestaurant, async ({ params }) => {
			return {
				status: 204,
				body: {},
			};
		});
	}
}
