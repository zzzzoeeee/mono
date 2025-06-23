import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client';
import {
	CreateTableInput,
	GetTablesQuery,
	Table,
	UpdateTableInput,
} from '../types';
import { parsePaginationQuery } from 'shared/utils';
import { insensitiveContainSearchQuery } from 'shared/queries';
import { PrismaService } from 'modules/prisma/prisma.service';

@Injectable()
export class TableRepository {
	constructor(private readonly prisma: PrismaService) {}

	async createTable(
		restaurantId: string,
		data: CreateTableInput,
	): Promise<Table> {
		const table = await this.prisma.table.create({
			data: { ...data, restaurantId },
		});
		return {
			...table,
			lastVisit: null,
		};
	}

	async getTableById(
		restaurantId: string,
		tableId: string,
	): Promise<Table | null> {
		const table = await this.prisma.table.findUnique({
			where: { id: tableId, restaurantId },
		});
		return table
			? {
					...table,
					lastVisit: null,
				}
			: null;
	}

	async updateTable(
		restaurantId: string,
		tableId: string,
		data: UpdateTableInput,
	): Promise<Table> {
		const table = await this.prisma.table.update({
			where: { id: tableId, restaurantId },
			data,
		});
		return {
			...table,
			lastVisit: null,
		};
	}

	async deleteTable(restaurantId: string, tableId: string): Promise<Table> {
		const table = await this.prisma.table.delete({
			where: { id: tableId, restaurantId },
		});
		return {
			...table,
			lastVisit: null,
		};
	}

	async getAllTables(
		restaurantId: string,
		rawQuery: GetTablesQuery,
	): Promise<Table[]> {
		const { skip, limit, sort, order, search } = parsePaginationQuery(rawQuery);

		const whereOptions: Prisma.TableWhereInput = {
			restaurantId,
			name: insensitiveContainSearchQuery(search),
			capacity: rawQuery.capacity,
			isActive: rawQuery.isActive,
		};

		const orderByOptions: Record<
			NonNullable<typeof sort>,
			Prisma.Enumerable<Prisma.TableOrderByWithRelationInput>
		> = {
			name: [
				{
					name: order,
				},
				{
					createdAt: order,
				},
			],
			createdAt: {
				createdAt: order,
			},
			updatedAt: {
				updatedAt: order,
			},
			capacity: {
				capacity: order,
			},
			isActive: {
				isActive: order,
			},
		};

		const orderBy = orderByOptions[sort || 'name'];

		const tables = await this.prisma.table.findMany({
			where: whereOptions,
			orderBy,
			take: limit,
			skip,
		});

		return tables.map((table) => ({
			...table,
			lastVisit: null,
		}));
	}
}
