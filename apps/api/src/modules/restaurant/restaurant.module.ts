import { Module } from '@nestjs/common';
import {
	PricePlanController,
	RestaurantController,
	RestaurantUserController,
	TableController,
} from './controllers';
import {
	PricePlanRepository,
	RestaurantRepository,
	RestaurantUserRepository,
	TableRepository,
} from './repositories';
import {
	PricePlanService,
	RestaurantService,
	RestaurantUserService,
	TableService,
} from './services';

@Module({
	imports: [],
	controllers: [
		RestaurantController,
		RestaurantUserController,
		PricePlanController,
		TableController,
	],
	providers: [
		RestaurantService,
		RestaurantRepository,
		RestaurantUserService,
		RestaurantUserRepository,
		PricePlanService,
		PricePlanRepository,
		TableService,
		TableRepository,
	],
	exports: [],
})
export class RestaurantModule {}
