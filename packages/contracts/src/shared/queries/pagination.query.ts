import { z, ZodEnum } from 'zod';

const paginationQuery = z.object({
	page: z.number().optional().default(1),
	limit: z.number().optional().default(10),
	sort: z.string().optional(),
	order: z.enum(['asc', 'desc']).optional().default('asc'),
	search: z.string().optional(),
});

export const getPaginationQuery = ({
	sort,
}: {
	sort: [string, ...string[]];
}) => {
	return paginationQuery.extend({
		sort: z.enum(sort).optional().describe('Sort by'),
	});
};
