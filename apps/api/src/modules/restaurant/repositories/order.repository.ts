import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma-client';
import { PrismaService } from 'modules/prisma/prisma.service';
import { parsePaginationQuery } from 'shared/utils';
import {
	CreateOrder,
	CreateOrderItem,
	GetOrdersQuery,
	Order,
	OrderStatus,
} from '../types';

@Injectable()
export class OrderRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		restaurantId: string,
		orderData: CreateOrder,
		itemsData: CreateOrderItem[],
	): Promise<Order> {
		return this.prisma.order.create({
			data: {
				...orderData,
				restaurantId,
				status: 'PENDING',
				items: {
					create: itemsData,
				},
			},
			include: {
				items: true,
			},
		});
	}

	async updateStatus(
		restaurantId: string,
		orderId: string,
		status: OrderStatus,
	): Promise<Order> {
		return this.prisma.order.update({
			where: { id: orderId, restaurantId },
			data: { status },
			include: {
				items: true,
			},
		});
	}

	async findAll(restaurantId: string, query: GetOrdersQuery): Promise<Order[]> {
		const { limit, skip } = parsePaginationQuery(query);

		const whereOptions: Prisma.OrderWhereInput = {
			restaurantId,
			status: query.status,
			visitId: query.visitId,
		};

		const orderByOptions: Record<
			NonNullable<typeof query.sort>,
			Prisma.Enumerable<Prisma.OrderOrderByWithRelationInput>
		> = {
			createdAt: {
				createdAt: query.order,
			},
			updatedAt: {
				updatedAt: query.order,
			},
		};

		const orderBy = orderByOptions[query.sort || 'createdAt'];

		return this.prisma.order.findMany({
			where: whereOptions,
			include: {
				items: true,
			},
			orderBy,
			take: limit,
			skip,
		});
	}

	async findOne(restaurantId: string, orderId: string): Promise<Order | null> {
		return this.prisma.order.findUnique({
			where: { id: orderId, restaurantId },
			include: {
				items: true,
			},
		});
	}

	async delete(restaurantId: string, orderId: string): Promise<Order> {
		return this.prisma.order.delete({
			where: { id: orderId, restaurantId },
			include: { items: true },
		});
	}
}
