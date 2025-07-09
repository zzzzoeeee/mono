import { Controller, UseGuards } from '@nestjs/common';
import { c } from '@repo/contracts';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { RestaurantUserRoles } from '../../auth/decorators';
import { RestaurantUserGuard } from '../../auth/guards';
import { PricePlanMenuService } from '../services';

@Controller()
@UseGuards(RestaurantUserGuard)
@RestaurantUserRoles('MANAGER', 'STAFF')
export class PricePlanMenuController {
	constructor(private readonly pricePlanMenuService: PricePlanMenuService) {}

	@TsRestHandler(c.pricePlanMenus.createPricePlanMenu)
	async createPricePlanMenu() {
		return tsRestHandler(
			c.pricePlanMenus.createPricePlanMenu,
			async ({ body, params }) => {
				const pricePlanMenu =
					await this.pricePlanMenuService.createPricePlanMenu(
						params.restaurantId,
						params.pricePlanId,
						body,
					);
				return {
					status: 201,
					body: pricePlanMenu,
				};
			},
		);
	}

	@TsRestHandler(c.pricePlanMenus.getPricePlanMenus)
	@RestaurantUserRoles('MANAGER', 'STAFF', 'GUEST')
	async getPricePlanMenus() {
		return tsRestHandler(
			c.pricePlanMenus.getPricePlanMenus,
			async ({ query, params }) => {
				const pricePlanMenus =
					await this.pricePlanMenuService.getPricePlanMenus(
						params.restaurantId,
						params.pricePlanId,
						query,
					);
				return {
					status: 200,
					body: pricePlanMenus,
				};
			},
		);
	}

	@TsRestHandler(c.pricePlanMenus.updatePricePlanMenu)
	async updatePricePlanMenu() {
		return tsRestHandler(
			c.pricePlanMenus.updatePricePlanMenu,
			async ({
				params: { restaurantId, pricePlanId, pricePlanMenuId },
				body,
			}) => {
				const pricePlanMenu =
					await this.pricePlanMenuService.updatePricePlanMenu(
						restaurantId,
						pricePlanId,
						pricePlanMenuId,
						body,
					);
				return {
					status: 200,
					body: pricePlanMenu,
				};
			},
		);
	}

	@TsRestHandler(c.pricePlanMenus.deletePricePlanMenu)
	async deletePricePlanMenu() {
		return tsRestHandler(
			c.pricePlanMenus.deletePricePlanMenu,
			async ({ params: { restaurantId, pricePlanId, pricePlanMenuId } }) => {
				await this.pricePlanMenuService.deletePricePlanMenu(
					restaurantId,
					pricePlanId,
					pricePlanMenuId,
				);
				return {
					status: 200,
					body: {
						message: 'Price plan menu deleted successfully',
					},
				};
			},
		);
	}
}
