import { Injectable } from '@nestjs/common';
import { TableRepository } from '../repositories';
import {
	CreateTableInput,
	GetTablesQuery,
	Table,
	UpdateTableInput,
} from '../types';
import { c } from '@repo/contracts';
import { TsRestException } from '@ts-rest/nest';

@Injectable()
export class TableService {
	constructor(private readonly tableRepository: TableRepository) {}

	async createTable(
		restaurantId: string,
		data: CreateTableInput,
	): Promise<Table> {
		return this.tableRepository.createTable(restaurantId, data);
	}

	async getTableById(restaurantId: string, tableId: string): Promise<Table> {
		const table = await this.tableRepository.getTableById(
			restaurantId,
			tableId,
		);

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
		return this.tableRepository.updateTable(restaurantId, id, data);
	}

	async deleteTable(restaurantId: string, id: string): Promise<Table> {
		return this.tableRepository.deleteTable(restaurantId, id);
	}

	async getAllTables(
		restaurantId: string,
		rawQuery: GetTablesQuery,
	): Promise<Table[]> {
		return this.tableRepository.getAllTables(restaurantId, rawQuery);
	}
}
