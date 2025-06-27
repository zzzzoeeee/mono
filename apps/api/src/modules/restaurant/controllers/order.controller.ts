import { Controller, UseGuards } from '@nestjs/common';
import { c } from '@repo/contracts';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { RestaurantUserRoles } from '../../auth/decorators';
import { RestaurantUserGuard } from '../../auth/guards';
import { OrderService } from '../services';

@Controller()
@UseGuards(RestaurantUserGuard)
@RestaurantUserRoles('MANAGER')
export class OrderController {
	constructor(private readonly orderService: OrderService) {}

	@TsRestHandler(c.orders.createOrder)
	createOrder() {
		return tsRestHandler(c.orders.createOrder, async ({ body, params }) => {
			const order = await this.orderService.createOrder(
				params.restaurantId,
				body,
			);
			return {
				status: 201,
				body: order,
			};
		});
	}

	@TsRestHandler(c.orders.updateOrderStatus)
	updateOrderStatus() {
		return tsRestHandler(
			c.orders.updateOrderStatus,
			async ({ body, params }) => {
				const order = await this.orderService.updateOrderStatus(
					params.restaurantId,
					params.orderId,
					body.status,
				);
				return {
					status: 200,
					body: order,
				};
			},
		);
	}

	@TsRestHandler(c.orders.getAllOrders)
	getAllOrders() {
		return tsRestHandler(c.orders.getAllOrders, async ({ query, params }) => {
			const orders = await this.orderService.getAllOrders(
				params.restaurantId,
				query,
			);
			return {
				status: 200,
				body: orders,
			};
		});
	}

	@TsRestHandler(c.orders.getOrder)
	getOrder() {
		return tsRestHandler(c.orders.getOrder, async ({ params }) => {
			const order = await this.orderService.getOrder(
				params.restaurantId,
				params.orderId,
			);
			return {
				status: 200,
				body: order,
			};
		});
	}

	@TsRestHandler(c.orders.deleteOrder)
	deleteOrder() {
		return tsRestHandler(c.orders.deleteOrder, async ({ params }) => {
			await this.orderService.deleteOrder(params.restaurantId, params.orderId);
			return {
				status: 200,
				body: {
					message: 'Order deleted successfully',
				},
			};
		});
	}
}
