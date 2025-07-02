import { Module } from '@nestjs/common';
import {
	MenuController,
	OrderController,
	PricePlanController,
	PricePlanMenuController,
	RestaurantController,
	RestaurantUserController,
	TableController,
	VisitController,
} from './controllers';
import {
	MenuRepository,
	OrderRepository,
	PricePlanMenuRepository,
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
	PricePlanMenuService,
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
		PricePlanMenuController,
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
		PricePlanMenuService,
		PricePlanMenuRepository,
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
	exports: [VisitService],
})
export class RestaurantModule {}
