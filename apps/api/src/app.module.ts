import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import {
	PrismaClientExceptionFilter,
	RequestValidationErrorFilter,
} from './shared/filters';

@Module({
	imports: [PrismaModule, AuthModule, RestaurantModule],
	controllers: [AppController],
	providers: [
		{
			provide: APP_FILTER,
			useClass: PrismaClientExceptionFilter,
		},
		{
			provide: APP_FILTER,
			useClass: RequestValidationErrorFilter,
		},
		AppService,
	],
})
export class AppModule {}
