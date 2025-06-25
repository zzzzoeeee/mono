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
import { TableValidationService } from './table-validation.service';

@Injectable()
export class VisitService {
	constructor(
		private readonly visitRepository: VisitRepository,
		private readonly tableValidationService: TableValidationService,
	) {}

	async createVisit(
		restaurantId: string,
		data: CreateVisitInput,
	): Promise<Visit> {
		await this.tableValidationService.validateTableIsActive(
			restaurantId,
			data.tableId,
		);
		await this.tableValidationService.ensureNoOtherVisitIsUsingTable(
			restaurantId,
			data.tableId,
		);
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
			await this.tableValidationService.validateTableIsActive(
				restaurantId,
				data.tableId,
			);
			await this.tableValidationService.ensureNoOtherVisitIsUsingTable(
				restaurantId,
				data.tableId,
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
