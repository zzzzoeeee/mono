import { Controller, UseGuards } from '@nestjs/common';
import { c } from '@repo/contracts';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { RestaurantUserRoles } from '../../auth/decorators';
import { RestaurantUserGuard } from '../../auth/guards';
import { MenuService } from '../services/menu.service';

@Controller()
@UseGuards(RestaurantUserGuard)
@RestaurantUserRoles('MANAGER')
export class MenuController {
	constructor(private readonly menuService: MenuService) {}

	@TsRestHandler(c.menus.createMenu)
	async createMenu() {
		return tsRestHandler(c.menus.createMenu, async ({ body, params }) => {
			const menu = await this.menuService.createMenu(params.restaurantId, body);
			return {
				status: 201,
				body: menu,
			};
		});
	}

	@TsRestHandler(c.menus.getMenus)
	async getMenus() {
		return tsRestHandler(c.menus.getMenus, async ({ query, params }) => {
			const menus = await this.menuService.getMenus(params.restaurantId, query);
			return {
				status: 200,
				body: menus,
			};
		});
	}

	@TsRestHandler(c.menus.updateMenu)
	async updateMenu() {
		return tsRestHandler(
			c.menus.updateMenu,
			async ({ params: { restaurantId, menuId }, body }) => {
				const menu = await this.menuService.updateMenu(
					restaurantId,
					menuId,
					body,
				);
				return {
					status: 200,
					body: menu,
				};
			},
		);
	}

	@TsRestHandler(c.menus.deleteMenu)
	async deleteMenu() {
		return tsRestHandler(
			c.menus.deleteMenu,
			async ({ params: { restaurantId, menuId } }) => {
				await this.menuService.deleteMenu(restaurantId, menuId);
				return {
					status: 200,
					body: {
						message: 'Menu deleted successfully',
					},
				};
			},
		);
	}
}
