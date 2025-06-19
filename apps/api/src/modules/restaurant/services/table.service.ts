import { Injectable } from '@nestjs/common';
import { TableRepository } from '../repositories';
import {
	CreateTableInput,
	GetTablesQuery,
	Table,
	UpdateTableInput,
} from '../types';
import { c } from '@repo/contracts';
import { User } from 'modules/user/types';
import { TsRestException } from '@ts-rest/nest';
import { RestaurantService } from './restaurant.service';

@Injectable()
export class TableService {
	constructor(
		private readonly tableRepository: TableRepository,
		private readonly restaurantService: RestaurantService,
	) {}

	async validateRestaurantAccess(
		restaurantId: string,
		actor: User,
		errorType:
			| typeof c.tables.createTable
			| typeof c.tables.updateTable
			| typeof c.tables.deleteTable
			| typeof c.tables.getTable
			| typeof c.tables.getAllTables,
	): Promise<void> {
		if (actor.role === 'USER' && actor.id) {
			const hasAccess =
				await this.restaurantService.checkUserAreRestaurantManager(
					actor.id,
					restaurantId,
				);
			if (!hasAccess) {
				throw new TsRestException(errorType, {
					body: {
						message: 'Access denied to this restaurant',
					},
					status: 403,
				});
			}
		}
	}

	async createTable(
		actor: User,
		restaurantId: string,
		data: CreateTableInput,
	): Promise<Table> {
		await this.validateRestaurantAccess(
			restaurantId,
			actor,
			c.tables.createTable,
		);
		return this.tableRepository.createTable(restaurantId, data);
	}

	async getTableById(
		actor: User,
		restaurantId: string,
		id: string,
	): Promise<Table> {
		await this.validateRestaurantAccess(restaurantId, actor, c.tables.getTable);
		const table = await this.tableRepository.getTableById(id);

		if (!table) {
			throw new TsRestException(c.tables.getTable, {
				body: {
					message: `Table with ID ${id} not found`,
				},
				status: 404,
			});
		}

		return table;
	}

	async updateTable(
		actor: User,
		restaurantId: string,
		id: string,
		data: UpdateTableInput,
	): Promise<Table> {
		await this.validateRestaurantAccess(
			restaurantId,
			actor,
			c.tables.updateTable,
		);
		return this.tableRepository.updateTable(id, data);
	}

	async deleteTable(
		actor: User,
		restaurantId: string,
		id: string,
	): Promise<Table> {
		await this.validateRestaurantAccess(
			restaurantId,
			actor,
			c.tables.deleteTable,
		);
		return this.tableRepository.deleteTable(id);
	}

	async getAllTables(
		actor: User,
		restaurantId: string,
		rawQuery: GetTablesQuery,
	): Promise<Table[]> {
		await this.validateRestaurantAccess(
			restaurantId,
			actor,
			c.tables.getAllTables,
		);
		return this.tableRepository.getAllTables(restaurantId, rawQuery);
	}
}
