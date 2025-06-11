import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { PrismaModule } from './shared/modules/prisma/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientExceptionFilter } from './shared/filters';
import { AuthModule } from './modules/auth/auth.module';

@Module({
	imports: [PrismaModule, AuthModule, RestaurantModule],
	controllers: [AppController],
	providers: [
		{
			provide: APP_FILTER,
			useClass: PrismaClientExceptionFilter,
		},
		AppService,
	],
})
export class AppModule {}
