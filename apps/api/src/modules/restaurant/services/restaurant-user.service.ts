import { Injectable } from '@nestjs/common';
import { RestaurantUser } from '@prisma-client';
import { TsRestException } from '@ts-rest/nest';
import { c } from '@repo/contracts';
import {
	CreateRestaurantUserInput,
	GetRestaurantUsersQuery,
	UpdateRestaurantUserInput,
} from '../types';
import { RestaurantUserRepository } from '../repositories';
import { User } from '../../user/types';

@Injectable()
export class RestaurantUserService {
	constructor(
		private readonly restaurantUserRepository: RestaurantUserRepository,
	) {}

	async createRestaurantUser(
		restaurantId: string,
		data: CreateRestaurantUserInput,
	): Promise<RestaurantUser> {
		return this.restaurantUserRepository.create(restaurantId, data);
	}

	async ensureNotLastManager(
		restaurantId: string,
		restaurantUserId: string,
	): Promise<void> {
		const allManager = await this.restaurantUserRepository.findAll(
			restaurantId,
			{
				role: 'MANAGER',
			},
		);

		if (allManager.length === 1 && allManager[0].id === restaurantUserId) {
			throw new TsRestException(c.restaurantUsers.updateRestaurantUser, {
				body: {
					message: 'At least one manager is required',
				},
				status: 400,
			});
		}
	}

	async updateRestaurantUser(
		restaurantId: string,
		restaurantUserId: string,
		data: UpdateRestaurantUserInput,
		actor: User,
	): Promise<RestaurantUser> {
		if (actor.role !== 'ADMIN' && data.role === 'STAFF') {
			await this.ensureNotLastManager(restaurantId, restaurantUserId);
		}

		return this.restaurantUserRepository.update(
			restaurantId,
			restaurantUserId,
			data,
		);
	}

	async deleteRestaurantUser(
		restaurantId: string,
		restaurantUserId: string,
		actor: User,
	): Promise<RestaurantUser> {
		if (actor.role !== 'ADMIN') {
			await this.ensureNotLastManager(restaurantId, restaurantUserId);
		}

		return this.restaurantUserRepository.delete(restaurantId, restaurantUserId);
	}

	async getAllRestaurantUsers(
		restaurantId: string,
		query: GetRestaurantUsersQuery,
	): Promise<RestaurantUser[]> {
		return this.restaurantUserRepository.findAll(restaurantId, query);
	}

	async getRestaurantUser(
		restaurantId: string,
		restaurantUserId: string,
	): Promise<RestaurantUser> {
		const restaurantUser = await this.restaurantUserRepository.findOne(
			restaurantId,
			restaurantUserId,
		);
		if (!restaurantUser || restaurantUser.restaurantId !== restaurantId) {
			throw new TsRestException(c.restaurantUsers.getRestaurantUser, {
				body: {
					message: `Restaurant user with ID ${restaurantUserId} not found in restaurant ${restaurantId}`,
				},
				status: 404,
			});
		}
		return restaurantUser;
	}
}
