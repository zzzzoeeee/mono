import { Module } from '@nestjs/common';
import {
	MenuController,
	OrderController,
	PricePlanController,
	RestaurantController,
	RestaurantUserController,
	TableController,
	VisitController,
} from './controllers';
import {
	MenuRepository,
	OrderRepository,
	PricePlanRepository,
	RestaurantRepository,
	RestaurantUserRepository,
	TableRepository,
	VisitRepository,
} from './repositories';
import {
	CommonService,
	MenuService,
	OrderService,
	PricePlanService,
	RestaurantService,
	RestaurantUserService,
	TableService,
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
		OrderController,
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
		CommonService,
		OrderService,
		OrderRepository,
	],
	exports: [],
})
export class RestaurantModule {}
