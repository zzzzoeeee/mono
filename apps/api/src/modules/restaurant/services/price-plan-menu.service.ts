import { Injectable } from '@nestjs/common';
import { PricePlanMenu } from '@prisma-client';
import { c } from '@repo/contracts';
import { TsRestException } from '@ts-rest/nest';
import {
	MenuRepository,
	PricePlanMenuRepository,
	PricePlanRepository,
} from '../repositories';
import {
	CreatePricePlanMenuInput,
	GetPricePlanMenusQuery,
	PricePlanMenuWithMenu,
	UpdatePricePlanMenuInput,
} from '../types';

@Injectable()
export class PricePlanMenuService {
	constructor(
		private readonly pricePlanMenuRepository: PricePlanMenuRepository,
		private readonly pricePlanRepository: PricePlanRepository,
		private readonly menuRepository: MenuRepository,
	) {}

	async createPricePlanMenu(
		restaurantId: string,
		pricePlanId: string,
		data: CreatePricePlanMenuInput,
	): Promise<PricePlanMenu> {
		const pricePlan = await this.pricePlanRepository.findOne(
			restaurantId,
			pricePlanId,
		);
		if (!pricePlan) {
			throw new TsRestException(c.pricePlanMenus.createPricePlanMenu, {
				body: {
					message: 'Price plan not found',
				},
				status: 404,
			});
		}

		const menu = await this.menuRepository.findOne(restaurantId, data.menuId);
		if (!menu) {
			throw new TsRestException(c.pricePlanMenus.createPricePlanMenu, {
				body: {
					message: 'Menu not found',
				},
				status: 404,
			});
		}

		const existing = await this.pricePlanMenuRepository.findByPricePlanAndMenu(
			pricePlanId,
			data.menuId,
		);
		if (existing) {
			throw new TsRestException(c.pricePlanMenus.createPricePlanMenu, {
				body: {
					message: 'Menu item already exists in this price plan',
				},
				status: 400,
			});
		}

		return this.pricePlanMenuRepository.create(pricePlanId, data);
	}

	async getPricePlanMenus(
		restaurantId: string,
		pricePlanId: string,
		query: GetPricePlanMenusQuery,
	): Promise<PricePlanMenuWithMenu[]> {
		return this.pricePlanMenuRepository.findAll(
			restaurantId,
			pricePlanId,
			query,
		);
	}

	async updatePricePlanMenu(
		restaurantId: string,
		pricePlanId: string,
		pricePlanMenuId: string,
		data: UpdatePricePlanMenuInput,
	): Promise<PricePlanMenu> {
		const pricePlanMenu = await this.pricePlanMenuRepository.findOne(
			restaurantId,
			pricePlanId,
			pricePlanMenuId,
		);
		if (!pricePlanMenu) {
			throw new TsRestException(c.pricePlanMenus.updatePricePlanMenu, {
				body: {
					message: 'Price plan menu not found',
				},
				status: 404,
			});
		}

		return this.pricePlanMenuRepository.update(
			restaurantId,
			pricePlanId,
			pricePlanMenuId,
			data,
		);
	}

	async deletePricePlanMenu(
		restaurantId: string,
		pricePlanId: string,
		pricePlanMenuId: string,
	): Promise<void> {
		const pricePlanMenu = await this.pricePlanMenuRepository.findOne(
			restaurantId,
			pricePlanId,
			pricePlanMenuId,
		);
		if (!pricePlanMenu) {
			throw new TsRestException(c.pricePlanMenus.deletePricePlanMenu, {
				body: {
					message: 'Price plan menu not found',
				},
				status: 404,
			});
		}

		await this.pricePlanMenuRepository.delete(
			restaurantId,
			pricePlanId,
			pricePlanMenuId,
		);
	}
}
