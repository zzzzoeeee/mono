import { Injectable } from '@nestjs/common';
import { Prisma, Restaurant } from '@prisma-client';
import { PrismaService } from 'shared/modules/prisma/prisma.service';
import { c } from '@repo/contracts';
import z from 'zod';
import { insensitiveContainSearchQuery } from 'shared/queries/insensitive-contain-search.query';
import { parseZodObjectQuery } from 'shared/utils';

@Injectable()
export class RestaurantRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(
		data: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>,
	): Promise<Restaurant> {
		return this.prisma.restaurant.create({
			data,
		});
	}

	async findAll(
		rawQuery: z.infer<typeof c.restaurants.getAllRestaurants.query>,
	): Promise<Restaurant[]> {
		const query = parseZodObjectQuery(rawQuery);

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

	async update(
		id: string,
		data: Partial<Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>>,
	): Promise<Restaurant> {
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
}
