import { Module } from '@nestjs/common';
import { RestaurantController, RestaurantUserController } from './controllers';
import { RestaurantService, RestaurantUserService } from './services';
import { RestaurantRepository, RestaurantUserRepository } from './repositories';

@Module({
	imports: [],
	controllers: [RestaurantController, RestaurantUserController],
	providers: [
		RestaurantService,
		RestaurantRepository,
		RestaurantUserService,
		RestaurantUserRepository,
	],
	exports: [RestaurantService, RestaurantUserService],
})
export class RestaurantModule {}
