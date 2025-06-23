import { Injectable } from '@nestjs/common';
import { PricePlan } from '@prisma-client';
import { PricePlanRepository } from '../repositories/price-plan.repository';
import {
	CreatePricePlanInput,
	GetPricePlansQuery,
	UpdatePricePlanInput,
} from '../types/price-plan.type';

@Injectable()
export class PricePlanService {
	constructor(private readonly pricePlanRepository: PricePlanRepository) {}

	async createPricePlan(
		restaurantId: string,
		data: CreatePricePlanInput,
	): Promise<PricePlan> {
		return this.pricePlanRepository.create({ ...data, restaurantId });
	}

	async updatePricePlan(
		restaurantId: string,
		pricePlanId: string,
		data: UpdatePricePlanInput,
	): Promise<PricePlan> {
		return this.pricePlanRepository.update(restaurantId, pricePlanId, data);
	}

	async getPricePlans(
		restaurantId: string,
		query: GetPricePlansQuery,
	): Promise<PricePlan[]> {
		return this.pricePlanRepository.findAll(restaurantId, query);
	}

	async deletePricePlan(
		restaurantId: string,
		pricePlanId: string,
	): Promise<void> {
		await this.pricePlanRepository.delete(restaurantId, pricePlanId);
	}
}
