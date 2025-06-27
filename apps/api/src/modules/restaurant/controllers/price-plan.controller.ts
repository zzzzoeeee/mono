import { Controller, UseGuards } from '@nestjs/common';
import { c } from '@repo/contracts';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { RestaurantUserRoles } from '../../auth/decorators';
import { RestaurantUserGuard } from '../../auth/guards';
import { PricePlanService } from '../services';

@Controller()
@UseGuards(RestaurantUserGuard)
@RestaurantUserRoles('MANAGER')
@RestaurantUserRoles('STAFF')
export class PricePlanController {
	constructor(private readonly pricePlanService: PricePlanService) {}

	@TsRestHandler(c.pricePlans.createPricePlan)
	async createPricePlan() {
		return tsRestHandler(
			c.pricePlans.createPricePlan,
			async ({ body, params }) => {
				const pricePlan = await this.pricePlanService.createPricePlan(
					params.restaurantId,
					body,
				);
				return {
					status: 201,
					body: pricePlan,
				};
			},
		);
	}

	@TsRestHandler(c.pricePlans.updatePricePlan)
	async updatePricePlan() {
		return tsRestHandler(
			c.pricePlans.updatePricePlan,
			async ({ body, params }) => {
				const pricePlan = await this.pricePlanService.updatePricePlan(
					params.restaurantId,
					params.pricePlanId,
					body,
				);
				return {
					status: 200,
					body: pricePlan,
				};
			},
		);
	}

	@TsRestHandler(c.pricePlans.getPricePlans)
	async getPricePlans() {
		return tsRestHandler(
			c.pricePlans.getPricePlans,
			async ({ query, params }) => {
				const pricePlans = await this.pricePlanService.getPricePlans(
					params.restaurantId,
					query,
				);
				return {
					status: 200,
					body: pricePlans,
				};
			},
		);
	}

	@TsRestHandler(c.pricePlans.getPricePlan)
	async getPricePlan() {
		return tsRestHandler(c.pricePlans.getPricePlan, async ({ params }) => {
			const pricePlan = await this.pricePlanService.getPricePlan(
				params.restaurantId,
				params.pricePlanId,
			);
			return {
				status: 200,
				body: pricePlan,
			};
		});
	}

	@TsRestHandler(c.pricePlans.deletePricePlan)
	async deletePricePlan() {
		return tsRestHandler(c.pricePlans.deletePricePlan, async ({ params }) => {
			await this.pricePlanService.deletePricePlan(
				params.restaurantId,
				params.pricePlanId,
			);
			return {
				status: 200,
				body: { message: 'Price plan deleted successfully' },
			};
		});
	}
}
