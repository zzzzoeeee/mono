import { Module } from '@nestjs/common';
import {
	RestaurantController,
	RestaurantUserController,
	PricePlanController,
} from './controllers';
import {
	RestaurantService,
	RestaurantUserService,
	PricePlanService,
} from './services';
import {
	RestaurantRepository,
	RestaurantUserRepository,
	PricePlanRepository,
} from './repositories';

@Module({
	imports: [],
	controllers: [
		RestaurantController,
		RestaurantUserController,
		PricePlanController,
	],
	providers: [
		RestaurantService,
		RestaurantRepository,
		RestaurantUserService,
		RestaurantUserRepository,
		PricePlanService,
		PricePlanRepository,
	],
	exports: [RestaurantService, RestaurantUserService, PricePlanService],
})
export class RestaurantModule {}
