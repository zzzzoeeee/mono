import { BadRequestException, Injectable } from '@nestjs/common';
import { PricePlan } from '@prisma-client';
import { commonResponses } from '@repo/contracts';
import z from 'zod';
import { PricePlanRepository } from '../repositories/price-plan.repository';
import {
	CreatePricePlanInput,
	GetPricePlansQuery,
	UpdatePricePlanInput,
} from '../types/price-plan.type';
import { CommonService } from './common.service';

@Injectable()
export class PricePlanService {
	constructor(
		private readonly pricePlanRepository: PricePlanRepository,
		private readonly commonService: CommonService,
	) {}

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
		const pricePlan = await this.getPricePlan(restaurantId, pricePlanId);

		if (pricePlan.isActive && data.isActive === false) {
			await this.commonService.validatePricePlanCanBeDeActivate(
				restaurantId,
				pricePlan,
			);
		}

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

	async getPricePlan(
		restaurantId: string,
		pricePlanId: string,
	): Promise<PricePlan> {
		const pricePlan = await this.pricePlanRepository.findOne(
			restaurantId,
			pricePlanId,
		);

		if (!pricePlan) {
			const response: z.infer<(typeof commonResponses)[404]> = {
				message: `Price plan with ID ${pricePlanId} not found`,
				statusCode: 404,
			};
			throw new BadRequestException(response);
		}

		return pricePlan;
	}
}
