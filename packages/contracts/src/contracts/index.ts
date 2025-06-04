import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { restaurantContract } from './restaurant.contract';
import { tableContract } from './table.contract';
import { visitContract } from './visit.contract';
import { pricePlanContract } from './price-plan.contract';
import { menuContract } from './menu.contract';
import { orderContract } from './order.contract';

extendZodWithOpenApi(z);

const contract = initContract();

export const c = contract.router({
	restaurants: restaurantContract,
	menus: menuContract,
	pricePlans: pricePlanContract,
	tables: tableContract,
	visits: visitContract,
	orders: orderContract,
});
