import { Controller, UseGuards } from '@nestjs/common';
import { c } from '@repo/contracts';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { RestaurantUserRoles } from 'modules/auth/decorators';
import { RestaurantUserGuard } from '../../auth/guards';
import { VisitService } from '../services';

@Controller()
@UseGuards(RestaurantUserGuard)
@RestaurantUserRoles('MANAGER', 'STAFF')
export class VisitController {
	constructor(private readonly visitService: VisitService) {}

	@TsRestHandler(c.visits.createVisit)
	async createVisit() {
		return tsRestHandler(c.visits.createVisit, async ({ body, params }) => {
			const visit = await this.visitService.createVisit(
				params.restaurantId,
				body,
			);
			return {
				status: 201,
				body: visit,
			};
		});
	}

	@TsRestHandler(c.visits.updateVisit)
	async updateVisit() {
		return tsRestHandler(c.visits.updateVisit, async ({ body, params }) => {
			const visit = await this.visitService.updateVisit(
				params.restaurantId,
				params.visitId,
				body,
			);
			return {
				status: 200,
				body: visit,
			};
		});
	}

	@TsRestHandler(c.visits.deleteVisit)
	async deleteVisit() {
		return tsRestHandler(c.visits.deleteVisit, async ({ params }) => {
			await this.visitService.deleteVisit(params.restaurantId, params.visitId);
			return {
				status: 200,
				body: { message: 'Visit deleted successfully' },
			};
		});
	}

	@TsRestHandler(c.visits.getAllVisits)
	async getAllVisits() {
		return tsRestHandler(c.visits.getAllVisits, async ({ params, query }) => {
			const visits = await this.visitService.getVisits(
				params.restaurantId,
				query,
			);
			return {
				status: 200,
				body: visits,
			};
		});
	}

	@TsRestHandler(c.visits.getVisit)
	async getVisit() {
		return tsRestHandler(c.visits.getVisit, async ({ params }) => {
			const visit = await this.visitService.getVisit(
				params.restaurantId,
				params.visitId,
			);
			return {
				status: 200,
				body: visit,
			};
		});
	}
}
