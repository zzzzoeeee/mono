import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PricePlan, Prisma } from '@prisma-client';
import {
	GetPricePlansQuery,
	CreatePricePlanInput,
	UpdatePricePlanInput,
} from '../types';
import { parsePaginationQuery } from 'shared/utils';
import { insensitiveContainSearchQuery } from 'shared/queries';

@Injectable()
export class PricePlanRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		data: CreatePricePlanInput & { restaurantId: string },
	): Promise<PricePlan> {
		return this.prisma.pricePlan.create({ data });
	}

	async update(
		restaurantId: string,
		pricePlanId: string,
		data: UpdatePricePlanInput,
	): Promise<PricePlan> {
		return this.prisma.pricePlan.update({
			where: { id: pricePlanId, restaurantId },
			data,
		});
	}

	async findAll(
		restaurantId: string,
		query: GetPricePlansQuery,
	): Promise<PricePlan[]> {
		const { skip, limit, sort, order, search, isActive } =
			parsePaginationQuery(query);

		const whereOptions: Prisma.PricePlanWhereInput = {
			restaurantId,
			isActive,
			...(search
				? {
						OR: [
							{
								name: insensitiveContainSearchQuery(search),
							},
						],
					}
				: {}),
		};

		const orderByOptions: Record<
			NonNullable<typeof sort>,
			Prisma.Enumerable<Prisma.PricePlanOrderByWithRelationInput>
		> = {
			price: {
				price: order,
			},
			isActive: {
				isActive: order,
			},
			name: {
				name: order,
			},
			createdAt: {
				createdAt: order,
			},
			updatedAt: {
				updatedAt: order,
			},
		};

		const orderBy = orderByOptions[sort || 'createdAt'];

		return this.prisma.pricePlan.findMany({
			where: whereOptions,
			skip,
			take: limit,
			orderBy,
		});
	}

	async delete(restaurantId: string, pricePlanId: string): Promise<void> {
		await this.prisma.pricePlan.delete({
			where: { id: pricePlanId, restaurantId },
		});
	}
}
