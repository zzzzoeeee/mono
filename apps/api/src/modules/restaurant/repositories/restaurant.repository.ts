import { Injectable } from '@nestjs/common';
import { Prisma, Restaurant } from '@prisma-client';
import { PrismaService } from 'modules/prisma/prisma.service';
import { insensitiveContainSearchQuery } from 'shared/queries';
import { parsePaginationQuery } from 'shared/utils';
import {
	CreateRestaurantInput,
	GetRestaurantsQuery,
	RestaurantUserRole,
	UpdateRestaurantInput,
} from '../types';

@Injectable()
export class RestaurantRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: CreateRestaurantInput): Promise<Restaurant> {
		return this.prisma.restaurant.create({
			data,
		});
	}

	async findAll(rawQuery: GetRestaurantsQuery): Promise<Restaurant[]> {
		const query = parsePaginationQuery(rawQuery);

		const orderByOptions: Record<
			NonNullable<typeof query.sort>,
			Prisma.Enumerable<Prisma.RestaurantOrderByWithRelationInput>
		> = {
			name: [
				{
					name: query.order,
				},
				{
					createdAt: query.order,
				},
			],
			createdAt: {
				createdAt: query.order,
			},
			updatedAt: {
				updatedAt: query.order,
			},
		};

		const orderBy = orderByOptions[query.sort || 'name'];

		return this.prisma.restaurant.findMany({
			where: {
				name: insensitiveContainSearchQuery(query.search),
			},
			orderBy,
			take: query.limit,
			skip: query.skip,
		});
	}

	async findOne(id: string): Promise<Restaurant | null> {
		return this.prisma.restaurant.findUnique({
			where: { id },
		});
	}

	async update(id: string, data: UpdateRestaurantInput): Promise<Restaurant> {
		return this.prisma.restaurant.update({
			where: { id },
			data,
		});
	}

	async remove(id: string): Promise<Restaurant> {
		return this.prisma.restaurant.delete({
			where: { id },
		});
	}

	async isUserInRestaurantWithRoles(
		userId: string,
		restaurantId: string,
		roles: RestaurantUserRole[] | RestaurantUserRole,
	): Promise<boolean> {
		const restaurantUser = await this.prisma.restaurantUser.findFirst({
			where: {
				userId,
				restaurantId,
				role: {
					in: Array.isArray(roles) ? roles : [roles],
				},
			},
		});
		return !!restaurantUser;
	}
}
