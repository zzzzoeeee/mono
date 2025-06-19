import { Injectable } from '@nestjs/common';
import { PricePlan } from '@prisma-client';
import { PricePlanRepository } from '../repositories/price-plan.repository';
import { TsRestException } from '@ts-rest/nest';
import { c } from '@repo/contracts';
import { User } from '../../user/types';
import {
	CreatePricePlanInput,
	GetPricePlansQuery,
	UpdatePricePlanInput,
} from '../types/price-plan.type';
import { RestaurantService } from './restaurant.service';

@Injectable()
export class PricePlanService {
	constructor(
		private readonly pricePlanRepository: PricePlanRepository,
		private readonly restaurantService: RestaurantService,
	) {}

	private async validateRestaurantAccess(
		restaurantId: string,
		actor: User,
		errorType:
			| typeof c.pricePlans.createPricePlan
			| typeof c.pricePlans.updatePricePlan
			| typeof c.pricePlans.getPricePlans
			| typeof c.pricePlans.deletePricePlan,
	): Promise<void> {
		if (actor.role === 'USER' && actor.id) {
			const hasAccess =
				await this.restaurantService.checkUserAreRestaurantManager(
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

	async createPricePlan(
		restaurantId: string,
		data: CreatePricePlanInput,
		actor: User,
	): Promise<PricePlan> {
		await this.validateRestaurantAccess(
			restaurantId,
			actor,
			c.pricePlans.createPricePlan,
		);
		await this.restaurantService.getRestaurant(restaurantId, actor);
		return this.pricePlanRepository.create({ ...data, restaurantId });
	}

	async updatePricePlan(
		restaurantId: string,
		pricePlanId: string,
		data: UpdatePricePlanInput,
		actor: User,
	): Promise<PricePlan> {
		await this.validateRestaurantAccess(
			restaurantId,
			actor,
			c.pricePlans.updatePricePlan,
		);
		await this.getOnePricePlan(restaurantId, pricePlanId, actor);
		return this.pricePlanRepository.update(pricePlanId, data);
	}

	async getPricePlans(
		restaurantId: string,
		query: GetPricePlansQuery,
		actor: User,
	): Promise<PricePlan[]> {
		await this.validateRestaurantAccess(
			restaurantId,
			actor,
			c.pricePlans.getPricePlans,
		);
		await this.restaurantService.getRestaurant(restaurantId, actor);
		return this.pricePlanRepository.findAll(restaurantId, query);
	}

	async getOnePricePlan(
		restaurantId: string,
		pricePlanId: string,
		actor: User,
	): Promise<PricePlan> {
		await this.validateRestaurantAccess(
			restaurantId,
			actor,
			c.pricePlans.getPricePlans,
		);
		const pricePlan = await this.pricePlanRepository.findOne(
			restaurantId,
			pricePlanId,
		);
		if (!pricePlan) {
			throw new TsRestException(c.pricePlans.getPricePlans, {
				body: {
					message: `Price plan with ID ${pricePlanId} not found for restaurant ${restaurantId}`,
				},
				status: 404,
			});
		}
		return pricePlan;
	}

	async deletePricePlan(
		restaurantId: string,
		pricePlanId: string,
		actor: User,
	): Promise<void> {
		await this.validateRestaurantAccess(
			restaurantId,
			actor,
			c.pricePlans.deletePricePlan,
		);
		await this.getOnePricePlan(restaurantId, pricePlanId, actor);
		await this.pricePlanRepository.remove(pricePlanId);
	}
}
