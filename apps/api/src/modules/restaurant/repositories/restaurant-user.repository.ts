import { Injectable } from '@nestjs/common';
import { Prisma, RestaurantUser } from '@prisma-client';
import { PrismaService } from 'shared/modules/prisma/prisma.service';
import { parsePaginationQuery } from 'shared/utils';
import {
	CreateRestaurantUserInput,
	GetRestaurantUsersQuery,
	UpdateRestaurantUserInput,
} from '../types';

@Injectable()
export class RestaurantUserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		restaurantId: string,
		data: CreateRestaurantUserInput,
	): Promise<RestaurantUser> {
		return this.prisma.restaurantUser.create({
			data: {
				...data,
				restaurantId,
			},
		});
	}

	async findAll(
		restaurantId: string,
		rawQuery: GetRestaurantUsersQuery,
	): Promise<RestaurantUser[]> {
		const query = parsePaginationQuery(rawQuery);

		const orderByOptions: Record<
			NonNullable<typeof query.sort>,
			Prisma.Enumerable<Prisma.RestaurantUserOrderByWithRelationInput>
		> = {
			createdAt: {
				createdAt: query.order,
			},
			updatedAt: {
				updatedAt: query.order,
			},
		};

		const orderBy = orderByOptions[query.sort || 'createdAt'];

		return this.prisma.restaurantUser.findMany({
			where: {
				restaurantId,
				role: query.role,
			},
			orderBy,
			take: query.limit,
			skip: query.skip,
		});
	}

	async findOne(id: string): Promise<RestaurantUser | null> {
		return this.prisma.restaurantUser.findUnique({
			where: { id },
		});
	}

	async update(
		id: string,
		data: UpdateRestaurantUserInput,
	): Promise<RestaurantUser> {
		return this.prisma.restaurantUser.update({
			where: { id },
			data,
		});
	}

	async remove(id: string): Promise<RestaurantUser> {
		return this.prisma.restaurantUser.delete({
			where: { id },
		});
	}
}
