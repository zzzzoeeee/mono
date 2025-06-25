import { BadRequestException, Injectable } from '@nestjs/common';
import { commonResponses } from '@repo/contracts';
import z from 'zod';
import { VisitRepository } from '../repositories';
import { TableRepository } from '../repositories/table.repository';

@Injectable()
export class TableValidationService {
	constructor(
		private readonly visitRepository: VisitRepository,
		private readonly tableRepository: TableRepository,
	) {}

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
}
