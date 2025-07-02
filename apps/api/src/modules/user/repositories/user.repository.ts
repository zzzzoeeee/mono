import { Injectable } from '@nestjs/common';
import { PrismaService } from 'modules/prisma/prisma.service';
import { CreateUserInput, User, UserWithPassword } from '../types';

@Injectable()
export class UserRepository {
	constructor(private readonly prisma: PrismaService) {}

	async create(data: CreateUserInput): Promise<User> {
		return this.prisma.user.create({
			data: {
				email: data.email,
				password: data.hashedPassword,
				firstName: data.firstName,
				lastName: data.lastName,
			},
		});
	}

	async findOne(id: string): Promise<User | null> {
		return this.prisma.user.findUnique({
			where: { id },
		});
	}

	async findByEmail(email: string): Promise<User | null>;
	async findByEmail(
		email: string,
		withPassword: true,
	): Promise<UserWithPassword | null>;
	async findByEmail(
		email: string,
		withPassword?: boolean,
	): Promise<User | UserWithPassword | null> {
		return this.prisma.user.findUnique({
			where: { email },
			omit: {
				password: !withPassword,
			},
		});
	}
}
