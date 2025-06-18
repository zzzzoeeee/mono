import { Injectable } from '@nestjs/common';
import { RestaurantUser } from '@prisma-client';
import { TsRestException } from '@ts-rest/nest';
import { c } from '@repo/contracts';
import {
	CreateRestaurantUserInput,
	GetRestaurantUsersQuery,
	UpdateRestaurantUserInput,
} from '../types';
import {
	RestaurantUserRepository,
	RestaurantRepository,
} from '../repositories';
import { User, UserRole } from '../../user/types';

@Injectable()
export class RestaurantUserService {
	constructor(
		private readonly restaurantUserRepository: RestaurantUserRepository,
		private readonly restaurantRepository: RestaurantRepository,
	) {}

	private async validateRestaurantUserAccess(
		restaurantId: string,
		actor: User | undefined,
		errorType:
			| typeof c.restaurantUsers.createRestaurantUser
			| typeof c.restaurantUsers.updateRestaurantUser
			| typeof c.restaurantUsers.deleteRestaurantUser
			| typeof c.restaurantUsers.getRestaurantUser
			| typeof c.restaurantUsers.getAllRestaurantUsers,
	): Promise<void> {
		if (actor?.role === 'USER' && actor.id) {
			const hasAccess =
				await this.restaurantRepository.checkUserAreRestaurantManager(
					actor.id,
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

	async createRestaurantUser(
		restaurantId: string,
		data: CreateRestaurantUserInput,
		actor: User,
	): Promise<RestaurantUser> {
		await this.validateRestaurantUserAccess(
			restaurantId,
			actor,
			c.restaurantUsers.createRestaurantUser,
		);
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
		await this.validateRestaurantUserAccess(
			restaurantId,
			actor,
			c.restaurantUsers.updateRestaurantUser,
		);

		if (actor.role !== 'ADMIN' && data.role === 'STAFF') {
			await this.ensureNotLastManager(restaurantId, restaurantUserId);
		}

		await this.getRestaurantUser(restaurantId, restaurantUserId);
		return this.restaurantUserRepository.update(restaurantUserId, data);
	}

	async deleteRestaurantUser(
		restaurantId: string,
		restaurantUserId: string,
		actor: User,
	): Promise<RestaurantUser> {
		await this.validateRestaurantUserAccess(
			restaurantId,
			actor,
			c.restaurantUsers.deleteRestaurantUser,
		);

		if (actor.role !== 'ADMIN') {
			await this.ensureNotLastManager(restaurantId, restaurantUserId);
		}

		await this.getRestaurantUser(restaurantId, restaurantUserId);
		return this.restaurantUserRepository.remove(restaurantUserId);
	}

	async getAllRestaurantUsers(
		restaurantId: string,
		query: GetRestaurantUsersQuery,
		actor: User,
	): Promise<RestaurantUser[]> {
		await this.validateRestaurantUserAccess(
			restaurantId,
			actor,
			c.restaurantUsers.getAllRestaurantUsers,
		);
		return this.restaurantUserRepository.findAll(restaurantId, query);
	}

	async getRestaurantUser(
		restaurantId: string,
		restaurantUserId: string,
		actor?: User,
	): Promise<RestaurantUser> {
		await this.validateRestaurantUserAccess(
			restaurantId,
			actor,
			c.restaurantUsers.getRestaurantUser,
		);
		const restaurantUser =
			await this.restaurantUserRepository.findOne(restaurantUserId);
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
