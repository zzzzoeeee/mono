import { Injectable, OnModuleInit } from '@nestjs/common';
import { withAccelerate } from '@prisma/extension-accelerate';
import { PrismaClient } from '@prisma-client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
	constructor() {
		super({
			omit: {
				user: {
					password: true,
				},
			},
		});
	}

	async onModuleInit() {
		this.$extends(withAccelerate());
		await this.$connect();
	}
}
