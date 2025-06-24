import { Injectable } from '@nestjs/common';
import { Menu, Prisma } from '@prisma-client';
import { PrismaService } from 'modules/prisma/prisma.service';
import { insensitiveContainSearchQuery } from 'shared/queries';
import { parsePaginationQuery } from 'shared/utils';
import { CreateMenuInput, GetMenusQuery, UpdateMenuInput } from '../types';

@Injectable()
export class MenuRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(restaurantId: string, data: CreateMenuInput): Promise<Menu> {
		return this.prisma.menu.create({
			data: { ...data, restaurantId },
		});
	}

	async findAll(
		restaurantId: string,
		rawQuery: GetMenusQuery,
	): Promise<Menu[]> {
		const query = parsePaginationQuery(rawQuery);

		const orderByOptions: Record<
			NonNullable<typeof query.sort>,
			Prisma.Enumerable<Prisma.MenuOrderByWithRelationInput>
		> = {
			name: [
				{
					name: query.order,
				},
			],
			price: [
				{
					price: query.order,
				},
				{
					name: 'asc',
				},
			],
			isAvailable: [
				{
					isAvailable: query.order,
				},
				{
					name: 'asc',
				},
			],
			createdAt: {
				createdAt: query.order,
			},
			updatedAt: {
				updatedAt: query.order,
			},
		};

		const orderBy = orderByOptions[query.sort || 'name'];

		return this.prisma.menu.findMany({
			where: {
				restaurantId,
				category: query.category,
				name: insensitiveContainSearchQuery(query.search),
			},
			orderBy,
			take: query.limit,
			skip: query.skip,
		});
	}

	async findOne(restaurantId: string, menuId: string): Promise<Menu | null> {
		return this.prisma.menu.findUnique({
			where: { id: menuId, restaurantId },
		});
	}

	async update(
		restaurantId: string,
		menuId: string,
		data: UpdateMenuInput,
	): Promise<Menu> {
		return this.prisma.menu.update({
			where: { id: menuId, restaurantId },
			data,
		});
	}

	async delete(restaurantId: string, menuId: string): Promise<Menu> {
		return this.prisma.menu.delete({
			where: { id: menuId, restaurantId },
		});
	}
}
