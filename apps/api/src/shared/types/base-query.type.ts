export type basePaginationQuery = {
	page?: number;
	limit?: number;
	order?: 'asc' | 'desc';
	search?: string;
};
