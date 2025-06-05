import { z } from 'zod';

export const basePaginationQuery = z.object({
	page: z.coerce.number().optional().default(1),
	limit: z.coerce.number().optional().default(10),
	order: z.enum(['asc', 'desc']).optional().default('asc'),
	search: z.string().optional(),
});
