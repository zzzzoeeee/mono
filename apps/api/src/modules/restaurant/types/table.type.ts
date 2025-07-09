import { basePaginationQuery } from 'shared/types';

export type Table = {
	id: string;
	restaurantId: string;
	name: string;
	capacity: number;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
	lastVisit: null;
};

export type CreateTableInput = Omit<
	Table,
	'id' | 'createdAt' | 'updatedAt' | 'restaurantId' | 'lastVisit'
>;

export type UpdateTableInput = Partial<CreateTableInput>;

export type GetTablesQuery = basePaginationQuery & {
	sort?: 'name' | 'createdAt' | 'updatedAt' | 'capacity' | 'isActive';
	capacity?: number;
	isActive?: boolean;
	visitStatus?: unknown;
};
