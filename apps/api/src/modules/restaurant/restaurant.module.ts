import { Module } from '@nestjs/common';
import {
	RestaurantController,
	RestaurantUserController,
	PricePlanController,
	TableController,
} from './controllers';
import {
	RestaurantService,
	RestaurantUserService,
	PricePlanService,
	TableService,
} from './services';
import {
	RestaurantRepository,
	RestaurantUserRepository,
	PricePlanRepository,
	TableRepository,
} from './repositories';

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
