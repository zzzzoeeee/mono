import { Injectable } from '@nestjs/common';
import { Prisma, RestaurantUser } from '@prisma-client';
import { PrismaService } from 'modules/prisma/prisma.service';
import { insensitiveContainSearchQuery } from 'shared/queries';
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
		const { skip, limit, sort, order, role, search } =
			parsePaginationQuery(rawQuery);

		const whereOptions: Prisma.RestaurantUserWhereInput = {
			restaurantId,
			role,
			...(search
				? {
						OR: [
							{
								user: {
									firstName: insensitiveContainSearchQuery(search),
								},
							},
							{
								user: {
									lastName: insensitiveContainSearchQuery(search),
								},
							},
						],
					}
				: {}),
		};

		const orderByOptions: Record<
			NonNullable<typeof sort>,
			Prisma.Enumerable<Prisma.RestaurantUserOrderByWithRelationInput>
		> = {
			createdAt: {
				createdAt: order,
			},
			updatedAt: {
				updatedAt: order,
			},
		};

		const orderBy = orderByOptions[sort || 'createdAt'];

		return this.prisma.restaurantUser.findMany({
			where: whereOptions,
			orderBy,
			take: limit,
			skip,
		});
	}

	async findOne(
		restaurantId: string,
		restaurantUserId: string,
	): Promise<RestaurantUser | null> {
		return this.prisma.restaurantUser.findUnique({
			where: { id: restaurantUserId, restaurantId },
		});
	}

	async update(
		restaurantId: string,
		restaurantUserId: string,
		data: UpdateRestaurantUserInput,
	): Promise<RestaurantUser> {
		return this.prisma.restaurantUser.update({
			where: { id: restaurantUserId, restaurantId },
			data,
		});
	}

	async delete(
		restaurantId: string,
		restaurantUserId: string,
	): Promise<RestaurantUser> {
		return this.prisma.restaurantUser.delete({
			where: { id: restaurantUserId, restaurantId },
		});
	}
}
