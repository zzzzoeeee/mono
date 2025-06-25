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

@Injectable()
export class VisitService {
	constructor(private readonly visitRepository: VisitRepository) {}

	private async ensureNoOtherVisitIsUsingTable(
		restaurantId: string,
		tableId: string,
	) {
		const visit = await this.visitRepository.findAll(restaurantId, {
			tableId,
			status: 'USING',
		});
		if (visit.length > 0) {
			throw new TsRestException(c.visits.createVisit, {
				body: {
					message: `Table ${tableId} is already in use`,
				},
				status: 400,
			});
		}
		return visit;
	}

	async createVisit(
		restaurantId: string,
		data: CreateVisitInput,
	): Promise<Visit> {
		await this.ensureNoOtherVisitIsUsingTable(restaurantId, data.tableId);
		return this.visitRepository.create(restaurantId, data);
	}

	async updateVisit(
		restaurantId: string,
		visitId: string,
		data: UpdateVisitInput,
	): Promise<Visit> {
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
