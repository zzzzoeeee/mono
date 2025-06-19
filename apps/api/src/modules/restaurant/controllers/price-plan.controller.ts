import { Controller, Req } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { c } from '@repo/contracts';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../auth/guards';
import { Roles } from '../../auth/decorators';
import { ReqWithUser } from 'shared/types';
import { getUserOrThrow } from 'shared/utils';
import { PricePlanService } from '../services';

@Controller()
@UseGuards(RolesGuard)
export class PricePlanController {
	constructor(private readonly pricePlanService: PricePlanService) {}

	@TsRestHandler(c.pricePlans.createPricePlan)
	@Roles('ADMIN', 'USER')
	async createPricePlan(@Req() req: ReqWithUser) {
		return tsRestHandler(
			c.pricePlans.createPricePlan,
			async ({ body, params }) => {
				const user = getUserOrThrow(req, c.pricePlans.createPricePlan);
				const pricePlan = await this.pricePlanService.createPricePlan(
					params.restaurantId,
					body,
					user,
				);
				return {
					status: 201,
					body: pricePlan,
				};
			},
		);
	}

	@TsRestHandler(c.pricePlans.updatePricePlan)
	@Roles('ADMIN', 'USER')
	async updatePricePlan(@Req() req: ReqWithUser) {
		return tsRestHandler(
			c.pricePlans.updatePricePlan,
			async ({ body, params }) => {
				const user = getUserOrThrow(req, c.pricePlans.updatePricePlan);
				const pricePlan = await this.pricePlanService.updatePricePlan(
					params.restaurantId,
					params.id,
					body,
					user,
				);
				return {
					status: 200,
					body: pricePlan,
				};
			},
		);
	}

	@TsRestHandler(c.pricePlans.getPricePlans)
	@Roles('ADMIN', 'USER')
	async getPricePlans(@Req() req: ReqWithUser) {
		return tsRestHandler(
			c.pricePlans.getPricePlans,
			async ({ query, params }) => {
				const user = getUserOrThrow(req, c.pricePlans.getPricePlans);
				const pricePlans = await this.pricePlanService.getPricePlans(
					params.restaurantId,
					query,
					user,
				);
				return {
					status: 200,
					body: pricePlans,
				};
			},
		);
	}

	@TsRestHandler(c.pricePlans.deletePricePlan)
	@Roles('ADMIN', 'USER')
	async deletePricePlan(@Req() req: ReqWithUser) {
		return tsRestHandler(c.pricePlans.deletePricePlan, async ({ params }) => {
			const user = getUserOrThrow(req, c.pricePlans.deletePricePlan);
			await this.pricePlanService.deletePricePlan(
				params.restaurantId,
				params.id,
				user,
			);
			return {
				status: 200,
				body: { message: 'Price plan deleted successfully' },
			};
		});
	}
}
