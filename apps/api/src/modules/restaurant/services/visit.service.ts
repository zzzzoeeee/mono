import { Injectable } from '@nestjs/common';
import { c } from '@repo/contracts';
import { TsRestException } from '@ts-rest/nest';
import { VisitRepository } from '../repositories';
import {
	CreateVisitInput,
	GetVisitsQuery,
	UpdateVisitInput,
	Visit,
} from '../types';
import { CommonService } from './common.service';

@Injectable()
export class VisitService {
	constructor(
		private readonly visitRepository: VisitRepository,
		private readonly commonService: CommonService,
	) {}

	async createVisit(
		restaurantId: string,
		data: CreateVisitInput,
	): Promise<Visit> {
		const results = await Promise.allSettled([
			this.commonService.validateTableIsActive(restaurantId, data.tableId),
			this.commonService.ensureNoOtherVisitIsUsingTable(
				restaurantId,
				data.tableId,
			),
			this.commonService.validatePricePlanIsActive(
				restaurantId,
				data.pricePlanId,
			),
		]);

		const errors = results.filter((result) => result.status === 'rejected');

		if (errors.length > 0) {
			throw new TsRestException(c.visits.createVisit, {
				body: {
					message: 'Failed to create visit',
					detail: {
						reasons: errors.map(
							(error) => error.reason?.message ?? 'Unknown error',
						),
					},
				},
				status: 400,
			});
		}

		return this.visitRepository.create(restaurantId, data);
	}

	async updateVisit(
		restaurantId: string,
		visitId: string,
		data: UpdateVisitInput,
	): Promise<Visit> {
		const visit = await this.visitRepository.findOne(restaurantId, visitId);
		if (!visit) {
			throw new TsRestException(c.visits.updateVisit, {
				body: {
					message: `Visit with ID ${visitId} not found`,
				},
				status: 404,
			});
		}

		if (data.tableId && visit.tableId !== data.tableId) {
			await this.commonService.validateTableIsActive(
				restaurantId,
				data.tableId,
			);
			await this.commonService.ensureNoOtherVisitIsUsingTable(
				restaurantId,
				data.tableId,
			);
		}

		if (data.pricePlanId && visit.pricePlanId !== data.pricePlanId) {
			await this.commonService.validatePricePlanIsActive(
				restaurantId,
				data.pricePlanId,
			);
		}

		return this.visitRepository.update(restaurantId, visitId, data);
	}

	async deleteVisit(restaurantId: string, visitId: string): Promise<Visit> {
		return this.visitRepository.delete(restaurantId, visitId);
	}

	async getVisits(
		restaurantId: string,
		query: GetVisitsQuery,
	): Promise<Visit[]> {
		return this.visitRepository.findAll(restaurantId, query);
	}

	async getVisit(restaurantId: string, visitId: string): Promise<Visit> {
		const visit = await this.visitRepository.findOne(restaurantId, visitId);
		if (!visit) {
			throw new TsRestException(c.visits.getVisit, {
				body: {
					message: `Visit with ID ${visitId} not found`,
				},
				status: 404,
			});
		}
		return visit;
	}
}
