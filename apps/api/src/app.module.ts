import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestaurantModule } from './modules/restaurant/restaurant.module';
import { PrismaModule } from './shared/modules/prisma/prisma.module';
import { APP_FILTER } from '@nestjs/core';
import { PrismaClientExceptionFilter } from './shared/filters';

@Module({
	imports: [PrismaModule, RestaurantModule],
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
