import { Injectable } from '@nestjs/common';
import { c } from '@repo/contracts';
import { TsRestException } from '@ts-rest/nest';
import { TableRepository } from '../repositories';
import {
	CreateTableInput,
	GetTablesQuery,
	Table,
	UpdateTableInput,
} from '../types';
import { CommonService } from './common.service';

@Injectable()
export class TableService {
	constructor(
		private readonly tableRepository: TableRepository,
		private readonly commonService: CommonService,
	) {}

	async createTable(
		restaurantId: string,
		data: CreateTableInput,
	): Promise<Table> {
		return this.tableRepository.create(restaurantId, data);
	}

	async getTable(restaurantId: string, tableId: string): Promise<Table> {
		const table = await this.tableRepository.findOne(restaurantId, tableId);

		if (!table) {
			throw new TsRestException(c.tables.getTable, {
				body: {
					message: `Table with ID ${tableId} not found`,
				},
				status: 404,
			});
		}

		return table;
	}

	async updateTable(
		restaurantId: string,
		id: string,
		data: UpdateTableInput,
	): Promise<Table> {
		if (data.isActive === false) {
			await this.commonService.validateTableCanBeDeactivated(restaurantId, id);
		}
		return this.tableRepository.update(restaurantId, id, data);
	}

	async deleteTable(restaurantId: string, id: string): Promise<Table> {
		await this.commonService.validateTableCanBeDeactivated(restaurantId, id);
		return this.tableRepository.delete(restaurantId, id);
	}

	async getTables(
		restaurantId: string,
		rawQuery: GetTablesQuery,
	): Promise<Table[]> {
		return this.tableRepository.findMany(restaurantId, rawQuery);
	}
}
