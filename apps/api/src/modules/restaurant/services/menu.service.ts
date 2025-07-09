import { Injectable } from '@nestjs/common';
import { Menu } from '@prisma-client';
import { MenuRepository } from '../repositories';
import { CreateMenuInput, GetMenusQuery, UpdateMenuInput } from '../types';

@Injectable()
export class MenuService {
	constructor(private readonly menuRepository: MenuRepository) {}

	async createMenu(restaurantId: string, data: CreateMenuInput): Promise<Menu> {
		return this.menuRepository.create(restaurantId, data);
	}

	async getMenus(restaurantId: string, query: GetMenusQuery): Promise<Menu[]> {
		return this.menuRepository.findAll(restaurantId, query);
	}

	async updateMenu(
		restaurantId: string,
		menuId: string,
		data: UpdateMenuInput,
	): Promise<Menu> {
		return this.menuRepository.update(restaurantId, menuId, data);
	}

	async deleteMenu(restaurantId: string, menuId: string): Promise<void> {
		await this.menuRepository.delete(restaurantId, menuId);
	}
}
