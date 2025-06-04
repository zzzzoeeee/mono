import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@anatine/zod-openapi';
import { restaurantContract } from './restaurant.contract';

extendZodWithOpenApi(z);

const contract = initContract();

export const c = contract.router({
	restaurants: restaurantContract,
});
