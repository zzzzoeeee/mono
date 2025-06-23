import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client';
import { PrismaService } from 'modules/prisma/prisma.service';
import { insensitiveContainSearchQuery } from 'shared/queries';
import { parsePaginationQuery } from 'shared/utils';
import {
	CreateTableInput,
	GetTablesQuery,
	Table,
	UpdateTableInput,
} from '../types';

@Injectable()
export class TableRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(restaurantId: string, data: CreateTableInput): Promise<Table> {
		const table = await this.prisma.table.create({
			data: { ...data, restaurantId },
		});
		return {
			...table,
			lastVisit: null,
		};
	}

	async findOne(restaurantId: string, tableId: string): Promise<Table | null> {
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

	async update(
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

	async delete(restaurantId: string, tableId: string): Promise<Table> {
		const table = await this.prisma.table.delete({
			where: { id: tableId, restaurantId },
		});
		return {
			...table,
			lastVisit: null,
		};
	}

	async findMany(
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
