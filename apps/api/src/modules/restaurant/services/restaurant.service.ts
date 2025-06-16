import { Injectable } from '@nestjs/common';
import { Restaurant } from '@prisma-client';
import { RestaurantRepository } from '../repositories/restaurant.repository';
import { c } from '@repo/contracts';
import { TsRestException } from '@ts-rest/nest';
import {
	CreateRestaurantInput,
	GetRestaurantsQuery,
	UpdateRestaurantInput,
} from '../types';

@Injectable()
export class RestaurantService {
	constructor(private readonly restaurantRepository: RestaurantRepository) {}

	async createRestaurant(data: CreateRestaurantInput): Promise<Restaurant> {
		return this.restaurantRepository.create(data);
	}

	async getAllRestaurants(query: GetRestaurantsQuery): Promise<Restaurant[]> {
		return this.restaurantRepository.findAll(query);
	}

	async getRestaurant(id: string): Promise<Restaurant> {
		const restaurant = await this.restaurantRepository.findOne(id);
		if (!restaurant) {
			throw new TsRestException(c.restaurants.getRestaurant, {
				body: {
					message: `Restaurant with ID ${id} not found`,
				},
				status: 404,
			});
		}
		return restaurant;
	}

	async updateRestaurant(
		id: string,
		data: UpdateRestaurantInput,
	): Promise<Restaurant> {
		await this.getRestaurant(id);
		return this.restaurantRepository.update(id, data);
	}

	async deleteRestaurant(id: string): Promise<void> {
		await this.getRestaurant(id);
		await this.restaurantRepository.remove(id);
	}
}
