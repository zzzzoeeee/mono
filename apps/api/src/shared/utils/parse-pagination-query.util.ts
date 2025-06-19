type basePagination = {
	page?: number;
	limit?: number;
	order?: 'asc' | 'desc';
	sort?: string | undefined;
	search?: string | undefined;
};

export const parsePaginationQuery = <T extends basePagination>(query: T) => {
	const page = query.page || 1;
	const limit = query.limit || 10;
	const skip = (page - 1) * limit;

	return {
		...query,
		page,
		limit,
		skip,
	};
};
