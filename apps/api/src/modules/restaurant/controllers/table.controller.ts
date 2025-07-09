import { Controller, UseGuards } from '@nestjs/common';
import { c } from '@repo/contracts';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { RestaurantUserRoles } from '../../auth/decorators';
import { RestaurantUserGuard } from '../../auth/guards';
import { TableService } from '../services';

@Controller()
@UseGuards(RestaurantUserGuard)
@RestaurantUserRoles('MANAGER', 'STAFF')
export class TableController {
	constructor(private readonly tableService: TableService) {}

	@TsRestHandler(c.tables.createTable)
	async createTable() {
		return tsRestHandler(c.tables.createTable, async ({ body, params }) => {
			const table = await this.tableService.createTable(
				params.restaurantId,
				body,
			);
			return {
				status: 201,
				body: table,
			};
		});
	}

	@TsRestHandler(c.tables.updateTable)
	async updateTable() {
		return tsRestHandler(c.tables.updateTable, async ({ body, params }) => {
			const table = await this.tableService.updateTable(
				params.restaurantId,
				params.id,
				body,
			);
			return {
				status: 200,
				body: table,
			};
		});
	}

	@TsRestHandler(c.tables.deleteTable)
	async deleteTable() {
		return tsRestHandler(c.tables.deleteTable, async ({ params }) => {
			await this.tableService.deleteTable(params.restaurantId, params.id);
			return {
				status: 200,
				body: { message: 'Table deleted successfully' },
			};
		});
	}

	@TsRestHandler(c.tables.getTable)
	@RestaurantUserRoles('MANAGER', 'STAFF', 'GUEST')
	async getTable() {
		return tsRestHandler(c.tables.getTable, async ({ params }) => {
			const table = await this.tableService.getTable(
				params.restaurantId,
				params.id,
			);
			return {
				status: 200,
				body: table,
			};
		});
	}

	@TsRestHandler(c.tables.getAllTables)
	async getAllTables() {
		return tsRestHandler(c.tables.getAllTables, async ({ query, params }) => {
			const tables = await this.tableService.getTables(
				params.restaurantId,
				query,
			);
			return {
				status: 200,
				body: tables,
			};
		});
	}
}
