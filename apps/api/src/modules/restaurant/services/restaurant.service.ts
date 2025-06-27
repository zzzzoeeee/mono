import { Injectable } from '@nestjs/common';
import { Restaurant, RestaurantUserRole } from '@prisma-client';
import { c } from '@repo/contracts';
import { TsRestException } from '@ts-rest/nest';
import { User } from 'modules/user/types';
import { RestaurantRepository } from '../repositories/restaurant.repository';
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

	async getAllRestaurants(
		actor: User,
		rawQuery: GetRestaurantsQuery,
	): Promise<Restaurant[]> {
		const query = {
			...rawQuery,
			...(actor.role === 'ADMIN' ? {} : { userId: actor.id }),
		};

		return this.restaurantRepository.findAll(query);
	}

	async getRestaurant(restaurantId: string): Promise<Restaurant> {
		const restaurant = await this.restaurantRepository.findOne(restaurantId);
		if (!restaurant) {
			throw new TsRestException(c.restaurants.getRestaurant, {
				body: {
					message: `Restaurant with ID ${restaurantId} not found`,
				},
				status: 404,
			});
		}
		return restaurant;
	}

	async updateRestaurant(
		restaurantId: string,
		data: UpdateRestaurantInput,
	): Promise<Restaurant> {
		return this.restaurantRepository.update(restaurantId, data);
	}

	async deleteRestaurant(restaurantId: string): Promise<void> {
		await this.restaurantRepository.delete(restaurantId);
	}

	async isUserInRestaurantWithRoles(
		userId: string,
		restaurantId: string,
		roles: RestaurantUserRole[] | RestaurantUserRole,
	): Promise<boolean> {
		return this.restaurantRepository.isUserInRestaurantWithRoles(
			userId,
			restaurantId,
			roles,
		);
	}
}
