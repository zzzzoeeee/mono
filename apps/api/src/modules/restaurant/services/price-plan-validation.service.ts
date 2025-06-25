import { BadRequestException, Injectable } from '@nestjs/common';
import { commonResponses } from '@repo/contracts';
import z from 'zod';
import { PricePlanRepository, VisitRepository } from '../repositories';
import { PricePlan } from '../types';

@Injectable()
export class PricePlanValidationService {
	constructor(
		private readonly pricePlanRepository: PricePlanRepository,
		private readonly visitRepository: VisitRepository,
	) {}

	async validatePricePlanIsActive(
		restaurantId: string,
		pricePlanId: string,
	): Promise<void> {
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

		if (!pricePlan.isActive) {
			const response: z.infer<(typeof commonResponses)[400]> = {
				message: `Price plan ${pricePlanId} is not active`,
				statusCode: 400,
				detail: null,
			};
			throw new BadRequestException(response);
		}
	}

	async validatePricePlanCanBeDeActivate(
		restaurantId: string,
		pricePlan: PricePlan,
	): Promise<void> {
		const inUseVisits = await this.visitRepository.findAll(restaurantId, {
			pricePlanId: pricePlan.id,
			status: 'USING',
		});

		if (inUseVisits.length > 0) {
			const response: z.infer<(typeof commonResponses)[400]> = {
				message: `Price plan ${pricePlan.id} cannot be deactivated because it is currently in use by visits`,
				statusCode: 400,
				detail: null,
			};
			throw new BadRequestException(response);
		}
	}
}
