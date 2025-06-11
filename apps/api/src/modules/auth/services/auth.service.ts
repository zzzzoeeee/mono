import { Injectable } from '@nestjs/common';
import { UserService } from '../../user/services';
import { CreateUserInput, User } from '../../user/types';
import { LoginInput } from '../types';
import * as argon2 from 'argon2';
import { TsRestException } from '@ts-rest/nest';
import { c } from '@repo/contracts';

@Injectable()
export class AuthService {
	constructor(private readonly userService: UserService) {}

	async register(
		user: Omit<CreateUserInput, 'hashedPassword'> & { password: string },
	) {
		const hashedPassword = await argon2.hash(user.password);

		return this.userService.create({
			...user,
			hashedPassword,
		}); 
	}

	async validateUser(email: string, password: string): Promise<User | null> {
		const user = await this.userService.findByEmail(email, true);
		if (user && (await argon2.verify(user.password, password))) {
			return user;
		}

		return null;
	}

	async login(user: LoginInput) {
		const validatedUser = await this.validateUser(user.email, user.password);
		if (!validatedUser) {
			throw new TsRestException(c.auth.login, {
				body: {
					message: 'Invalid credentials',
				},
				status: 401,
			});
		}

		return {
			user: validatedUser,
		};
	}
}
