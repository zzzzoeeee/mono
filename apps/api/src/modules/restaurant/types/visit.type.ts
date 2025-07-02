import { basePaginationQuery } from 'shared/types';

export type VisitStatus = 'USING' | 'FINISHED';

export type Visit = {
	id: string;
	restaurantId: string;
	tableId: string;
	pricePlanId: string;
	customerCount: number;
	createdAt: Date;
	updatedAt: Date;
	visitedAt: Date;
	departedAt: Date | null;
	duration: number | null;
	status: VisitStatus;
	notes: string | null;
};

export type CreateVisitInput = Omit<
	Visit,
	'id' | 'restaurantId' | 'createdAt' | 'updatedAt'
>;

export type UpdateVisitInput = Partial<CreateVisitInput>;

export type GetVisitsQuery = basePaginationQuery & {
	tableId?: string;
	pricePlanId?: string;
	customerCount?: number;
	status?: VisitStatus;
	visitedAt?: Date;
	departedAt?: Date;
	usingTime?: Date;
	sort?: 'createdAt' | 'updatedAt';
};
