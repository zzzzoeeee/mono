import { Module } from '@nestjs/common';
import {
	MenuController,
	PricePlanController,
	RestaurantController,
	RestaurantUserController,
	TableController,
	VisitController,
} from './controllers';
import {
	MenuRepository,
	PricePlanRepository,
	RestaurantRepository,
	RestaurantUserRepository,
	TableRepository,
	VisitRepository,
} from './repositories';
import {
	MenuService,
	PricePlanService,
	RestaurantService,
	RestaurantUserService,
	TableService,
	TableValidationService,
	VisitService,
} from './services';

@Module({
	imports: [],
	controllers: [
		RestaurantController,
		RestaurantUserController,
		PricePlanController,
		TableController,
		MenuController,
		VisitController,
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
		VisitService,
		VisitRepository,
		TableValidationService,
	],
	exports: [],
})
export class RestaurantModule {}
