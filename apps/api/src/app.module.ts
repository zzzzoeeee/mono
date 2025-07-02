import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { UserModule } from './modules/user/user.module';
import {
	PrismaClientExceptionFilter,
	RequestValidationErrorFilter,
} from './shared/filters';

@Module({
	imports: [
		{
			module: PrismaModule,
			global: true,
		},
		{
			module: UserModule,
			global: true,
		},
		AuthModule,
		RestaurantModule,
	],
	providers: [
		{
			provide: APP_FILTER,
			useClass: PrismaClientExceptionFilter,
		},
		{
			provide: APP_FILTER,
			useClass: RequestValidationErrorFilter,
		},
	],
})
export class AppModule {}
