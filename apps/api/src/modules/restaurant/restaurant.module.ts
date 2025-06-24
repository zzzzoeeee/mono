import { Module } from '@nestjs/common';
import {
	MenuController,
	PricePlanController,
	RestaurantController,
	RestaurantUserController,
	TableController,
} from './controllers';
import {
	MenuRepository,
	PricePlanRepository,
	RestaurantRepository,
	RestaurantUserRepository,
	TableRepository,
} from './repositories';
import {
	MenuService,
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
		MenuController,
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
		MenuService,
		MenuRepository,
	],
	exports: [],
})
export class RestaurantModule {}
