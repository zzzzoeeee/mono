import { Injectable } from '@nestjs/common';
import { c } from '@repo/contracts';
import { TsRestException } from '@ts-rest/nest';
import { UserRepository } from '../repositories';
import { CreateUserInput, User } from '../types';

@Injectable()
export class UserService {
	constructor(private readonly userRepository: UserRepository) {}

	async findOne(id: string): Promise<User | null> {
		const user = await this.userRepository.findOne(id);
		if (!user) {
			throw new TsRestException(c.users.me, {
				body: {
					message: `User with ID ${id} not found`,
				},
				status: 404,
			});
		}
		return user;
	}

	async findByEmail(
		...args: Parameters<UserRepository['findByEmail']>
	): Promise<ReturnType<UserRepository['findByEmail']>> {
		return this.userRepository.findByEmail(...args);
	}

	async create(data: CreateUserInput): Promise<User> {
		return this.userRepository.create(data);
	}
}
