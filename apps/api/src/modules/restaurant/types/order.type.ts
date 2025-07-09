import { basePaginationQuery } from 'shared/types';

export type OrderStatus = 'PENDING' | 'PREPARING' | 'COMPLETED' | 'CANCELLED';

export type OrderItem = {
	id: string;
	orderId: string;
	menuId: string;
	quantity: number;
	price: number;
	note: string | null;
};

export type Order = {
	id: string;
	visitId: string;
	note: string | null;
	createdAt: Date;
	updatedAt: Date;
	status: OrderStatus;
	items: OrderItem[];
};

export type CreateOrderItemInput = Omit<OrderItem, 'id' | 'orderId' | 'price'>;

export type CreateOrderInput = Omit<
	Order,
	'id' | 'createdAt' | 'updatedAt' | 'items' | 'status'
> & {
	items: CreateOrderItemInput[];
};

export type CreateOrder = Omit<
	Order,
	'id' | 'createdAt' | 'updatedAt' | 'items' | 'status'
>;

export type CreateOrderItem = Omit<OrderItem, 'id' | 'orderId'>;

export type UpdateOrderStatusInput = {
	status: OrderStatus;
};

export type GetOrdersQuery = basePaginationQuery & {
	status?: OrderStatus;
	visitId?: string;
	sort?: 'createdAt' | 'updatedAt';
};
