import { Controller } from '@nestjs/common';
import { TableService } from '../services';
import { TsRestHandler } from '@ts-rest/nest';
import { c } from '@repo/contracts';
import { ReqWithUser } from 'shared/types';
import { getUserOrThrow } from 'shared/utils';
import { tsRestHandler } from '@ts-rest/nest';
import { Req } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../auth/guards';
import { Roles } from '../../auth/decorators';

@Controller()
@UseGuards(RolesGuard)
@Roles('ADMIN', 'USER')
export class TableController {
	constructor(private readonly tableService: TableService) {}

	@TsRestHandler(c.tables.createTable)
	async createTable(@Req() req: ReqWithUser) {
		return tsRestHandler(c.tables.createTable, async ({ body, params }) => {
			const user = getUserOrThrow(req, c.tables.createTable);
			const table = await this.tableService.createTable(
				user,
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
	async updateTable(@Req() req: ReqWithUser) {
		return tsRestHandler(c.tables.updateTable, async ({ body, params }) => {
			const user = getUserOrThrow(req, c.tables.updateTable);
			const table = await this.tableService.updateTable(
				user,
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
	async deleteTable(@Req() req: ReqWithUser) {
		return tsRestHandler(c.tables.deleteTable, async ({ params }) => {
			const user = getUserOrThrow(req, c.tables.deleteTable);
			const table = await this.tableService.deleteTable(
				user,
				params.restaurantId,
				params.id,
			);
			return {
				status: 200,
				body: { message: 'Table deleted successfully' },
			};
		});
	}

	@TsRestHandler(c.tables.getTable)
	async getTable(@Req() req: ReqWithUser) {
		return tsRestHandler(c.tables.getTable, async ({ params }) => {
			const user = getUserOrThrow(req, c.tables.getTable);
			const table = await this.tableService.getTableById(
				user,
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
	async getAllTables(@Req() req: ReqWithUser) {
		return tsRestHandler(c.tables.getAllTables, async ({ query, params }) => {
			const user = getUserOrThrow(req, c.tables.getAllTables);
			const tables = await this.tableService.getAllTables(
				user,
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
