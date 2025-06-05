import { Prisma } from '@prisma-client';

export const insensitiveContainSearchQuery = (
	searchString: string | undefined,
): Prisma.StringFilter | undefined => {
	return searchString
		? {
				contains: searchString,
				mode: 'insensitive',
			}
		: undefined;
};
