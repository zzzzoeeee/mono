import { Injectable } from '@nestjs/common';
import { c } from '@repo/contracts';
import { TsRestException } from '@ts-rest/nest';
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
			throw new TsRestException(c.tables.updateTable, {
				body: {
					message: 'Cannot deactivate or delete a table with active visits',
				},
				status: 400,
			});
		}
	}

	async validateTableIsActive(
		restaurantId: string,
		tableId: string,
	): Promise<void> {
		const table = await this.tableRepository.findOne(restaurantId, tableId);

		if (!table) {
			throw new TsRestException(c.tables.getTable, {
				body: {
					message: `Table with ID ${tableId} not found`,
				},
				status: 404,
			});
		}

		if (!table.isActive) {
			throw new TsRestException(c.visits.createVisit, {
				body: {
					message: `Table ${tableId} is not active`,
				},
				status: 400,
			});
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
			throw new TsRestException(c.visits.createVisit, {
				body: {
					message: `Table ${tableId} is already in use`,
				},
				status: 400,
			});
		}
	}
}
