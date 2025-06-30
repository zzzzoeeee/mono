import { Injectable } from '@nestjs/common';
import { c } from '@repo/contracts';
import { TsRestException } from '@ts-rest/nest';
import { User } from 'modules/user/types';
import { OrderRepository } from '../repositories/order.repository';
import {
	CreateOrderInput,
	CreateOrderItem,
	CreateOrderItemInput,
	GetOrdersQuery,
	Order,
	OrderStatus,
} from '../types';
import { CommonService } from './common.service';

@Injectable()
export class OrderService {
	constructor(
		private readonly orderRepository: OrderRepository,
		private readonly commonService: CommonService,
	) {}

	async validateAndParseOrderItems(
		restaurantId: string,
		items: CreateOrderItemInput[],
	): Promise<CreateOrderItem[]> {
		const menuIds = items.map((item) => item.menuId);
		const menus = await this.commonService.getMenusByIds(restaurantId, menuIds);

		const { orderItems, notExists, notAvailable } = items.reduce(
			(acc, item) => {
				const menu = menus.find((menu) => menu.id === item.menuId);
				if (!menu) {
					acc.notExists.push(item.menuId);
					return acc;
				}
				if (!menu?.isAvailable) {
					acc.notAvailable.push(item.menuId);
					return acc;
				}
				acc.orderItems.push({
					menuId: item.menuId,
					quantity: item.quantity,
					price: menu.price,
					note: item.note,
				});
				return acc;
			},
			{
				orderItems: [] as CreateOrderItem[],
				notExists: [] as string[],
				notAvailable: [] as string[],
			},
		);

		if (notExists.length > 0 || notAvailable.length > 0) {
			throw new TsRestException(c.orders.createOrder, {
				body: {
					message: 'Failed to create order',
					detail: {
						reasons: [
							...notExists.map((id) => `Menu with ID ${id} not found`),
							...notAvailable.map(
								(id) => `Menu with ID ${id} is not available`,
							),
						],
					},
				},
				status: 400,
			});
		}

		return orderItems;
	}

	async createOrder(
		restaurantId: string,
		data: CreateOrderInput,
	): Promise<Order> {
		const orderItems = await this.validateAndParseOrderItems(
			restaurantId,
			data.items,
		);

		await this.commonService.validateVisitIsUsing(restaurantId, data.visitId);

		return this.orderRepository.create(restaurantId, data, orderItems);
	}

	async updateOrderStatus(
		actor: User | undefined,
		restaurantId: string,
		orderId: string,
		status: OrderStatus,
	): Promise<Order> {
		if (!actor && status !== 'CANCELLED') {
			throw new TsRestException(c.orders.updateOrderStatus, {
				body: {
					message: 'You are not allowed to update this order',
				},
				status: 403,
			});
		}

		const order = await this.getOrder(restaurantId, orderId);
		if (status === 'CANCELLED' && order.status !== 'PENDING') {
			throw new TsRestException(c.orders.updateOrderStatus, {
				body: {
					message: 'Order is not in PENDING state',
				},
				status: 400,
			});
		}

		return this.orderRepository.updateStatus(restaurantId, orderId, status);
	}

	async getAllOrders(
		restaurantId: string,
		query: GetOrdersQuery,
	): Promise<Order[]> {
		return this.orderRepository.findAll(restaurantId, query);
	}

	async getOrder(restaurantId: string, orderId: string): Promise<Order> {
		const order = await this.orderRepository.findOne(restaurantId, orderId);
		if (!order) {
			throw new TsRestException(c.orders.getOrder, {
				body: {
					message: 'Order not found',
				},
				status: 404,
			});
		}
		return order;
	}

	async deleteOrder(restaurantId: string, orderId: string): Promise<Order> {
		return this.orderRepository.delete(restaurantId, orderId);
	}
}
