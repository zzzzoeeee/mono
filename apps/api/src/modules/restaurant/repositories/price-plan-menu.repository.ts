import { Injectable } from '@nestjs/common';
import { PricePlanMenu, Prisma } from '@prisma-client';
import { PrismaService } from 'modules/prisma/prisma.service';
import { parsePaginationQuery } from 'shared/utils';
import {
	CreatePricePlanMenuInput,
	GetPricePlanMenusQuery,
	PricePlanMenuWithMenu,
	UpdatePricePlanMenuInput,
} from '../types';

@Injectable()
export class PricePlanMenuRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		pricePlanId: string,
		data: CreatePricePlanMenuInput,
	): Promise<PricePlanMenu> {
		return this.prisma.pricePlanMenu.create({
			data: {
				...data,
				pricePlanId,
			},
		});
	}

	async findAll(
		restaurantId: string,
		pricePlanId: string,
		rawQuery: GetPricePlanMenusQuery,
	): Promise<PricePlanMenuWithMenu[]> {
		const query = parsePaginationQuery(rawQuery);

		const orderByOptions: Record<
			NonNullable<typeof query.sort>,
			Prisma.Enumerable<Prisma.PricePlanMenuOrderByWithRelationInput>
		> = {
			price: {
				price: query.order,
			},
			createdAt: {
				createdAt: query.order,
			},
			updatedAt: {
				updatedAt: query.order,
			},
		};

		const orderBy = orderByOptions[query.sort || 'price'];

		return this.prisma.pricePlanMenu.findMany({
			where: {
				pricePlanId,
				pricePlan: {
					restaurantId,
				},
			},
			include: {
				menu: true,
			},
			orderBy,
			take: query.limit,
			skip: query.skip,
		});
	}

	async findOne(
		restaurantId: string,
		pricePlanId: string,
		pricePlanMenuId: string,
	): Promise<PricePlanMenu | null> {
		return this.prisma.pricePlanMenu.findFirst({
			where: {
				id: pricePlanMenuId,
				pricePlanId,
				pricePlan: {
					restaurantId,
				},
			},
		});
	}

	async update(
		restaurantId: string,
		pricePlanId: string,
		pricePlanMenuId: string,
		data: UpdatePricePlanMenuInput,
	): Promise<PricePlanMenu> {
		return this.prisma.pricePlanMenu.update({
			where: {
				id: pricePlanMenuId,
				pricePlanId,
				pricePlan: {
					restaurantId,
				},
			},
			data,
		});
	}

	async delete(
		restaurantId: string,
		pricePlanId: string,
		pricePlanMenuId: string,
	): Promise<PricePlanMenu> {
		return this.prisma.pricePlanMenu.delete({
			where: {
				id: pricePlanMenuId,
				pricePlanId,
				pricePlan: {
					restaurantId,
				},
			},
		});
	}

	async findByPricePlanAndMenu(
		pricePlanId: string,
		menuId: string,
	): Promise<PricePlanMenu | null> {
		return this.prisma.pricePlanMenu.findUnique({
			where: {
				pricePlanId_menuId: {
					pricePlanId,
					menuId,
				},
			},
		});
	}
}
