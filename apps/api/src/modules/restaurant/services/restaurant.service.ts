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

	private async validateRestaurantAccess(
		restaurantId: string,
		userId: string | undefined,
		userRole: UserRole | undefined,
		errorType:
			| typeof c.restaurants.getRestaurant
			| typeof c.restaurants.updateRestaurant,
	): Promise<void> {
		if (userRole === 'USER' && userId) {
			const hasAccess = await this.checkUserAreRestaurantManager(
				userId,
				restaurantId,
			);
			if (!hasAccess) {
				throw new TsRestException(errorType, {
					body: {
						message: 'Access denied to this restaurant',
					},
					status: 403,
				});
			}
		}
	}

	async getRestaurant(
		restaurantId: string,
		userId?: string,
		userRole?: UserRole,
	): Promise<Restaurant> {
		await this.validateRestaurantAccess(
			restaurantId,
			userId,
			userRole,
			c.restaurants.getRestaurant,
		);

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
		userId: string,
		userRole: UserRole,
	): Promise<Restaurant> {
		await this.validateRestaurantAccess(
			restaurantId,
			userId,
			userRole,
			c.restaurants.updateRestaurant,
		);
		await this.getRestaurant(restaurantId);
		return this.restaurantRepository.update(restaurantId, data);
	}

	async deleteRestaurant(restaurantId: string): Promise<void> {
		await this.getRestaurant(restaurantId);
		await this.restaurantRepository.remove(restaurantId);
	}

	async checkUserAreRestaurantManager(
		userId: string,
		restaurantId: string,
	): Promise<boolean> {
		return this.restaurantRepository.checkUserAreRestaurantManager(
			userId,
			restaurantId,
		);
	}
}
