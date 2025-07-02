import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client';
import { PrismaService } from 'modules/prisma/prisma.service';
import { parsePaginationQuery } from 'shared/utils';
import {
	CreateVisitInput,
	GetVisitsQuery,
	UpdateVisitInput,
	Visit,
} from '../types';

@Injectable()
export class VisitRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(restaurantId: string, data: CreateVisitInput): Promise<Visit> {
		return this.prisma.visit.create({
			data: {
				restaurantId,
				...data,
			},
		});
	}

	async update(
		restaurantId: string,
		visitId: string,
		data: UpdateVisitInput,
	): Promise<Visit> {
		return this.prisma.visit.update({
			where: { id: visitId, restaurantId },
			data,
		});
	}

	async delete(restaurantId: string, visitId: string): Promise<Visit> {
		return this.prisma.visit.delete({
			where: { id: visitId, restaurantId },
		});
	}

	async findAll(
		restaurantId: string,
		rawQuery: GetVisitsQuery,
	): Promise<Visit[]> {
		const { skip, limit, sort, order } = parsePaginationQuery(rawQuery);

		const whereOptions: Prisma.VisitWhereInput = {
			restaurantId,
			tableId: rawQuery.tableId,
			pricePlanId: rawQuery.pricePlanId,
			customerCount: rawQuery.customerCount,
			status: rawQuery.status,
			...(rawQuery.usingTime && {
				startTime: {
					lte: rawQuery.usingTime,
				},
				OR: [
					{
						departedAt: {
							gte: rawQuery.usingTime,
						},
					},
					{
						departedAt: null,
					},
				],
			}),
			...(rawQuery.visitedAt &&
				rawQuery.departedAt && {
					visitedAt: {
						gte: rawQuery.visitedAt,
					},
					OR: [
						{
							departedAt: {
								lte: rawQuery.departedAt,
							},
						},
						{
							departedAt: null,
						},
					],
				}),
		};

		const orderByOptions: Record<
			NonNullable<typeof sort>,
			Prisma.Enumerable<Prisma.VisitOrderByWithRelationInput>
		> = {
			createdAt: {
				createdAt: order,
			},
			updatedAt: {
				updatedAt: order,
			},
		};

		const orderBy = orderByOptions[sort || 'createdAt'];

		return this.prisma.visit.findMany({
			where: whereOptions,
			skip,
			take: limit,
			orderBy: orderBy,
		});
	}

	async findOne(restaurantId: string, visitId: string): Promise<Visit | null> {
		return this.prisma.visit.findUnique({
			where: { id: visitId, restaurantId },
		});
	}
}
