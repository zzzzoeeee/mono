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
import { UserRole } from '../../user/types';

@Injectable()
export class RestaurantService {
	constructor(private readonly restaurantRepository: RestaurantRepository) {}

	async createRestaurant(data: CreateRestaurantInput): Promise<Restaurant> {
		return this.restaurantRepository.create(data);
	}

	async getAllRestaurants(query: GetRestaurantsQuery): Promise<Restaurant[]> {
		return this.restaurantRepository.findAll(query);
	}

	async getRestaurant(
		id: string,
		userId?: string,
		userRole?: UserRole,
	): Promise<Restaurant> {
		if (userRole === 'ADMIN' && userId) {
			const hasAccess = await this.checkUserBelongsToRestaurant(userId, id);
			if (!hasAccess) {
				throw new TsRestException(c.restaurants.getRestaurant, {
					body: {
						message: 'Access denied to this restaurant',
					},
					status: 403,
				});
			}
		}

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
		userId: string,
		userRole: UserRole,
	): Promise<Restaurant> {
		if (userRole === 'ADMIN' && userId) {
			const hasAccess = await this.checkUserBelongsToRestaurant(userId, id);
			if (!hasAccess) {
				throw new TsRestException(c.restaurants.updateRestaurant, {
					body: {
						message: 'Access denied to this restaurant',
					},
					status: 403,
				});
			}
		}

		await this.getRestaurant(id);
		return this.restaurantRepository.update(id, data);
	}

	async deleteRestaurant(id: string): Promise<void> {
		await this.getRestaurant(id);
		await this.restaurantRepository.remove(id);
	}

	async checkUserBelongsToRestaurant(
		userId: string,
		restaurantId: string,
	): Promise<boolean> {
		return this.restaurantRepository.checkUserBelongsToRestaurant(
			userId,
			restaurantId,
		);
	}
}
