import { BadRequestException, Injectable } from '@nestjs/common';
import { commonResponses } from '@repo/contracts';
import z from 'zod';
import {
	MenuRepository,
	PricePlanRepository,
	TableRepository,
	VisitRepository,
} from '../repositories';
import { Menu, PricePlan } from '../types';

@Injectable()
export class CommonService {
	constructor(
		private readonly pricePlanRepository: PricePlanRepository,
		private readonly visitRepository: VisitRepository,
		private readonly tableRepository: TableRepository,
		private readonly menuRepository: MenuRepository,
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

	async validateTableCanBeDeactivated(
		restaurantId: string,
		tableId: string,
	): Promise<void> {
		const activeVisits = await this.visitRepository.findAll(restaurantId, {
			tableId,
			status: 'USING',
		});

		if (activeVisits.length > 0) {
			const response: z.infer<(typeof commonResponses)[400]> = {
				message: 'Cannot deactivate or delete a table with active visits',
				statusCode: 400,
				detail: null,
			};
			throw new BadRequestException(response);
		}
	}

	async validateTableIsActive(
		restaurantId: string,
		tableId: string,
	): Promise<void> {
		const table = await this.tableRepository.findOne(restaurantId, tableId);

		if (!table) {
			const response: z.infer<(typeof commonResponses)[404]> = {
				message: `Table with ID ${tableId} not found`,
				statusCode: 404,
			};
			throw new BadRequestException(response);
		}

		if (!table.isActive) {
			const response: z.infer<(typeof commonResponses)[400]> = {
				message: `Table ${tableId} is not active`,
				statusCode: 400,
				detail: null,
			};
			throw new BadRequestException(response);
		}
	}

	async ensureNoOtherVisitIsUsingTable(
		restaurantId: string,
		tableId: string,
	): Promise<void> {
		const visits = await this.visitRepository.findAll(restaurantId, {
			tableId,
			status: 'USING',
		});

		if (visits.length > 0) {
			const response: z.infer<(typeof commonResponses)[400]> = {
				message: `Table ${tableId} is already in use`,
				statusCode: 400,
				detail: null,
			};
			throw new BadRequestException(response);
		}
	}

	async getMenusByIds(
		restaurantId: string,
		menuIds: string[],
	): Promise<Menu[]> {
		return this.menuRepository.findAllByIds(restaurantId, menuIds);
	}

	async validateVisitIsUsing(
		restaurantId: string,
		visitId: string,
	): Promise<void> {
		const visit = await this.visitRepository.findOne(restaurantId, visitId);

		if (!visit) {
			const response: z.infer<(typeof commonResponses)[404]> = {
				message: `Visit with ID ${visitId} not found`,
				statusCode: 404,
			};
			throw new BadRequestException(response);
		}

		if (visit.status !== 'USING') {
			const response: z.infer<(typeof commonResponses)[400]> = {
				message: `Visit ${visitId} is not using`,
				statusCode: 400,
				detail: null,
			};
			throw new BadRequestException(response);
		}
	}
}
